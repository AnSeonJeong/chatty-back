<br>
<div align="center">
  <img src="https://github.com/AnSeonJeong/chatty-back/assets/98884055/4e70462c-45c0-4ede-a0fd-8b49a2787621">
</div>

<br><br>

## 🖥️ 프로젝트 소개
"chatty"는 실시간으로 소통할 수 있는 채팅 애플리케이션으로, Socket.io를 활용한 효율적인 실시간 채팅 경험을 제공합니다.
사용자들은 언제 어디서든 메시지를 주고받으며 소통할 수 있습니다.😀

- <a href="https://www.erdcloud.com/d/QxMXL4t7jZ6H73RSt">ERD 문서</a>
- <a href="https://humble-vision-435.notion.site/ca9f266cfa1e461e8225d69d7bc1f2b2?v=e454a3a86f7d4a76bceb78ac207a1a7c&pvs=4">API 문서</a>

<br>

## 📅 개발 기간
2023.06.11 ~ 2023.08.05

<br>

## 🛠️ 기술 스택
- **Front-end** : React(17.0.2)
- **Back-end** : Node.js(16.8.0), Express(4.17.1)
- **Database** : MySQL(8.0.27), Sequelize(6.32.0)
- **File Upload** : Multer(1.4.4)
- **Language** : TypeScript(5.1.3)

<br>

## 📺 화면 구성
| 로그인 페이지 | 회원가입 페이지 |
|:--------------:|:--------------:|
| <img src="https://github.com/AnSeonJeong/chatty-back/assets/98884055/b627495e-adfa-47c1-bf04-de562865294e" width=600> | <img src=https://github.com/AnSeonJeong/chatty-back/assets/98884055/4466c097-48f6-4b6f-b5f1-ad2610832e6d) width=600>
>
| 채팅 페이지 | 친구 페이지 | 프로필 페이지 |
|:-----------:|:-----------:| :-------------:|
| <img src=https://github.com/AnSeonJeong/chatty-back/assets/98884055/51054ce5-9228-4853-b9f8-71ca0240db54 width=600> | <img src=https://github.com/AnSeonJeong/chatty-back/assets/98884055/d0051ddf-7874-4c37-bea5-4c08568e398f width=600> | <img src=https://github.com/AnSeonJeong/chatty-back/assets/98884055/520ae512-b929-495d-b346-4c5ef7578b51 width=600> |

<br>

## 📂 디렉토리 구조
```
📦src
 ┣ 📂@types : 타입 정의 파일을 관리하는 폴더
 ┣ 📂config : 설정에 관한 폴더
 ┣ 📂controllers : 웹 요청을 처리하는 controller파일이 있는 폴더
 ┣ 📂db : 데이터베이스에 관한 폴더
 ┃ ┣ 📂migrations
 ┃ ┣ 📂models 
 ┃ ┗ 📂seeders
 ┣ 📂errors : 에러에 관한 폴더
 ┣ 📂middleware : 미들웨어에 관한 폴더(에러핸들링, 로깅 등)
 ┣ 📂routes : 라우트 정의 파일이 있는 폴더
 ┣ 📂services : 비즈니스 로직을 구현하는 service파일이 있는 폴더
 ┣ 📂uploads : 업로드한 파일을 저장하는 폴더
 ┃ ┣ 📂chat
 ┃ ┃ ┣ 📂documents
 ┃ ┃ ┗ 📂images
 ┃ ┗ 📂user-profiles
 ┣ 📂utils : 유틸리티 함수가 있는 폴더
 ┗ 📜index.ts
```

## 💁 주요 기능
#### ⭐️ 사용자 등록 및 프로필 관리
#### ⭐️ 소셜 인증을 통한 로그인
#### ⭐️ 실시간 채팅
#### ⭐️ 친구 추가 및 삭제 기능
#### ⭐️ 이미지 및 파일 전송
#### ⭐️ 새로운 메시지 알림 기능
#### ⭐️ 채팅방 관리
