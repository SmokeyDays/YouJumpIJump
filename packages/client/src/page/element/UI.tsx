import React from "react"
import { Layer, Text } from "react-konva"
import { socket } from "../../communication/connection"
import { Player } from "../../regulates/Interfaces"
import { isInstant } from "../../regulates/utils"
import GamePage, { LocalPlayer } from "../GamePage"
import { CardList } from "../GlobalState"
import CardContainer from "./CardContainer"
import CardShowcase from "./CardShowcase"
import Center from "./Center"
import KButton from "./KButton"
import LinearLayout from "./LinearLayout"
import PlayerList from "./PlayerList"
import TopTitle from "./TopTitle"

interface UIState {
    cardId: string,
    cardList: string[],
    selectedCardList: number[],
}
interface UIProps {
    playerList: (Player & { numberPos: number })[],
    currentRound: number,
    turn: number,
    currentBoard: number,
    stage: number,
    isInRecast: boolean,
    canSkip: boolean,
}
class UI extends React.Component<UIProps, UIState> {
    static current: UI = null

    static instance(): UI {
        if (UI.current == null) {
            console.error("Call null UI")
        }
        return UI.current
    }

    constructor(props) {
        super(props)
        this.state = {
            cardId: null,
            cardList: [],
            selectedCardList: []
        }
        UI.current = this
        this.clearState = this.clearState.bind(this)
        this.recast = this.recast.bind(this)
        this.useCard = this.useCard.bind(this)
        this.backCard = this.backCard.bind(this)
        this.addCard = this.addCard.bind(this)
        this.onCardClick = this.onCardClick.bind(this)

    }

    clearState() {
        if (this.state.cardId) {
            this.backCard()
        }
        this.setState({ selectedCardList: [] })
    }

    recast() {
        let cardList = this.state.selectedCardList.map((val) => this.state.cardList[val]);
        socket.emit('resolve-signal', { type: 'recast', val: cardList })
        console.log('resolve-signal', { type: 'recast', val: cardList })
        this.clearState()
        GamePage.instance.setInRecast(false)
        GamePage.instance.setState({canSkip:false})
    }

    useCard() {
        console.log(this.state.cardId, `run in ${this.props.stage ? 'main' : 'instate'}`)
        socket.emit('resolve-signal', { type: 'card', val: this.state.cardId })
        if (this.state.cardId != null) {
            GamePage.instance.setFreSlotList([])
            GamePage.instance.setState({canSkip:false})
            this.setState({ cardId: null })
        }
    }

    backCard() {
        if (this.state.cardId != null) {
            this.addCard(this.state.cardId);
            this.setState({ cardId: null })
            GamePage.instance.setFreSlotList([])
        }
    }

    addCard(cardId: string) {
        this.state.cardList.push(cardId)
        this.setState({})
    }

    onCardClick(index: number) {
        {
            if (this.props.isInRecast) {
                let tmp: number = this.state.selectedCardList.findIndex((value) => value == index);
                if (tmp != -1) {
                    this.state.selectedCardList.splice(tmp, 1)
                }
                else {
                    this.state.selectedCardList.push(index)
                }
                this.setState({})
            }
            else {
                if (this.state.cardId == null) {
                    if (this.props.stage == 1 || isInstant(this.state.cardList[index])) {
                        console.log('get-available-pos', this.state.cardList[index])
                        socket.emit('get-available-pos', this.state.cardList[index])
                    }
                    this.showCard(this.state.cardList[index]);
                    this.removeCard(index);
                }
                else {
                    this.clearState();
                    if (this.props.stage == 1 || isInstant(this.state.cardList[index])) {
                        console.log('get-available-pos', this.state.cardList[index])
                        socket.emit('get-available-pos', this.state.cardList[index])
                    }
                    this.showCard(this.state.cardList[index]);
                    this.removeCard(index);
                }
            }
        }
    }

    removeCard(index: number) {
        this.state.cardList.splice(index, 1)
        this.setState({})
    }

    showCard(cardId: string) {
        this.setState({ cardId: cardId })
    }

    render(): React.ReactNode {
        // 如果上一次没有清空重铸卡序列, 现在清空

        let showcaseWidth = Math.min(300,  window.innerWidth / 3, (window.innerHeight - 100) / 1.7)
        if(showcaseWidth<200) showcaseWidth = window.innerWidth/2.2
        return (
            <Layer>

                {window.innerWidth > 800 ? <PlayerList
                    currentRound={this.props.currentRound}
                    x={window.innerWidth / 100}
                    y={window.innerHeight / 100}
                    trun={this.props.turn}
                    playList={this.props.playerList}></PlayerList> :
                    <LinearLayout
                        xAlign="center"
                        yAlign="top"
                        orientation="vertical"
                        width={window.innerWidth}
                        height={window.innerHeight}
                        padding={window.innerHeight / 100}
                    >
                        <Text></Text>
                        <PlayerList
                            currentRound={this.props.currentRound}
                            x={window.innerWidth / 100}
                            y={window.innerHeight / 100}
                            trun={this.props.turn}
                            playList={this.props.playerList}>

                        </PlayerList>
                    </LinearLayout>
                }
                <CardContainer
                    cardList={this.state.cardList}
                    selectedCardList={this.state.selectedCardList}
                    recast={this.recast}
                    onCardClick={this.onCardClick}
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
                        clearState={this.clearState}
                        useCard={this.useCard}
                        cardId={this.state.cardId}
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
                            height={window.innerHeight / 25}
                            width={window.innerHeight / 25}
                            fontSize={window.innerHeight / 40}
                            fontColor='white'
                            onClick={GamePage.instance.addCurrentBoard}

                        >

                        </KButton>

                        <KButton
                            text="下"
                            background="#9acd32"
                            height={window.innerHeight / 25}
                            width={window.innerHeight / 25}
                            fontSize={window.innerHeight / 40}
                            fontColor='white'
                            onClick={GamePage.instance.minusCurrentBoard}
                        >

                        </KButton>

                        <Text></Text>

                    </LinearLayout>

                </LinearLayout>


                {
                    this.props.canSkip &&
                    <TopTitle
                        x={window.innerWidth / 2}
                        y={window.innerHeight / 9}
                        stage={this.props.stage}
                        isInRecast={this.props.isInRecast}
                        clearState={this.clearState}
                    ></TopTitle>
                }
            </Layer>
        )
    }
}

export default UI