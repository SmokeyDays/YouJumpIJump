import React from 'react';
import { Group, Rect, Tag, Text, Label, Image as KImage } from 'react-konva';
import { socket } from '../../communication/connection';
import { CardDescription, getDescription, ImgsManager, isInstant } from '../../regulates/utils';
import GamePage from '../GamePage';
import CardShowcase from './CardShowcase';
import KButton from './KButton';
import LinearLayout from './LinearLayout';

type CardContainerProps = typeof CardContainer.defaultProps & {
    x?: number,
    y?: number,
    cardWidth?: number,
    isInRecast?: boolean,
    stage: number
}

interface CardContainerState {
    cardList: string[]
    selectedCardList: number[]
    tipCard: number
    isInRecast: boolean
}

class CardContainer extends React.Component<CardContainerProps, CardContainerState> {

    static defaultProps = {
        x: window.innerWidth / 2,
        y: window.innerHeight * 7 / 8,
        cardWidth: 100,
        isInRecast: false,
        stage: -1,
    }

    static instance: CardContainer = null;
    constructor(props) {
        super(props)
        if (CardContainer.instance) {

        }
        CardContainer.instance = this
        this.state = {
            cardList: [],
            tipCard: null,
            selectedCardList: [],
            isInRecast: false,
        }
    }

    render(): React.ReactNode {
        if (!this.props.isInRecast && this.state.selectedCardList.length != 0) {
            this.setState({ selectedCardList: [] })
        }

        let theta = 30;
        let mid = (this.state.cardList.length - 1) / 2;
        let cards = this.state.cardList.map((value, index) => {
            let img = new Image(this.props.cardWidth, this.props.cardWidth * 1.4)
            img.src = ImgsManager.getInstance().getImg(`${value}_Small.png`);
            let isSelected: boolean = this.state.selectedCardList.findIndex((value) => value == index) != -1

            return (

                <Group

                    offsetX={this.props.cardWidth / 2}
                    offsetY={this.props.cardWidth * 1.2}
                    rotation={theta * (index - mid)}
                >

                    <LinearLayout
                        background={isSelected ? '#aaaaff' : null}
                        xAlign='center'
                        yAlign='middle'
                        width={this.props.cardWidth * 1.1}
                        height={this.props.cardWidth * 1.5}
                    >
                        <KImage
                            onMouseEnter={() => { this.setState({ tipCard: index }) }}
                            onMouseDown={() => {
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
                                    if (!this.isShowingCard) {
                                        if (this.props.stage == 1 || isInstant(this.state.cardList[index])) {
                                            console.log('get-available-pos', this.state.cardList[index])
                                            socket.emit('get-available-pos', this.state.cardList[index])
                                        }
                                        CardShowcase.instance.showCard(this.state.cardList[index]);
                                        this.removeCard(index);
                                        this.isShowingCard = true;
                                    }
                                    else {
                                        CardShowcase.instance.clearState();
                                        if (this.props.stage == 1 || isInstant(this.state.cardList[index])) {
                                            console.log('get-available-pos', this.state.cardList[index])
                                            socket.emit('get-available-pos', this.state.cardList[index])
                                        }
                                        CardShowcase.instance.showCard(this.state.cardList[index]);
                                        this.removeCard(index);
                                        this.isShowingCard = true;
                                    }
                                }
                            }}
                            width={this.props.cardWidth}
                            height={this.props.cardWidth * 1.4}
                            image={img}
                        ></KImage>
                    </LinearLayout>
                </Group>)
        })

        return (

            <Group
                onMouseLeave={() => this.setState({ tipCard: null })}
                x={this.props.x}
                y={this.props.y}
            >

                {cards}
                {this.props.isInRecast &&
                    <KButton
                        x={-this.props.cardWidth * 0.35}
                        y={-this.props.cardWidth * 1.8}
                        height={this.props.cardWidth * 0.3}
                        width={this.props.cardWidth * 0.7}
                        background='#555577'
                        opacity={0.8}
                        text='确定'
                        fontColor='white'
                        fontSize={18}
                        onClick={() => {
                            let cardList = this.state.selectedCardList.map((val) => this.state.cardList[val]);
                            socket.emit('resolve-signal', { type: 'recast', val: cardList })
                            GamePage.instance.setInRecast(false)
                        }}
                    >

                    </KButton>
                }
                {this.state.tipCard != null && this.renderTip(this.state.tipCard)}
            </Group>
        )
    }

    renderTip(index: number): React.ReactNode {
        let mid = (this.state.cardList.length - 1) / 2;
        let theta = (90 - 30 * (index - mid)) / 180 * Math.PI
        let card = CardDescription[this.state.cardList[index]];
        return (

            <Label
                x={this.props.cardWidth * 1.5 * Math.cos(theta)}
                y={-this.props.cardWidth * 1.5 * Math.sin(theta)}
            >
                <Tag
                    fill='grey'
                    pointerDirection="down"
                    pointerHeight={10}
                    pointerWidth={10}
                    lineJoin='round'
                    shadowColor='grey'
                    shadowBlur={10}
                    shadowOffsetX={10}
                    shadowOffsetY={10}
                    shadowOpacity={0.5}
                    cornerRadius={10}
                    opacity={0.8}
                >
                </Tag>
                <Text
                    text={`名称:   ${card["name"]}\n\n描述:   ${card["desc"]}`}
                    width={this.props.cardWidth * 2}
                    fill='white'
                    fontSize={20}
                    padding={7}
                ></Text>
            </Label>
        )
    }

    setCard(newCardList: string[]) {
        this.setState({ cardList: newCardList })
    }

    addCard(cardId: string) {
        this.state.cardList.push(cardId)
        this.setState({})
    }

    removeCard(index: number) {
        this.state.cardList.splice(index, 1)
        this.setState({ tipCard: null })
    }

    isShowingCard: boolean = false
}

export default CardContainer