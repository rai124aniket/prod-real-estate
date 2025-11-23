import http from "http";
import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import dotenv from "dotenv";
import app from "./index.js";
import chatRoutes from "./routes/chat.route.js";

dotenv.config();

const server = http.createServer(app);
const port=process.env.PORT || 3000;
const wss = new WebSocketServer({ server });
const clients = new Map();

wss.on("connection", (ws, req) => {
  try {
    const cookies = cookie.parse(req.headers.cookie || "");
    const token = cookies.token;

    if (!token) {
      ws.close();
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    ws.userId = decoded.id;
    clients.set(ws.userId, ws);

    console.log(`User ${ws.userId} connected via WS`);
  } catch (error) {
    console.error("Unauthorized WebSocket connection");
    ws.close();
    return;
  }

  ws.on("message", (data) => {
    try {
      const msg = JSON.parse(data);

      if (msg.type === "chat") {
        const { receiverId, content } = msg;

        if (clients.has(receiverId)) {
          clients.get(receiverId).send(
            JSON.stringify({
              senderId: ws.userId,
              content,
              timestamp: new Date().toISOString(),
            })
          );
        }
      }
    } catch (err) {
      console.error("Invalid WS message", err);
    }
  });

  ws.on("close", () => {
    if (ws.userId) {
      clients.delete(ws.userId);
      console.log(`User ${ws.userId} disconnected`);
    }
  });
});

app.use("/chat", chatRoutes);

server.listen(port, () => console.log("Server running on port 3000"));
