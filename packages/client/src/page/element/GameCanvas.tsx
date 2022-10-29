import React from "react"
import { Layer } from "react-konva"
import { Slot, Board, BoardInfo } from "./Board"


interface GameCanvasProps {
    x?: number
    y?: number
}
interface GameCanvasState {
    currentBoard: number,
    accessSlotList: string[][]
}
class GameCanvas extends React.Component<GameCanvasProps, GameCanvasState> {

    constructor(props) {
        super(props)
        if (GameCanvas.instance) {

        }
        this.state = {
            currentBoard: 0,
            accessSlotList: [[],[],[]],
        }
        GameCanvas.instance = this
        this.boards = [
            new BoardInfo(2, 'white', 'green', <Slot color='MediumAquamarine'></Slot>),
            new BoardInfo(3, 'white', 'green', <Slot color='LightSeaGreen'></Slot>),
            new BoardInfo(4, 'white', 'green', <Slot color='DarkCyan'></Slot>),
        ]
    }

    setSlotStatus(level: number, x: number, y: number, isBroken: boolean) {
        this.boards[level].setSlotStatus(x,y,isBroken)
    }

    setCurrentBoard(index: number) {
        this.setState({ currentBoard: index })
    }

    setAccessSlotList(slotList: [number, number, number][]) {    
        let tmp = [[],[],[]]
        for(let i of slotList) {
            tmp[i[0]].push(`${i[1]},${i[2]}`)
        }
        this.setState({ accessSlotList: tmp })
    }

    render(): React.ReactNode {
        return (
            <Layer
                {...this.props}
                draggable={true}>
                <Board
                    boardInfo={this.boards[this.state.currentBoard]}
                    accessSlotList={this.state.accessSlotList[this.state.currentBoard]}
                >
                </Board>
            </Layer>
        )
    }

    static instance

    boards: BoardInfo[]
}

export default GameCanvas