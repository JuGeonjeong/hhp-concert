### **좌석 예매 및 결제 락 전략 보고서**

---

#### **1. 개요**

좌석 예매 시스템에서 데이터 무결성과 안정성을 유지하기 위해 **낙관적 락**과 **비관적 락**을 단계별로 사용합니다.

---

#### **2. 전략 요약**

1. **좌석 예매**:

   - **사용 락**: 낙관적 락 (Optimistic Lock)
   - **특징**: 충돌이 적은 작업에 적합하며, 높은 동시성을 유지.
   - **작동 방식**:
     - 좌석 데이터에 `version` 필드를 사용해 업데이트 시 충돌 여부를 판별.
     - 충돌 시 실패 처리, 충돌이 없으면 예약 완료.

2. **유저 포인트 잔액**:
   - **사용 락**: 비관적 락 (Pessimistic Lock)
   - **특징**: 데이터 무결성이 중요한 작업에 적합.
   - **작동 방식**:
     - 결제 중에는 다른 트랜잭션의 접근을 차단(X Lock).
     - 결제 완료 후 락 해제.

---

#### **3. 적용 이유**

1. **좌석 예매 (낙관적 락)**:

   - **이유**: 동시성이 높고 충돌이 적은 작업에서 성능 최적화. 자리 예매는 하나의 요청만 성공하면 되기 때문에 낙관적락이 적합.
   - **예시**:
     - 여러 사용자가 동시에 같은 좌석을 예약 시도.
     - `version` 값을 사용해 한 요청만 성공하고 나머지는 실패.

2. **유저 포인트 잔액 (비관적 락)**:

   - **이유**: 결제는 데이터 무결성이 중요하며, 충돌을 방지해야 함. 현재 잔여포인트에 대해 데이터 무결성 필요
   - **S-Lock 과 X-Lock 고민**

     - 특정 유저의 금액 충전/차감 작업은 데이터 수정이 발생하는 핵심 작업으로, X Lock을 사용해 다른 트랜잭션의 동시 접근을 완전히 차단이 필요함.
     - S Lock은 동시에 다수의 데이터 조회가 가능 하지만 특정 유저의 포인트를 결제, 차감하는 경우엔 개인 데이터를 읽는 작업이 동시에 일어나지 않음.

   - **고려사항**:
     - X Lock이 오래 유지되면 대기 시간 증가, 데드락 발생, DB 연결 리소스 부족 등의 문제가 발생.
       - 해결책: 트랜잭션 범위를 최소화하고, 꼭 필요한 작업만 트랜잭션 내에서 수행.
       - [외부 결제 서비스를 거치는 트랜잭션 범위 최적화 과정](/doc/report/외부결제서비스.md)
   - **예시**:
     - 결제 중 좌석 데이터를 수정할 경우, 다른 트랜잭션은 접근 불가.

---

#### **4. 간단 비교**

| **항목**      | **좌석 예매 (낙관적 락)** | **유저 포인트 잔액 (비관적 락)** |
| ------------- | ------------------------- | -------------------------------- |
| **충돌 처리** | 충돌 발생 시 실패로 처리  | 충돌 자체를 방지                 |
| **동시성**    | 높음                      | 낮음                             |
| **사용 락**   | `version` 기반 업데이트   | `SELECT FOR UPDATE`              |
| **적용 사례** | 좌석 예약 처리            | 결제 처리                        |

---

#### **5. 결론**

- **좌석 예매**: 낙관적 락을 사용하여 높은 동시성을 유지하고 충돌을 효율적으로 처리.
- **유저 포인트 잔액**: 비관적 락을 사용하여 데이터 안정성과 무결성을 보장.
