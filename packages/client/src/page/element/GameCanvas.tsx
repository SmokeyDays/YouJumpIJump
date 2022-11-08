import React from "react"
import { Layer, Image as KImage } from "react-konva"
import { Slot, Board, BoardInfo } from "./Board"
import { Player } from "../../regulates/Interfaces"
import Background0 from "../../assets/backgrounds/background0.png"
import Background1 from "../../assets/backgrounds/background1.png"
import Background2 from "../../assets/backgrounds/background2.png"



interface GameCanvasProps {
    x?: number
    y?: number
    playerState: Player[]
    boardInfo: BoardInfo
    accessSlotList: string[]
    freSlotList: string[]
    currentBoard: number,
}
class GameCanvas extends React.Component<GameCanvasProps> {

    constructor(props) {
        super(props)
        
    }

    render(): React.ReactNode {
        let img = new Image(window.innerWidth*2,window.innerHeight*2)
        switch(this.props.currentBoard) {
            case 2: img.src = Background2; break;
            case 1: img.src = Background1; break;
            case 0: img.src = Background0; break;
        }
        return (
            <Layer
                {...this.props}
                draggable={true}>
                <KImage
                    image={img}
                    width={window.innerWidth*2}
                    height={window.innerHeight*2}
                    offsetX={window.innerWidth}
                    offsetY={window.innerHeight}
                >
                </KImage>
                <Board
                    freSlotList={this.props.freSlotList}
                    boardInfo={this.props.boardInfo}
                    accessSlotList={this.props.accessSlotList}
                    playerState={this.props.playerState}
                >
                </Board>
            </Layer>
        )
    }
}

export default GameCanvas