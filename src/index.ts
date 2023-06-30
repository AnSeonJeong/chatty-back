import express from "express";
import sequelize from "./db/models/sequelize";
import { errorHandler } from "./middleware/errorHandler";
import logger from "./middleware/logger";
import UserRouter from "./routes/UserRouter";
import cookieParser from "cookie-parser";

const cors = require("cors");
const app = express();

// 설정
let corsOptions = {
  origin: "http://localhost:9000",
  credentials: true,
};

app.use(cors(corsOptions));
app.set("port", process.env.PORT || 3000);

// logging
app.use(logger);
// cookie-parser
app.use(cookieParser());

// Router
app.use("/", UserRouter);

// Error
app.use(errorHandler);

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
