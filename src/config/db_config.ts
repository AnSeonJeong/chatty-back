import dotenv from "dotenv";

dotenv.config(); // .env 파일의 환경 변수를 로드

const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;

const db_config = {
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  host: DB_HOST,
  dialect: "mysql" as const,
  timezone: "+09:00",
};

export default db_config;
