import express from "express";
import WebSocket from "ws";
import http from "http";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`listening on 3000`);
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

function onSocketClose() {
  console.log("Disconnected from the Browser");
}

const sockets = [];

wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["nickname"] = "anonymous";
  socket.on("close", onSocketClose);
  socket.on("message", (msg) => {
    const message = JSON.parse(msg);
    switch (message.type) {
      case "new_msg":
        sockets.forEach((aSocket) =>
          aSocket.send(`${socket.nickname} : ${message.payload.toString()}`)
        );
        break;
      case "nickname":
        socket["nickname"] = message.payload;
    }
  });
});

server.listen(3000, handleListen);
