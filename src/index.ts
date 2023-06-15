import express from "express";
import mysql from "mysql2";
import db_config from "./config/db_config";
import sequelize from "./db/connection";
const cors = require("cors");
// const connection = mysql.createConnection(db_config);
const app = express();

// 설정
app.use(cors()); // 모든 도메인에서 요청과 응답을 받을 수 있도록 허용
app.set("port", process.env.PORT || 3000);

app.listen(app.get("port"), async () => {
  console.log("Express server listening on port " + app.get("port"));

  // 연결 테스트
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
