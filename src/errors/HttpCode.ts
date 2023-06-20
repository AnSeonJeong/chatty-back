export enum HttpCode {
  OK = 200, // 성공적으로 요청이 처리됨
  NO_CONTENT = 204, // 요청이 성공했지만 응답에 별도의 콘텐츠가 없음
  BAD_REQUEST = 400, // 클라이언트의 요청이 잘못되었거나 유효하지 않음
  UNAUTHORIZED = 401, // 인증이 필요한 리소스에 대한 접근 권한이 없음
  NOT_FOUND = 404, // 요청한 리소스가 서버에서 찾을 수 없음
  INTERNAL_SERVER_ERROR = 500, // 서버 오류
}
