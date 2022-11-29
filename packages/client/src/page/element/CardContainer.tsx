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
    stage: number,
    cardList: string[],
    selectedCardList: number[],
    recast: () => void,
    onCardClick: (index: number) => void
}

interface CardContainerState {
    tipCard: number
}

class CardContainer extends React.Component<CardContainerProps, CardContainerState> {

    static defaultProps = {
        x: window.innerWidth / 2,
        y: window.innerHeight * 7 / 8,
        cardWidth: 100,
        isInRecast: false,
        stage: -1,
    }

    cardImg: Record<string, HTMLImageElement> = {}

    constructor(props) {
        super(props)
        this.state = {
            tipCard: null,
        }
        for(let key in CardDescription){
            let img = new Image()
            img.src = ImgsManager.getInstance().getImg(`${key}_Small.png`);
            this.cardImg[key] = img
        }
    }


    render(): React.ReactNode {

        let theta = 30;
        let mid = (this.props.cardList.length - 1) / 2;
        let cards = this.props.cardList.map((value, index) => {
            let img = this.cardImg[value]
            let isSelected: boolean = this.props.selectedCardList.findIndex((value) => value == index) != -1

            return (

                <Group
                    key={index}
                    offsetX={this.props.cardWidth / 2}
                    offsetY={this.props.cardWidth * 1.2}
                    rotation={- theta * (index - mid)}
                >

                    <LinearLayout
                        background={isSelected ? '#aaaaff' : null}
                        xAlign='center'
                        yAlign='middle'
                        onClick={ () => {if(!this.props.isInRecast){this.setState({tipCard: null})};this.props.onCardClick(index)}}
                        onTap={() => {if(!this.props.isInRecast){this.setState({tipCard: null})};this.props.onCardClick(index)}}
                        onMouseEnter={() => { this.setState({ tipCard: index }) }}
                        width={this.props.cardWidth * 1.1}
                        height={this.props.cardWidth * 1.5}
                    >
                        <KImage
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
                        background='#333355'
                        opacity={0.9}
                        text='确定'
                        fontColor='white'
                        fontSize={18}
                        onClick={this.props.recast}
                    >

                    </KButton>
                }
                {this.state.tipCard != null && this.renderTip(this.state.tipCard)}
            </Group>
        )
    }

    renderTip(index: number): React.ReactNode {
        let mid = (this.props.cardList.length - 1) / 2;
        let theta = (90 - 30 * (index - mid)) / 180 * Math.PI
        let card = CardDescription[this.props.cardList[index]];
        if(card == undefined) return null;
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
}

export default CardContainer