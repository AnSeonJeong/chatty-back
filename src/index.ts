import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config(); // .env 파일의 환경 변수를 로드

const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;

const connection = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
});

connection.connect(); // 연결

const sql = "SELECT * FROM MEMBER";
connection.query(sql, (error, rows, fields) => {
  if (error) throw error;
  console.log("Member info is ", rows);
});

connection.end();
