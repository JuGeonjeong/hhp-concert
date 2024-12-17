### 결제 서비스 트랜잭션 범위 및 확장성 설계

#### 1. 현재 결제 서비스 트랜잭션 구성

현재 결제 서비스 트랜잭션의 단계는 다음과 같습니다:

1. **결제 요청 검증**: 요청된 결제 정보가 유효한지 확인 (`Payment.validate`).
2. **유저 포인트 차감**: 포인트 잔액 확인 후 차감 (`userService.findOne`, `pointService.useCheck`).
3. **좌석 유무 확인**: 좌석이 예약 가능한지 확인 (`concertService.findOne`).
4. **좌석 상태 업데이트**: 좌석 상태를 예약 완료로 변경 (`concertService.update`).
5. **결제 정보 저장 및 성공 이벤트 발행**: 결제 정보를 저장하고 성공 이벤트를 발행하여 처리 완료 (`paymentRepository.save`, `paymentEventPublisher.success`).

---

#### 2. 서비스 확장 시 예상되는 문제점

- **고립성 문제**: 여러 서비스가 하나의 트랜잭션에 묶여 있어, 일부 서비스에 병목이 발생할 경우 전체 트랜잭션에 영향을 미칩니다.
- **높은 결합도**: 결제 서비스 내 여러 기능이 강하게 결합되어 있어, 단일 서비스 내에서의 변경이 다른 서비스에 영향을 줄 수 있습니다.
- **확장성 부족**: 트랜잭션 내 여러 서비스 호출로 인해 성능 부하가 발생할 수 있으며, 서비스 확장 시 추가적인 관리 비용이 필요할 수 있습니다.

---

#### 3. 확장 설계 방안

1. **서비스 분리 및 독립성 강화**

   - **포인트 서비스**: 결제 서비스와 분리된 독립적인 포인트 관리 서비스 구축
   - **좌석 예약 서비스**: 좌석 상태 관리와 예약 상태 변경을 담당하는 독립 서비스 구축

2. **이벤트 기반 비동기 처리** (이벤트 주도 설계)

   - 포인트 차감 및 좌석 상태 업데이트를 비동기 이벤트로 처리하여 각 서비스 간의 결합도를 낮추고 성능 개선
   - 결제 성공 시 이벤트를 발행하여 외부 서비스들이 후속 작업을 수행하도록 유도 (예: `paymentEventPublisher.success`).

3. **사가 패턴 (SAGA Pattern) 도입**:
   - 각 서비스가 독립적으로 동작하되, 연관 작업 실패 시 보상 트랜잭션을 통해 롤백 처리
   - 예: 결제 실패 시 포인트 복원 및 좌석 상태 원복

---

#### 4. 확장 설계 예시 코드

```typescript
// 결제 서비스
async pay(request) {
    const { userId, seatId, amount } = request;

    await this.dataSource.transaction(async (transactionManager) => {
        // 1. 결제 요청 검증
        Payment.validate(request);

        // 2. 유저 포인트 차감
        const user = await this.userService.findOne(userId);
        await this.pointService.useCheck(userId, amount);

        // 3. 좌석 유무 확인 및 예약 상태 변경
        const seat = await this.concertService.findOne(seatId);
        await this.concertService.update({ ...seat, status: SeatStatusEnum.RESERVED });

        // 4. 결제 정보 저장
        const payment = await this.paymentRepository.save(transactionManager, request);

        // 5. 결제 성공 이벤트 발행
        this.paymentEventPublisher.success(new PaymentSuccessEvent(payment.orderKey));
    });
}
```

#### 5. 서비스 분리 시 트랜잭션 처리의 한계 및 해결 방안

- **한계**: 서비스가 독립될수록 트랜잭션 관리가 어려워지며, 여러 서비스에서 하나의 트랜잭션을 보장하기가 어렵습니다.
- **해결 방안**:
  - **데이터베이스 트랜잭션**: 단일 서비스 내에서 가능한 트랜잭션을 관리하여 단일 책임 원칙을 준수합니다.
  - **분산 트랜잭션 관리**:
    - **사가 패턴 (SAGA Pattern)**을 활용하여 각 서비스의 작업 성공 여부에 따라 보상 트랜잭션을 실행합니다.
    - 예를 들어, 결제 실패 시 포인트를 복원하고 좌석 상태를 원래대로 되돌리는 방식으로 일관성을 유지합니다.
  - **이벤트 기반 트랜잭션**: 결제 성공 이벤트를 비동기로 처리하여 각 서비스의 트랜잭션을 독립적으로 관리하고, 트랜잭션 간 결합도를 낮춥니다.

---

#### 결론

서비스 간 결합도를 낮추고 독립적인 확장이 가능하도록 설계합니다. 이벤트 기반 처리와 사가 패턴을 활용하여 확장성을 높이면서도 데이터 일관성을 유지하는 구조를 제안합니다.
