import { Client } from "@stomp/stompjs";

let stompClient: Client | null = null;

/**
 * Kết nối WebSocket với backend Spring Boot
 */
export const connectWebSocket = (
  userId: number,
  onMessage: (message: any) => void
) => {
  // ⚠️ Dùng địa chỉ IP LAN của backend (vd: 192.168.x.x)
  const SOCKET_URL = "ws://192.168.1.5:8080/ws";

  stompClient = new Client({
    brokerURL: SOCKET_URL,
    reconnectDelay: 5000, // tự động reconnect mỗi 5s
    debug: (str) => console.log(str),
    onConnect: () => {
      console.log("✅ WebSocket connected");

      // Subscribe tới queue riêng của user
      stompClient?.subscribe(`/user/${userId}/queue/messages`, (msg) => {
        const payload = JSON.parse(msg.body);
        onMessage(payload);
      });

      // Hoặc subscribe tới 1 conversation cụ thể
      // stompClient?.subscribe(`/topic/conversation/${conversationId}`, (msg) => {...});
    },
    onStompError: (frame) =>
      console.error("STOMP Error:", frame.headers["message"]),
    onDisconnect: () => console.log("❌ WebSocket disconnected"),
  });

  stompClient.activate();
};

/**
 * Gửi tin nhắn tới backend
 * destination = phần sau /app/ trong @MessageMapping
 */
export const sendChatMessage = (destination: string, body: any) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: `/app/${destination}`,
      body: JSON.stringify(body),
    });
  } else {
    console.warn("⚠️ WebSocket chưa kết nối");
  }
};

/**
 * Ngắt kết nối WebSocket
 */
export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    console.log("🔌 Disconnected WebSocket");
  }
};
