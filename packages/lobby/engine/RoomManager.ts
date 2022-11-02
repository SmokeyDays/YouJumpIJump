import { Room } from "./Room";



export class RoomManager {
  // Singleton
  private static instance: RoomManager;
  private constructor() {}
  static getInstance() {
    if(!this.instance) {
      this.instance = new RoomManager();
    }
    return this.instance;
  }
  
  roomMap: Record<string, Room> = {};
  

  createRoom(roomName: string) {
    this.roomMap[roomName] = new Room(roomName);
  }

  getRoom(roomName: string) {
    return this.roomMap[roomName];
  }

}