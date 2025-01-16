# 콘서트 예약 서비스

## 1. 설계 문서

- [마일 스톤](https://github.com/users/JuGeonjeong/projects/2)
- [시퀀스 다이어그램](docs/시퀀스다이어그램.md)
- [플로우 차트](docs/플로우차트.md)
- [ERD 설계서](docs/image/erd.png)
- [API 명세 및 Mock API 작성](docs/image/swagger-screenshot.png)

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
