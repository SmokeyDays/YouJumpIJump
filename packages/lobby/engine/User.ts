import { Socket } from "socket.io";
import { PlayerSignal } from "../regulates/interfaces";
import { logger } from "../tools/Logger";
import { Room } from "./Room";
import { RoomManager } from "./RoomManager";

export class User {
  socket: Socket; // The handle got by socket.io.
  userName: string | null = null;
  room: Room | null = null;
  async emit(type: string, para: any) {
    await this.socket.emit(type, para);
  }
  joinRoom(name: string) {
      const roomManager = RoomManager.getInstance();
      const socket = this.socket;
      if(this.userName == null) {
        socket.emit("alert-message", "请先登录");
        logger.warn('User with socket id %s tried to create room with name %s without login.', socket.id, name);
        return;
      }else{
        // Leave old room if the new room is not the old room.
        if(roomManager.getRoom(name) !== this.room) {
          if(this.room != null) {
            this.room.removeUser(this);
            this.room = null;
          }
        }
        // Create new room if no room with specified room exists.
        if(roomManager.getRoom(name) == undefined) { 
          logger.info('User %s CREATED a new room with name: %s.', this.userName, name);
          roomManager.createRoom(name);
        }
        
        this.room = roomManager.getRoom(name);

        if(this.room.hasUser(this)) {
          this.room.removeUser(this);
          socket.emit("alert-message", "已经在房间中，已强制重进");
          logger.info('User %s JOINED AGAIN room %s', this.userName, name);
        }
        if(this.room.addUser(this)) {
          socket.emit("alert-message", "成功加入房间");
          logger.info('User %s joined room with name: %s successfully.', this.userName, name);
        }
      }
  }
  leaveRoom() {
    const socket = this.socket;
    if(this.userName == null) {
      socket.emit("alert-message", "请先登录");
      logger.warn('User with socket id %s try leave a room but never login.', socket.id);
      return;
    }
    if(this.room == null) {
      socket.emit("alert-message", "无效操作");
      logger.warn('User %s try to leave a room but never in any room.', this.userName);
      return;
    }
    this.room.removeUser(this);
    socket.emit("alert-message", "已离开房间" + this.room.roomName);
    this.room = null;
    socket.emit("leave-room-successful");
  }
  constructor(socket: Socket) {
    this.socket = socket;
    // Confirm Connect.
    socket.emit("confirm-connect");
    logger.info('User with socket id %s connected!', socket.id);
    // Register user login event:
    // Now temporarily login without check.
    socket.on("user-login", (name: string) => {
      logger.info('User with socket id %s has logined with name %s', socket.id, name);
      this.userName = name;
      socket.emit("user-login-successful", name);
      socket.emit("alert-message", "登录成功");
    });
    // Register join room event:
    // If room not exist it will create a new one.
    socket.on("join-room", this.joinRoom.bind(this));
    // Start the game.
    socket.on("room-start-game", () => {
      if(this.userName == null) {
        socket.emit("alert-message", "请先登录");
        logger.warn('User with socket id %s try to start game without login.', socket.id);
        return;
      }
      if(this.room == null) {
        socket.emit("alert-message", "请先进入房间");
        logger.warn('User %s try to start game but never in any room.', this.userName);
        return;
      }
      if(this.room.users.length < 2) {
        socket.emit("alert-message", "房间人数至少为 2 才能开始游戏");
        return;
      }
      this.room.startGame();
    });
    // Leave the room.
    socket.on("leave-room", this.leaveRoom.bind(this));
    socket.on("get-available-pos", (card: string) => {
      if(this.userName == null) {
        socket.emit("alert-message", "请先登录");
        logger.warn('User with socket id %s try get-available-pos but never login.', socket.id);
        return;
      }
      
      if(this.room == null) {
        socket.emit("alert-message", "请先进入房间");
        logger.warn('User %s try to get-available-pos but never in any room.', this.userName);
        return;
      }
      socket.emit("return-pos-set", this.room.getPosSet(this, card));
    });
  }
}