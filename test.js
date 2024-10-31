import http from 'k6/http';
import { check, sleep } from 'k6';

// 간단한 UUID 생성 함수
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// 옵션 설정: 테스트의 단계별 사용자 수와 지속 시간 정의
export const options = {
  stages: [
    { duration: '1m', target: 50 }, // 1분 동안 동시 사용자 50명 도달
    { duration: '3m', target: 200 }, // 3분 동안 동시 사용자 200명 유지
    { duration: '1m', target: 0 }, // 1분 동안 사용자 0명으로 감소
  ],
};

// 테스트 로직
export default function () {
  // 각 요청마다 유니크한 userId와 concertId 생성
  const userId = generateUUID();
  const concertId = 'concert-1234'; // 테스트할 콘서트 ID 예시

  const payload = JSON.stringify({ userId, concertId });
  const headers = { 'Content-Type': 'application/json' };

  // 콘서트 대기열 API에 POST 요청 보내기
  const res = http.post('http://localhost:3000/waiting-queue/issue', payload, {
    headers,
  });

  // 응답 상태와 지연 시간을 확인하는 체크
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1); // 각 요청 후 1초 대기
}
