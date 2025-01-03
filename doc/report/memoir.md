1. 프로젝트 개요
   이 프로젝트의 목표는 대규모 콘서트 예약 시스템에서 사용자 대기열을 관리하고, 실시간 좌석 예약과 결제를 안정적으로 처리하는 것입니다. 특히 수천 명의 사용자가 몰려드는 상황에서도 좌석 예약 충돌을 방지하고, 대기 시간을 예측할 수 있도록 시스템을 구축하는 데 중점을 두고 있습니다.

2. 현재까지의 진행 상황
   대기열 관리: JWT 토큰을 기반으로 사용자 대기열을 관리하고, 대기 상태(WAIT, ENTER, OUT)에 따라 사용자 흐름을 제어하고 있습니다.
   좌석 예약 및 동시성 제어: 좌석 예약에서 발생할 수 있는 동시성 문제를 해결하기 위해 Mutex를 도입하여, 같은 좌석에 대한 중복 예약을 방지했습니다.
   유저 포인트 시스템: 유저가 보유한 포인트를 사용해 좌석을 결제할 수 있으며, 포인트 차감과 예약 상태 업데이트 기능을 구현했습니다.
3. 에러 및 해결
   데이터베이스 연결 문제: 초기에는 환경변수 설정 오류와 경로 설정 문제로 인해 MySQL 연결에서 어려움을 겪었으나, 설정 파일 및 경로를 수정하여 해결했습니다.
   JWT 인증 이슈: 클라이언트 측 쿠키 처리 과정에서 JWT 토큰이 인코딩되는 문제를 해결하여, 토큰 인증이 원활하게 이루어지도록 개선했습니다.
   동시성 문제 해결: 좌석 예약 시 발생하는 동시성 문제는 Mutex를 통해 성공적으로 해결하여, 다수의 사용자가 동시에 같은 좌석을 예약하는 상황을 방지했습니다.
   테스트코드 문제: 아직 테스트코드의 활용에 익숙치 않아 제대로 된 테스트를 완료하지 못했습니다. 추후에 보완해 나아갈 예정입니다.
4. 향후 계획
   서비스 로직 최적화: 대기열 순번 할당 및 예약 서비스 로직을 보완해가며 문제 없이 사이클이 완료될 수 있도록 작업 할 예정입니다.
   추가 기능 개발: 스케줄로 대기열을 관리하고 기존, 신규 대기열에 관리를 할 수 있는 기능을 넣을 예정입니다.
   git pr 개선: 아직 git을 이해하지 못한 것 같습니다. 지난주차 명예의 전당 예시들 처럼 구상해보려 했으나 미흡합니다. 효과적인 pr을 하려 노력하겠습니다.
5. 결론
   현재까지의 진행 상황은 안정적인 시스템 구축에 중점을 두고 있으며, 앞으로는 성능 최적화와 사용자 경험 개선에 집중해 프로젝트를 완성해 나갈 예정입니다.
