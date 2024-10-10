## 시나리오 선정 및 프로젝트 Milestone 제출

| 주차    | 목표                  | 상세 작업 내용                                                         |
| ------- | --------------------- | ---------------------------------------------------------------------- |
| 1주차   | 프로젝트 계획 및 설계 | 요구사항 분석, 시퀀스 다이어그램, 플로우 차트, 아키텍처 설계, ERD 작성 |
| 2주차   | 초기 개발 환경 구축   | 개발 환경 설정, 도구 설치                                              |
| 3주차   | 인증 및 사용자 관리   | 세션 인증                                                              |
| 4~5주차 | 주요 기능 개발        | 핵심 API 및 비즈니스 로직 구현                                         |
| 6~7주차 | 테스트 및 최적화      | 테스트 작성, 성능 개선                                                 |
| 8주차   | 배포 준비 및 출시     | 서버 배포, 모니터링, CI/CD 구축                                        |

## 개발 환경

- Architecture
  - Layered Architecture Based + clean Architecture
  - Testable Business logics
- DB ORM
  - TypeORM
- Test
  - Jest

## 플로우 차트

```mermaid
flowchart TD
%% Nodes
A("콘서트 예매"):::green
B("날짜 조회"):::orange
C("대기열 토큰 발급"):::orange
CA("대기열 조회"):::purple
CAA("좌석 조회"):::purple
CAB("대기"):::pink
DA("좌석 선택"):::orange
DB("좌석 없음"):::pink
E("좌석 예약"):::orange
F("잔여금 조회"):::purple
FA("충전"):::orange
G("결제"):::orange
H("예약 잔여시간 확인"):::purple
HA("잔여시간 없음"):::pink
HAA("좌석 예매 실패"):::pink
HB("좌석 결제 완료"):::orange
HAB("좌석 예매 성공"):::blue

%% Edges
A --> B --> C
C  --> CA
CA -- 통과 --> CAA
CA --> CAB
CAA -- 유 --> DA --> E --> F -- 유 --> G --> H  --> HB --> HAB
CAA --> DB
F -- 무 --> FA
H --> HA --> HAA

%% Styling
classDef green fill:#B2DFDB,stroke:#00897B,stroke-width:2px,color:#000;
classDef orange fill:#FFE0B2,stroke:#FB8C00,stroke-width:2px,color:#000;
classDef blue fill:#BBDEFB,stroke:#1976D2,stroke-width:2px,color:#000;
classDef yellow fill:#FFF9C4,stroke:#FBC02D,stroke-width:2px,color:#000;
classDef pink fill:#F8BBD0,stroke:#C2185B,stroke-width:2px,color:#000;
classDef purple fill:#E1BEE7,stroke:#8E24AA,stroke-width:2px,color:#000;
```

## 시퀀스 다이어그램

#### 유저 대기열 토큰 조회/요청 기능

```mermaid
sequenceDiagram
participant USER
participant API
participant DB
USER ->> API: 1. 대기 요청
API ->> DB: 2. 대기 토큰 등록 요청
alt 토큰 있음
DB ->> API: 3. 기존 대기열 반환
else 토큰 없음
DB ->> API: 4. 신규 대기열 토큰 등록, 반환
end
API ->> USER: 5. 대기열 정보
loop 5초
USER ->> API: 6. 확인 요청 [Token]
API ->> DB: 7. 대기열 확인 요청
alt 토큰 만료
DB ->> API: 8. 신규 대기열 토큰 등록, 반환
API ->> USER: 9. 대기열 정보
else 토큰 유지
DB ->> USER: 10. 대기열 정보
end
end
```

#### 예약 가능 날짜/좌석 조회 & 예약 요청

```mermaid
sequenceDiagram
  participant USER
  participant API
  participant DB

    USER ->> API: 1. 조회 요청
    API ->> DB: 2. 데이터 조회
    DB ->> API: 3. 데이터 반환
    API ->> USER: 4. 좌석 정보
    USER ->> API: 5. 좌석 예약 요청[Token]
    API ->> DB: 6. 좌석 상태 조희
alt 예약 불가능
    DB ->> USER: 7. 에러 반환
else 예약 가능
    DB ->> API: 8. 좌석 상태 변경 & 정보 반환
end
    API ->> USER: 5. 좌석 예약 확인
```

#### 잔액 충전

```mermaid

sequenceDiagram
  participant USER
  participant API
  participant DB

USER ->> API: 1. 충전 요청[Token]
API ->> DB: 5. 충전 & 기록 저장
DB ->> API: 6. 잔액 반환
API ->> USER: 6. 잔액 확인
```

#### 예약 결제

```mermaid
sequenceDiagram
  participant USER
  participant API
  participant DB

    USER ->> API: 1. 결제 요청[Token]
    API ->> DB: 2. 유저 잔액 조회
alt 잔액 없음
    DB ->> USER: 3. 에러 전달
else 잔액 있음
loop 5분
    alt 초과
        DB ->> USER: 4. 에러
    else 미만
        DB ->> API: 5. 좌석 소유권 & 결제 기록 & 토큰 만료
        API ->> USER: 6. 예약 정보 확인
end
end
end
```
