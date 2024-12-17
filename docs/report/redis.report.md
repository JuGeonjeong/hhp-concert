# 콘서트 대기열 서비스 성능 개선을 위한 분석 문서

## 개요

콘서트 대기열 서비스에서 조회가 오래 걸리는 쿼리를 캐싱하거나 Redis를 이용해 성능을 개선할 수 있는 방법을 검토합니다. Redis는 고성능 인메모리 데이터 저장소로, 데이터베이스보다 훨씬 빠르게 데이터를 처리할 수 있어 대기열과 같은 높은 트래픽을 처리하는 시스템에 적합합니다. 이 문서는 Redis를 활용하여 성능을 개선할 수 있는 주요 영역과 이유를 설명합니다.

---

## 1. 주요 성능 개선 대상 및 Redis 도입 이유

### 1.1 대기열 조회 로직

- **문제점**: 많은 사용자가 동시에 콘서트 대기열에 접근할 때, 대기열 상태를 지속적으로 조회해야 합니다. 이를 데이터베이스에서 직접 조회하면 쿼리 부하가 발생하고, 특히 여러 사용자가 동시 접근 시 데이터베이스의 응답 속도가 느려질 수 있습니다.
- **해결 방안**: Redis에 대기열 상태를 캐싱하여 사용자들이 데이터를 Redis에서 직접 조회하도록 합니다. Redis는 인메모리 데이터 저장소이므로 데이터베이스보다 훨씬 빠르게 데이터를 반환할 수 있습니다.
- **적용 방법**:
  - 대기열에 변경 사항이 발생할 때만 Redis에 업데이트하고, 사용자는 대기열 상태 조회 시 Redis 캐시를 참조합니다.
  - Redis의 `LIST` 자료구조를 사용해 대기열 상태를 저장하고 관리할 수 있습니다.

---

## 2. 캐싱 전략

### 2.1 TTL 기반의 대기열 상태 캐싱

- **문제점**: 대기열의 순위나 남은 좌석 수는 자주 변동되므로, 모든 변경사항을 데이터베이스에 실시간으로 반영하고 조회하는 것은 비효율적입니다.
- **해결 방안**: TTL(Time-To-Live) 기반의 캐싱을 통해 데이터베이스를 지속적으로 조회하지 않고, 일정 시간 동안 Redis에 캐시된 값을 제공합니다. 이로 인해 데이터베이스 쿼리 수를 줄이고, 성능을 크게 향상시킬 수 있습니다.
- **적용 방법**:
  - Redis에 저장된 대기열 데이터에 일정 시간(TTL)을 설정하여, 변경 사항이 있을 때만 데이터베이스를 업데이트합니다.
  - TTL이 만료된 이후에는 새롭게 갱신된 대기열 정보를 데이터베이스에서 다시 조회하여 캐시에 저장합니다.
- **장점**: 대기열 데이터의 최신성 유지와 동시에 불필요한 데이터베이스 호출을 줄일 수 있습니다.

---

## 3. 좌석 예약 및 대기열 진입 로직에서의 Redis 활용

### 3.1 분산 락을 통한 좌석 예약 충돌 방지

- **문제점**: 여러 사용자가 동시에 동일한 좌석을 예약하려고 할 때 데이터베이스의 동시성 문제가 발생할 수 있습니다.
- **해결 방안**: Redis의 `SETNX` 명령을 사용한 분산 락을 통해 좌석 예약 시 동시에 여러 사용자가 동일 좌석을 예약하지 않도록 합니다. Redis는 락 해제 시간이 지나면 자동으로 락을 해제할 수 있는 TTL 설정을 지원하므로, 특정 시간이 지나면 자동으로 락이 해제됩니다.
- **적용 방법**:
  - 사용자가 좌석을 예약할 때 Redis에 분산 락을 설정하여 다른 사용자가 동일한 좌석을 예약하지 못하도록 합니다.
  - 예약이 완료되거나 실패할 경우, 락을 해제하여 다른 사용자들이 해당 좌석을 예약할 수 있도록 합니다.

---

## 4. 대기열 순서 및 상태 저장

### 4.1 Sorted Set을 활용한 대기열 순서 관리

- **문제점**: 대기열에 진입한 사용자들이 자신의 순서를 확인하거나, 남은 대기열 수를 조회하는 등의 요청이 빈번하게 발생할 수 있습니다. 이를 매번 데이터베이스에서 처리하면 성능 저하가 발생할 수 있습니다.
- **해결 방안**: Redis의 `Sorted Set` 자료구조를 사용하여 사용자들이 대기열에서의 순서를 쉽게 관리할 수 있습니다. `Sorted Set`은 자동으로 순위를 유지하므로 대기열 순번 관리에 적합합니다.
- **적용 방법**:
  - Redis의 `Sorted Set`에 대기열에 진입한 사용자 ID와 순위를 점수로 부여하여 추가합니다.
  - 사용자가 자신의 순번을 조회할 때는 `ZRANK` 명령어를 사용하여 Redis에서 순위를 확인할 수 있습니다.
  - 사용자가 대기열에서 빠지면 `ZREM` 명령어를 통해 해당 사용자를 Redis의 `Sorted Set`에서 제거합니다.
- **장점**: 대기열에서의 순번을 빠르게 조회할 수 있으며, 데이터베이스에 부담을 주지 않고 실시간으로 순번을 유지할 수 있습니다.

---

## 5. 만료된 대기열 자동 삭제

### 5.1 TTL을 활용한 자동 만료

- **문제점**: 대기열에서 일정 시간 이상 대기 중인 사용자는 만료되어 대기열에서 자동으로 삭제되어야 합니다. 이를 데이터베이스에서 주기적으로 확인하고 삭제하는 것은 성능에 부담이 됩니다.
- **해결 방안**: Redis에서 TTL을 사용하여 각 대기열 항목을 자동으로 만료되게 설정합니다. TTL이 설정된 키는 시간이 지나면 자동으로 삭제되므로, 불필요한 대기열 관리 로직을 줄일 수 있습니다.
- **적용 방법**:
  - Redis에 대기열 항목을 추가할 때 TTL을 설정하여, 예를 들어 30분이 지나면 해당 항목이 자동으로 삭제되도록 합니다.
  - TTL이 만료되면 대기열에서 자동으로 제거되므로, 데이터베이스나 다른 서비스에서 별도로 만료된 항목을 삭제할 필요가 없습니다.

---

## 요약

Redis를 사용하여 성능을 개선할 수 있는 주요 영역은 다음과 같습니다:

1. **대기열 상태 조회 캐싱**: Redis에 대기열 상태를 캐싱하여 데이터베이스 부하를 줄이고 빠른 조회 속도를 제공합니다.
2. **좌석 예약에서의 분산 락 사용**: Redis 분산 락을 통해 좌석 예약의 동시성 문제를 해결하여 데이터 일관성을 유지할 수 있습니다.
3. **대기열 순번 관리**: Redis `Sorted Set`을 사용하여 대기열 순서를 효율적으로 관리하고 조회 성능을 개선할 수 있습니다.
4. **TTL을 이용한 만료된 대기열 자동 삭제**: Redis의 TTL 기능을 통해 일정 시간이 지나면 대기열 항목이 자동으로 삭제되게 하여 불필요한 데이터 관리를 줄입니다.