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
        this.backgounds=[new Image(),new Image(),new Image()]
        this.backgounds[0].src = Background0
        this.backgounds[1].src = Background1
        this.backgounds[2].src = Background2
    }

    render(): React.ReactNode {
        let width = 1925*1.5
        let height = 1133*1.5

        return (
            <Layer
                {...this.props}
                draggable={true}>
                <KImage
                    image={this.backgounds[this.props.currentBoard]}
                    width={width}
                    height={height}
                    offsetX={width/2}
                    offsetY={height/2}
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
    backgounds: HTMLImageElement[];
}

export default GameCanvas