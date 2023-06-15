import dotenv from "dotenv";

dotenv.config(); // .env 파일의 환경 변수를 로드

const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;

const db_config = {
  dialect: "mysql",
  host: DB_HOST,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
};

export default db_config;
