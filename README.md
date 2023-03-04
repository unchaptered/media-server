# Media Server

미디어 서버는 **발행-구독을 이용한 영상 처리 서버 연동** 프로젝트입니다.

![](./docs/banner.png)

## A. 결과물

AP분산 서비스에서 **고가용성**, **고확장성**을 충족하는 미디어 서버를 구현하였습니다.

또한 중소기업 및 스타트업에서 사용 가능한 적정 수준의 기술을 사용하여 시스템 요구사항을 달성했습니다.

몇 가지 문제점에 대한 재해 복구(Failover) 및 예방 방법을 통해서 프로덕션 레벨에서 사용가능 함을 입증했습니다.

개략적으로 살펴보면 다음과 같은 주요 설계 포인트를 잡았습니다.

- API 서버와 영상 처리 서버를 발행-구독 패턴으로 연결
- 영상 처리 서버가 주기적으로 구독을 할 수 있도록 크론 스케쥴러를 구성
- 스케쥴러의 최대 구독량을 제한하기 위해서 Semaphore로 실행 함수를 포장

![서비스 아키텍처](./docs/architecture.png)