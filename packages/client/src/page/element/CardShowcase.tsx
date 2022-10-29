import React from 'react';
import { Image as KImage, Text } from 'react-konva';
import KButton from './KButton';
import LinearLayout from './LinearLayout';
import CardContainer from './CardContainer';
import { CardDescription } from '../../regulates/utils';

interface CardShowcaseState {
    cardId: string,
}

interface CardShowcaseProps {
    x?: number
    y?: number
    width: number
}
class CardShowcase extends React.Component<CardShowcaseProps, CardShowcaseState> {

    constructor(props) {
        super(props)
        if (CardShowcase.instance) {

        }
        CardShowcase.instance = this
        this.state = {
            cardId: null
        }
        this.width = this.props.width
        this.refDom = null
    }

    showCard(id: string) {
        this.setState({ cardId: id })
    }

    componentDidMount(): void {
        //this.height = this.refDom.height
        this.height=this.width*1.7
    }

    render(): React.ReactNode {
        if (this.state.cardId == null) return null
        let img = new Image()
        img.src = require(`../../assets/cards/${this.state.cardId}_B.png`);
        let card = CardDescription[this.state.cardId]
        let bFont = this.width / 10
        let mFont = this.width / 12
        let sFont = this.width / 18
        let bHeight = this.width / 6
        return (
            <LinearLayout
                ref={e=>this.refDom=e}
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
                <LinearLayout
                    width={this.width}
                    xAlign='center'
                    padding={sFont / 3}
                >
                    <KButton
                        background='#ffd400'
                        width={this.width / 2 - sFont}
                        height={bHeight}
                        text="附加行动"
                        fontSize={mFont}>

                    </KButton>

                    <KButton
                        background='#1d953f'
                        width={this.width / 2 - sFont}
                        height={bHeight}
                        text="主要行动"
                        fontSize={mFont}>

                    </KButton>
                </LinearLayout>
                <KButton
                    width={this.width * 2 / 3}
                    height={bHeight}
                    background="#bb1111"
                    text="取消"
                    fontSize={mFont}
                    onClick={() => {
                        CardContainer.instance.addCard(this.state.cardId);
                        CardContainer.instance.isShowingCard = false;
                        this.setState({ cardId: null })
                    }}
                >

                </KButton>
            </LinearLayout>
        )
    }

    static instance = null
    refDom
    width: number
    height: number
}

export default CardShowcase