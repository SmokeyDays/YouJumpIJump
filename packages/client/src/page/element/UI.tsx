import React from "react"
import { Layer } from "react-konva"
import { Player } from "../../regulates/Interfaces"
import CardContainer from "./CardContainer"
import CardShowcase from "./CardShowcase"
import LinearLayout from "./LinearLayout"
import PlayerList from "./PlayerList"
import TopTitle from "./TopTitle"

interface UIProps {
    playerList: (Player & {numberPos: number})[],
    currentRound: number,
    turn: number,
    currentBoard: number,
    stage: number,
}
class UI extends React.Component<UIProps> {
    constructor(props) {
        super(props)
    }

    render(): React.ReactNode {
        let showcaseWidth = Math.min(300, window.innerWidth / 3, (window.innerHeight - 100) / 1.7)
        return (
            <Layer>
                <TopTitle
                    x={window.innerWidth / 2}
                    y={window.innerHeight / 9}
                    currentBoard={this.props.currentBoard}
                    currentPlayer={this.props.playerList[this.props.turn].name}
                    currentRound={this.props.currentRound}
                    stage = {this.props.stage}
                    ></TopTitle>
                <PlayerList
                    x={20}
                    y={20}
                    trun = {this.props.turn}
                    playList={this.props.playerList}></PlayerList>
                <CardContainer
                    x={window.innerWidth / 2}
                    y={window.innerHeight * 7 / 8}
                ></CardContainer>
                <LinearLayout
                    xAlign="right"
                    yAlign="middle"
                    width={window.innerWidth}
                    height={window.innerHeight}
                >
                    <CardShowcase
                        width={showcaseWidth}
                        parentRef={'1'}
                        stage = {this.props.stage}
                    ></CardShowcase>
                </LinearLayout>

            </Layer>
        )
    }
}

export default UI