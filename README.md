# Public_BlockReviewProject

## Summary
* 현대시대의 요구에 맞추어 익명성을 버리고, 회원제로 유지시키면서 개인키는 개인에게 소유권을 줌으로써 탈중앙화를 유지시킨 블록체인 리뷰 Dapp이다. 블록체인을 통한 리뷰는 NFT가 되고, 리뷰 NFT를 거래할 수 있다. 또한 적절한 토큰이코노미를 적용하여 악성리뷰와 허위리뷰를 최소화 시킬 수 있고, 게임이론에 입각한 선순환적 유도의 클린리뷰를 남길 수 있는 Dapp이다.

## Architecture
![Untitled](https://user-images.githubusercontent.com/66409384/162142720-748ce85c-8f34-427b-b870-7bda1b318045.png)

* web3는 Javascript 환경에서 최다의 라이브러리와 다양한 검색 내용 등이 존재한다. 뿐만아니라, GSN의 경우 Javascript 외 다른 언어를 지원하지 않는다. 개발하다보면 클라이언트가 반드시 Javascript일 수 없고, 기존 서버가 반드시 Javascript로 구성되어있지 않을 것이다. 때문에 **web3js 지원이 어려운 여러 다양한 환경에서 자유롭게 선택이 가능하도록 자체 월렛의 Transaction은 최대한 Nodejs에서 처리하도록 구성했다.
외부월렛 (메타마스크)의 Transaction은 전반적으로 React 사이드에서 처리되며, 내부월렛의 Transaction은 전반적으로 Nodejs 사이드에서 처리하는 방식으로 진행했다.

* IPFS는 테스트넷을 사용해보니 속도가 느려 사용성에 문제가 있을것으로 사료되어, EC2 서버사이드 내 로컬에 IPFS를 구성했다.

## Token Economy
![TokenEconomy](https://user-images.githubusercontent.com/66409384/162142996-1a499b95-6c66-4738-97b4-475b46cf29a4.png)

## Key Logic
 * contract 폴더 내 ERC-721(BlockReview NFT) Smart Contract, ERC-20(BlockReview Coin) Smart Contract, Review Dapp Service Smart Contract
 * client & Server 각 폴더 내 config-web3 파일로 Dapp과 연결시켰다.

## Notion Link
https://bevel-adjustment-e90.notion.site/BlockReview-Dapp-56571102091d49d69e37f3ef5b478a1f
