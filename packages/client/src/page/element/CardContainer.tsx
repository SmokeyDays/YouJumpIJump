import React from 'react';
import { Group, Rect, Tag, Text, Label } from 'react-konva';

class Card {
    public name: string;
    public introduce: string;
    public color: string;
    constructor(name: string, introduce: string, color: string) {
        this.color = color;
        this.name = name;
        this.introduce = introduce;
    }
}

const cardMap: {
    [key: string]: Card
} = {
    ["None"]: new Card("None", "none", "red"),
    ["test1"]: new Card("test1", "none", "black"),
    ["test2"]: new Card("test2", "none", "blue"),
    ["test3"]: new Card("test3", "none", "green"),
}

interface CardShowcaseProps {
    card: string,
    handleMainAct: any,
    handleEffectAct: any,
    cancel: any
}

class CardShowcase extends React.Component<CardShowcase> {

    constructor(props) {
        super(props)
    }

    render(): React.ReactNode {
        return <Text></Text>
    }
}


type CardContainerProps = typeof CardContainer.defaultProps & {
    x?: number,
    y?: number,
    cardWidth?: number
    cardList?: string[]
}

interface CardContainerState {
    cardList?: string[]
    tipCard?: number
}

class CardContainer extends React.Component<CardContainerProps, CardContainerState> {

    static defaultProps = {
        x: window.innerWidth / 2,
        y: window.innerHeight * 7 / 8,
        cardWidth: 100,
        cardList: ["None", "test1", "test2", "test3"]
    }

    constructor(props) {
        super(props)
        this.state = {
            cardList: this.props.cardList,
            tipCard: null
        }
    }

    render(): React.ReactNode {
        let theta = 30;
        let mid = (this.state.cardList.length - 1) / 2;
        let cards = this.state.cardList.map((value, index) => {
            return (
                <Rect
                    onMouseEnter={() => { this.setState({ tipCard: index }) }}
                    width={this.props.cardWidth}
                    height={this.props.cardWidth * 1.4}
                    offsetX={this.props.cardWidth / 2}
                    offsetY={this.props.cardWidth * 1.2}
                    fill={cardMap[value].color}
                    rotation={theta * (index - mid)}
                ></Rect>)
        })

        return (

            <Group
                onMouseLeave={() => this.setState({ tipCard: null })}
                x={this.props.x}
                y={this.props.y}
            >

                {cards}
                {this.state.tipCard != null ? this.renderTip(this.state.tipCard) : <Text></Text>}
            </Group>
        )
    }

    renderTip(index: number): React.ReactNode {
        let mid = (this.state.cardList.length - 1) / 2;
        let theta = (90 - 30 * (index - mid)) / 180 * Math.PI
        let card = cardMap[this.state.cardList[index]];
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
                >
                </Tag>
                <Text
                    text={`名称: ${card.name}\n\n描述: ${card.introduce}`}
                    fill='white'
                    fontSize={20}
                    padding={7}
                ></Text>
            </Label>
        )
    }
}

export default CardContainer