import React from 'react';
import { Image as KImage, Text } from 'react-konva';
import KButton from './KButton';
import LinearLayout from './LinearLayout';
import CardContainer from './CardContainer';
import { CardDescription, ImgsManager, isInstant } from '../../regulates/utils';
import { LocalPlayer } from '../GamePage';

interface CardShowcaseState {
    cardId: string,
}

interface CardShowcaseProps {
    x?: number
    y?: number
    width: number
    parentRef?: any
    stage: number
    turn: number
}
class CardShowcase extends React.Component<CardShowcaseProps, CardShowcaseState> {

    constructor(props) {
        super(props)
        if (CardShowcase.instance) {

        }
        CardShowcase.instance = this
        this.state = {
            cardId: null,
        }
        this.width = this.props.width
        this.height = 500
        this.refDom = null
    }

    showCard(id: string) {
        this.setState({ cardId: id })
    }

    backCard() {
        if (this.state.cardId != null) {
            CardContainer.instance.addCard(this.state.cardId);
            CardContainer.instance.isShowingCard = false;
            this.setState({ cardId: null })
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
        if (this.state.cardId == null) return null
        let img = new Image()
        img.src = ImgsManager.getInstance().getImg(`${this.state.cardId}_Big.png`);
        let card = CardDescription[this.state.cardId]
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
            >
                <Text text={card['name']} fontSize={bFont}></Text>
                <KImage
                    image={img}
                    width={this.width - sFont}
                    height={(this.width - sFont) * 4 / 3}></KImage>

                <Text text='描述' fontSize={bFont}></Text>
                <Text text={card['desc']} width={this.width - sFont} fontSize={sFont}></Text>
                <Text fontSize={sFont / 3}></Text>
                <Text text={card['lore']} width={this.width - sFont} fontSize={sFont}></Text>
                {this.renderButtons()}
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
                background="#bb1111"
                text="取消"
                fontSize={mFont}
                onClick={() => {
                    this.backCard();
                }}
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
            if (isInstant(this.state.cardId)) {
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
                                fontSize={mFont}>
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
                        fontSize={mFont}>
                    </KButton>
                    {this.renderCancalButton()}
                </LinearLayout>]
            )
        }
    }

    static instance = null
    refDom: any
    width: number
    height: number
}

export default CardShowcase