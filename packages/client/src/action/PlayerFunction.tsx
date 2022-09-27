import { socket } from "../communication/connection";
import { PlayerSignal } from "../regulates/signals";

class PlayerFunction {
  static drawCard() {
    
  }
  static playerSignalIngame(signal: PlayerSignal) {
    socket.emit("player-signal-ingame", signal);
  }
}

export default PlayerFunction;