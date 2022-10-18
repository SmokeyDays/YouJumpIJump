import React from "react"
import { Layer } from "react-konva"
import Board, { Slot } from "./Board"


interface GameCanvasProps {
    currentBoard: number

}
interface GameCanvasState {
}
class GameCanvas extends React.Component<GameCanvasProps> {

    constructor(props) {
        super(props)
    }

    render(): React.ReactNode {
        return (
            <Layer draggable={true}>
                {this.boards[this.props.currentBoard]}
            </Layer>
        )
    }

    boards: Board[] = [
        <Board radius={2} slotTemplate={<Slot color='MediumAquamarine'></Slot> as unknown as Slot}></Board> as unknown as Board,
        <Board radius={3} slotTemplate={<Slot color='LightSeaGreen'></Slot> as unknown as Slot}></Board> as unknown as Board,
        <Board radius={4} slotTemplate={<Slot color='DarkCyan'></Slot> as unknown as Slot}></Board> as unknown as Board,
    ]
}

export default GameCanvas