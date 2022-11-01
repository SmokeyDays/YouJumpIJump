import React from "react"
import { Layer } from "react-konva"
import { Slot, Board, BoardInfo } from "./Board"
import { Player } from "../../regulates/Interfaces"


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
        return (
            <Layer
                {...this.props}
                draggable={true}>
                <Board
                    boardInfo={this.props.boardInfo}
                    accessSlotList={this.props.accessSlotList}
                    playerState = {this.props.playerState}
                >
                </Board>
            </Layer>
        )
    }
}

export default GameCanvas