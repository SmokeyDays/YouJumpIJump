import React from 'react';
import { Image as KImage, Rect } from 'react-konva';
import LinearLayout from './LinearLayout';

interface CardShowcaseState {
    cardId: string,
}

class CardShowcase extends React.Component<any,CardShowcaseState> {

    constructor(props) {
        super(props)
        if(CardShowcase.instance) {

        }
        CardShowcase.instance = React.createRef()
        this.state = {
            cardId: null
        }
        this.width = window.innerWidth / 4
    }

    showCard(id: string) {
        this.setState({cardId:id})
    }

    render(): React.ReactNode {
        let img = new Image()
        img.src = require(`../../assets/cards/${this.state.cardId}_S.png`);
        return (
            this.state.cardId == null ? null : 
            <LinearLayout
                ref = {CardShowcase.instance}
                orientation='vertical'
                x={window.innerWidth - this.width - 100}
                y={100}
                width={this.width}
                align='center'
                padding={10}
            >
                <KImage
                    image={img}
                    width={this.width -20}
                    height={this.width * 4/3}></KImage>
                <LinearLayout
                    width={this.width}
                    align='center'
                    padding={5}
                >
                    <Rect fill="blue" width={this.width / 2 - 10} height={50}>

                    </Rect>
                    <Rect fill="red" width={this.width / 2 - 10} height={50}>

                    </Rect>
                </LinearLayout>
                <Rect fill="green" width={this.width *4/ 5 - 10} height={50}>

                    </Rect>
            </LinearLayout>
        )
    }

    static instance = null
    width: number
    height: number
}

export default CardShowcase