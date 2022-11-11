import React from 'react';
import { Image as KImage, Text } from 'react-konva';
import KButton from './KButton';
import LinearLayout from './LinearLayout';
import CardContainer from './CardContainer';
import { CardDescription, ImgsManager, isInstant } from '../../regulates/utils';
import GamePage, { LocalPlayer } from '../GamePage';
import { socket } from '../../communication/connection';

interface CardShowcaseProps {
    cardId: string,
    x?: number
    y?: number
    width: number
    parentRef?: any
    stage: number
    turn: number
    clearState: () => void
    useCard: () => void
}
class CardShowcase extends React.Component<CardShowcaseProps> {

    cardImg: Record<string, HTMLImageElement> = {}

    constructor(props) {
        super(props)
        this.width = this.props.width
        this.height = 100
        this.refDom = null
        
        for(let key in CardDescription){
            let img = new Image()
            img.src = ImgsManager.getInstance().getImg(`${key}_Big.png`);
            this.cardImg[key] = img
        }
    }

    componentDidMount(): void {
        if (this.refDom) this.height = this.refDom.height
    }

    componentDidUpdate(): void {
        if (this.refDom) {
            if (this.height == this.refDom.height) return
            this.height = this.refDom.height
            this.props.parentRef.setState({})

        }
    }

    render(): React.ReactNode {
        if (this.props.cardId == null) return null
        let img = this.cardImg[this.props.cardId]
        let card = CardDescription[this.props.cardId]
        let bFont = Math.max(20, this.width / 10)
        let mFont = Math.max(18, this.width / 12)
        let sFont = Math.max(16, this.width / 18)
        let bHeight = Math.max(20, this.width / 6)
        return (
            <LinearLayout
                reff={(e) => { this.refDom = e }}
                orientation='vertical'
                x={this.props.x}
                y={this.props.y}
                width={this.width}
                xAlign='center'
                padding={this.width / 30}
                background='#78cdd1'
                stroke='#56acc0'
                strokeWidth={this.width / 60}
                opacity={0.7}
                shadow={true}
            >
                <Text></Text>
                <Text text={card['name']} fontSize={bFont} fill='white'></Text>
                <KImage
                    image={img}
                    width={this.width - sFont}
                    height={(this.width - sFont) * 4 / 3}></KImage>

                <Text text='描述' fontSize={bFont} fill='white'></Text>
                <Text text={card['desc']} width={this.width - sFont} fontSize={sFont} fill='white'></Text>
                <Text fontSize={sFont / 3}></Text>
                <Text text={card['lore']} width={this.width - sFont} fontSize={sFont} fill='white'></Text>
                {this.renderButtons()}
                <Text></Text>
            </LinearLayout>
        )
    }

    renderCancalButton() {

        let mFont = Math.max(18, this.width / 12)
        let sFont = Math.max(16, this.width / 18)
        let bHeight = Math.max(20, this.width / 6)
        return (

            <KButton
                width={this.width / 2 - sFont}
                height={bHeight}
                background="#ff3333"
                text="取消"
                fontSize={mFont}
                fontColor='white'
                onClick={this.props.clearState}
            ></KButton>
        )
    }

    renderButtons(): Array<any> {
        let mFont = Math.max(18, this.width / 12)
        let sFont = Math.max(16, this.width / 18)
        let bHeight = Math.max(20, this.width / 6)
        if(LocalPlayer != this.props.turn) {
            return [<Text text={"当前不是你的回合"} width={this.width - mFont} fontSize={mFont} fill='red'></Text>, this.renderCancalButton()]
        }

        if (this.props.stage == 0) {
            if (isInstant(this.props.cardId)) {
                return (
                    [
                        <LinearLayout
                            width={this.width}
                            xAlign='center'
                            padding={sFont / 3}
                        >


                            <KButton
                                background='#ffc20e'
                                width={this.width / 2 - sFont}
                                height={bHeight}
                                text="迅捷"
                                fontSize={mFont}
                                fontColor='white'
                                onClick={this.props.useCard}
                                >
                            </KButton>
                            {this.renderCancalButton()}
                        </LinearLayout>]
                )
            }
            else {
                return [<Text text={"你不能将该牌在迅捷回合中打出"} width={this.width - mFont} fontSize={mFont} fill='red'></Text>, this.renderCancalButton()]
            }
        }
        else {
            return (
                [<LinearLayout
                    width={this.width}
                    xAlign='center'
                    padding={sFont / 3}
                >


                    <KButton
                        background='#1d953f'
                        width={this.width / 2 - sFont}
                        height={bHeight}
                        text="主要"
                        fontSize={mFont}
                        fontColor='white'
                        onClick={this.props.useCard}
                        >
                    </KButton>
                    {this.renderCancalButton()}
                </LinearLayout>]
            )
        }
    }

    refDom: any
    width: number
    height: number
}

export default CardShowcase