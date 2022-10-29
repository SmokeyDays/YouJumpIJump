import React from 'react';
import { Image as KImage, Text } from 'react-konva';
import KButton from './KButton';
import LinearLayout from './LinearLayout';
import CardContainer from './CardContainer';
import { CardDescription } from '../../regulates/utils';

interface CardShowcaseState {
    cardId: string,
}

class CardShowcase extends React.Component<any, CardShowcaseState> {

    constructor(props) {
        super(props)
        if (CardShowcase.instance) {

        }
        CardShowcase.instance = this
        this.state = {
            cardId: null
        }
        this.width = window.innerWidth / 4
    }

    showCard(id: string) {
        this.setState({ cardId: id })
    }

    render(): React.ReactNode {
        if (this.state.cardId == null) return null
        let img = new Image()
        img.src = require(`../../assets/cards/${this.state.cardId}_B.png`);
        let card = CardDescription[this.state.cardId]
        return (
            <LinearLayout
                orientation='vertical'
                x={window.innerWidth - this.width - 100}
                y={30}
                width={this.width}
                xAlign='center'
                padding={10}
            >
                <Text text={card['name']} fontSize={30}></Text>
                <KImage
                    image={img}
                    width={this.width - 20}
                    height={this.width * 4 / 3}></KImage>

                <Text text='描述' fontSize={30}></Text>
                <Text text={card['desc']} width={this.width - 20} fontSize={21}></Text>
                <Text fontSize={5}></Text>
                <Text text={card['lore']} width={this.width - 20} fontSize={21}></Text>
                <LinearLayout
                    width={this.width}
                    xAlign='center'
                    padding={5}
                >
                    <KButton
                        background='#ffd400'
                        width={this.width / 2 - 10}
                        height={50}
                        text="附加行动">

                    </KButton>

                    <KButton
                        background='#1d953f'
                        width={this.width / 2 - 10}
                        height={50}
                        text="主要行动">

                    </KButton>
                </LinearLayout>
                <KButton
                    width={this.width * 4 / 5 - 10}
                    height={50}
                    background="#bb1111"
                    text="取消"
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
    width: number
    height: number
}

export default CardShowcase