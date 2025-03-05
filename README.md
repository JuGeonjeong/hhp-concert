# 콘서트 예약 서비스

## 1. 설계 문서

- [마일 스톤](https://github.com/users/JuGeonjeong/projects/2)
- [시퀀스 다이어그램](doc/report/시퀀스다이어그램.md)
- [플로우 차트](doc/report/플로우차트.md)
- [ERD 설계서](doc/image/erd.png)
- [API 명세 및 Mock API 작성](doc/image/swagger-screenshot.png)

## 2. 서버 환경

- Programming Language: `Typescript ^5.0.0`
- Runtime: `Node.js ^20.15.0`
- Framework: `Nestjs ^10.0.0`
- ORM: `Typeorm ^0.3.x`
- DataBase: `Mysql 8`
- Test: `Jest ^29.5.0`

## 3. 패키지 구조

```javascript
/src
├── /application
│ ├── /usecase
│ └── /facade
├── /domain
│ ├── /entity
│ ├── /service
│ └── /repository
├── /infrastructure
│ ├── /entity
│ ├── /mapper
│ └── /repository
├── /interface
│ ├── /api
│ ├── /dto
│ │ ├── /req
│ │ └── /res
```

## 4. 주차 보고서

- [콘서트 대기열 부하 테스트 보고서](doc/report/queue.report.md)
- [좌석 예매 및 결제 락 전략 보고서](doc/report/lock.report.md)
- [성능 개선을 위한 레디스 분석 문서](doc/report/redis.report.md)
- [쿠키 제거로 개선된 API 성능: K6 테스트 보고서](doc/report/k6.test.md)
- [이벤트 기반 결제 서비스 확장 전략](doc/report/payment.test.md)
