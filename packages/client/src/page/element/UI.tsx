import React from "react"
import { Layer, Text } from "react-konva"
import { Player } from "../../regulates/Interfaces"
import GamePage, { LocalPlayer } from "../GamePage"
import CardContainer from "./CardContainer"
import CardShowcase from "./CardShowcase"
import KButton from "./KButton"
import LinearLayout from "./LinearLayout"
import PlayerList from "./PlayerList"
import TopTitle from "./TopTitle"

interface UIProps {
    playerList: (Player & { numberPos: number })[],
    currentRound: number,
    turn: number,
    currentBoard: number,
    stage: number,
    isInRecast: boolean
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
                    currentPlayer={LocalPlayer == this.props.turn ? '你' : this.props.playerList[this.props.turn].name}

                    turn={this.props.turn}
                    currentRound={this.props.currentRound}
                    stage={this.props.stage}
                    isInRecast={this.props.isInRecast}
                ></TopTitle>
                <PlayerList
                    x={20}
                    y={20}
                    trun={this.props.turn}
                    playList={this.props.playerList}></PlayerList>
                <CardContainer
                    x={window.innerWidth / 2}
                    y={window.innerHeight * 7 / 8}
                    isInRecast={this.props.isInRecast}
                    stage={this.props.stage}
                ></CardContainer>
                <LinearLayout
                    xAlign="right"
                    yAlign="middle"
                    width={window.innerWidth}
                    height={window.innerHeight}
                    padding={window.innerWidth / 15}
                >
                    <CardShowcase
                        turn={this.props.turn}
                        width={showcaseWidth}
                        parentRef={'1'}
                        stage={this.props.stage}
                    ></CardShowcase>
                    <Text></Text>
                </LinearLayout>
                <LinearLayout
                    width={window.innerWidth}
                    height={window.innerHeight}
                    xAlign='left'
                    yAlign='bottom'
                    padding={window.innerWidth / 15}
                >
                    <Text></Text>
                    <LinearLayout
                        orientation="vertical"
                        padding={window.innerWidth / 15}

                    >
                        <KButton
                            text="上"
                            background="#9acd32"
                            height={window.innerHeight/25}
                            width={window.innerHeight/25}
                            fontSize={window.innerHeight/40}
                            fontColor='white'
                            onClick={GamePage.instance.addCurrentBoard}

                        >

                        </KButton>

                        <KButton
                            text="下"
                            background="#9acd32"
                            height={window.innerHeight/25}
                            width={window.innerHeight/25}
                            fontSize={window.innerHeight/40}
                            fontColor='white'
                            onClick={GamePage.instance.minusCurrentBoard}
                        >

                        </KButton>

                        <Text></Text>

                    </LinearLayout>

                </LinearLayout>
            </Layer>
        )
    }
}

export default UI