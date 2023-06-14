import express from "express";
import mysql from "mysql2";
import db_config from "./config/db_config";
const cors = require("cors");
const connection = mysql.createConnection(db_config);
const app = express();

// 설정
app.use(cors()); // 모든 도메인에서 요청과 응답을 받을 수 있도록 허용
app.set("port", process.env.PORT || 3000);

app.get("/", (req, res) => {
  res.send("hello");
});

app.get("/users", (req, res) => {
  const sql = "SELECT * FROM MEMBER";
  connection.query(sql, (error, rows, fields) => {
    if (error) throw error;
    console.log("Member info is ", rows); // 콘솔에 해당 값이 출력되면 연결 성공
    res.send(rows);
  });
});

app.listen(app.get("port"), () => {
  console.log("Express server listening on port " + app.get("port"));
});
