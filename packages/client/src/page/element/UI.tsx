import React from "react"
import { Layer } from "react-konva"
import { Player } from "../../regulates/Interfaces"
import CardContainer from "./CardContainer"
import PlayerList from "./PlayerList"
import TopTitle from "./TopTitle"

interface UIProps {
    playerList: Player[],
    currentRound: number,
    currentPlayer: string,
    currentBoard: number,
}
class UI extends React.Component<UIProps> {
    constructor(props) {
        super(props)
    }
    render(): React.ReactNode {
        return (
            <Layer>
                <TopTitle
                    currentBoard={this.props.currentBoard}
                    currentPlayer={this.props.currentPlayer}
                    currentRound={this.props.currentRound}></TopTitle>
                <PlayerList playList={this.props.playerList}></PlayerList>
                <CardContainer></CardContainer>
            </Layer>
        )
    }
}

export default UI