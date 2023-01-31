import express from "express";
import http from "http";
import WebSocket from "ws";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log("Listening on http://localhost:3000");

const server = http.createServer(app);

// 이렇게 안에 server를 넣어주면 같은 서버에서 ws뿐만 아니라 http도 동시에 돌려줄 수 있음
const wss = new WebSocket.Server({ server });
// ws만 돌리길 원할 때
// const wss = new WebSocket.Server({ server });

// 서버에 누가 연결되어있는지 확인해주기 위해 [] 만들어줌
const sockets = [];

wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["nickname"] = "Anonymous"; // 이런식으로 소켓 안에 정보를 저장해줄 수 있음!
  console.log("Connected to Browser ✔");
  socket.on("close", () => console.log("Disconnected from the browser!"));
  socket.on("message", (message) => {
    const parsed = JSON.parse(message);
    console.log(parsed, message.toString("utf8")); // 왼쪽은 JS Object, 오른쪽은 그냥 string(parse안된 거)
    if (parsed.type === "new_message") {
      sockets.forEach((aSocket) => {
        aSocket.send(`${socket.nickname}: ${parsed.payload}`);
      });
    } else if (parsed.type === "nickname") {
      socket["nickname"] = parsed.payload; // 이런식으로 객체에 key-value 추가해줄 수 있음
    }
  });
});

server.listen(3000, handleListen);
