import { io } from "socket.io-client";
import { serverURL } from "../regulates/settings";

// Build connection.
// Notion: the "transports" option is used to prevent "Access-Control-Allow-Origin" error.
export const socket = io(serverURL, {
  transports: ['websocket', 'polling', 'flashsocket']
});
socket.io.on("error", (error) => {
  PubSub.publish('alert-pubsub-message',{
    str: "建立与服务端的连接失败",
    dur: 1,
  });
});;

export class Message{
  static setUserID(name: string) {
    socket.emit("set-user-id", name);
  }
}