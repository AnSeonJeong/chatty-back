import express from "express";
import sequelize from "./db/models/sequelize";
import { errorHandler } from "./middleware/errorHandler";
import logger from "./middleware/logger";
import UserRouter from "./routes/UserRouter";
import FriendRouter from "./routes/FriendRouter";
import ChatRouter from "./routes/ChatRouter";
import cookieParser from "cookie-parser";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";
import bodyParser from "body-parser";

const cors = require("cors");
const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:9000",
    methods: ["GET", "POST"],
  },
});

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
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Router
app.use("/", UserRouter);
app.use("/", FriendRouter);
app.use("/", ChatRouter);

// Error
app.use(errorHandler);

// socket 연결
io.on("connection", (socket) => {
  // 방 참여
  socket.on("join_room", async (room) => {
    console.log(
      `User ${room.memId}, ${room.userId} joined room ${room.roomId}`
    );
    socket.join(room.roomId);
    io.emit("joined", room);
  });

  // 클라이언트로부터 메시지 수신
  socket.on("send_message", (data) => {
    io.to(data.room_id).emit("new_message", data);
  });

  // 채팅방에서 나가기
  socket.on("leave_room", async (room) => {
    console.log(`User ${room.memId}, ${room.userId} leave room ${room.roomId}`);
    socket.leave(room.roomId);
  });
});

httpServer.listen(app.get("port"), async () => {
  console.log("Express server listening on port " + app.get("port"));

  // 연결 테스트
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
