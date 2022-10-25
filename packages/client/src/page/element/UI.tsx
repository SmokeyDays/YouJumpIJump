import React from "react"
import { Layer, Text } from "react-konva"
import { Player } from "../../regulates/Interfaces"
import CardContainer from "./CardContainer"
import {LinearLayout} from "./LinearLayout"
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
                <LinearLayout x={100} y={100} orientation="vertical" padding={100}>
                    <Text text="hhhh"></Text>
                    <Text text="hhhhsfasvfa"></Text>
                    <Text text="hhhhsfa"></Text>
                    <Text text="hhhhsfa"></Text>
                </LinearLayout>
            </Layer>
        )
    }
}

export default UI