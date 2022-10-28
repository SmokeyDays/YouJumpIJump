import React from 'react';
import { Group, Rect, Tag, Text, Label, Image as KImage} from 'react-konva';
import { CardDescription, getDescription } from '../../regulates/utils';
import CardShowcase from './CardShowcase';

type CardContainerProps = typeof CardContainer.defaultProps & {
    x?: number,
    y?: number,
    cardWidth?: number
}

interface CardContainerState {
    cardList?: string[]
    tipCard?: number
}

function CutStr(str: string,count: number):string {
    let result = ""
    let amount = 0
    for(let i=0;i<str.length;i++) {
        if(str[i]==' ') {
            amount -= 0.75
        }
        amount++
        result+=str[i]
        if(amount>=count) {
            amount=0;
            result+='\n'
        }
    }
    return result;
}

class CardContainer extends React.Component<CardContainerProps, CardContainerState> {

    static defaultProps = {
        x: window.innerWidth / 2,
        y: window.innerHeight * 7 / 8,
        cardWidth: 100,
    }

    constructor(props) {
        super(props)
        if(CardContainer.instance) {

        }
        CardContainer.instance = React.createRef()
        this.state = {
            cardList: [],
            tipCard: null
        }
    }

    render(): React.ReactNode {
        let theta = 30;
        let mid = (this.state.cardList.length - 1) / 2;
        let cards = this.state.cardList.map((value, index) => {
        let img = new Image(this.props.cardWidth,this.props.cardWidth * 1.4)
        img.src= require("../../assets/cards/" + value + "_S.png");
            return (
                <KImage
                    onMouseEnter={() => { this.setState({ tipCard: index }) }}
                    onMouseDown={()=> {
                        CardShowcase.instance.current.showCard(this.state.cardList[index]);
                        this.removeCard(index);
                    }}
                    width={this.props.cardWidth}
                    height={this.props.cardWidth * 1.4}
                    offsetX={this.props.cardWidth / 2}
                    offsetY={this.props.cardWidth * 1.2}
                    image={img}
                    rotation={theta * (index - mid)}
                ></KImage>)
        })

        return (

            <Group
                ref = {CardContainer.instance}
                onMouseLeave={() => this.setState({ tipCard: null })}
                x={this.props.x}
                y={this.props.y}
            >

                {cards}
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
                >
                </Tag>
                <Text
                    text={`名称: ${card["name"]}\n\n${CutStr("描述:  "+getDescription(card["id"]),10)}`}
                    fill='white'
                    fontSize={20}
                    padding={7}
                ></Text>
            </Label>
        )
    }

    setCard(newCardList: string[]) {
        this.setState({cardList:newCardList})
    }

    addCard(cardId: string) {
        this.state.cardList.push(cardId)
        this.setState({})
    }

    removeCard(index: number) {
        this.state.cardList.splice(index,1)
        this.setState({})
    }

    static instance = null
}

export default CardContainer