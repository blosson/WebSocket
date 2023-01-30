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

wss.on("connection", (socket) => {
  console.log("Connected to Browser ✔");
  socket.on("close", () => console.log("Disconnected from the browser!"));
  socket.on("message", (message) => {
    console.log(message);
  });
  socket.send("hello!!!");
});

server.listen(3000, handleListen);
