import React from "react"
import { Layer, Image as KImage } from "react-konva"
import { Slot, Board, BoardInfo } from "./Board"
import { Player } from "../../regulates/Interfaces"
import Background from "../../assets/backgrounds/background.png"



interface GameCanvasProps {
    x?: number
    y?: number
    playerState: Player[]
    boardInfo: BoardInfo
    accessSlotList: string[]
}
class GameCanvas extends React.Component<GameCanvasProps> {

    constructor(props) {
        super(props)
    }

    render(): React.ReactNode {
        let img = new Image(window.innerWidth*2,window.innerHeight*2)
        img.src = Background
        console.log("!!",Background)
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