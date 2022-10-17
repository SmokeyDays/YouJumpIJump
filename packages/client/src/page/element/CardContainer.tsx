import React from 'react';
import { Group, Rect, Tag, Text } from 'react-konva';

const cardMap: {
    [key: string]: string
} = {
    ["None"]: "red",
    ["test1"]: "black",
    ["test2"]: "blue",
    ["test3"]: "green",
}

type CardContainerProps = typeof CardContainer.defaultProps & {
    x?: number,
    y?: number,
    cardWidth?: number
    cardList?: string[]
}

interface CardContainerState {
    cardList?: string[]
}

class CardContainer extends React.Component<CardContainerProps, CardContainerState> {

    static defaultProps = {
        x: window.innerWidth/2,
        y: window.innerHeight*7/8,
        cardWidth: 100,
        cardList: ["None", "test1", "test2", "test3"]
    }

    constructor(props) {
        super(props)
        this.state = {
            cardList: this.props.cardList
        }
    }

    render(): React.ReactNode {
        let theta = 30;
        let mid = (this.state.cardList.length-1)/2;
        let cards = this.state.cardList.map((value, index) => {
            return (
            <Rect
            width={this.props.cardWidth}
            height={this.props.cardWidth*1.4}
            offsetX={this.props.cardWidth/2}
            offsetY={this.props.cardWidth*1.2}
            fill={cardMap[value]}
            rotation={theta*(index-mid)}
            ></Rect>)
        })

        console.log(cards)
        return (
            <Group
            x={this.props.x}
            y={this.props.y}
            >
                {cards}
            </Group>
        )
    }
}

export default CardContainer