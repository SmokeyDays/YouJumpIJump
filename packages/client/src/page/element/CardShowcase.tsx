import React from 'react';
import { Image as KImage, Rect } from 'react-konva';
import LinearLayout from './LinearLayout';

interface CardShowcaseProps {
    cardId: string,
}

class CardShowcase extends React.Component<CardShowcaseProps> {

    constructor(props) {
        super(props)
        this.width = window.innerWidth / 4
    }

    render(): React.ReactNode {
        let img = new Image()
        img.src = require("../../assets/cards/0_S.png");
        return (
            <LinearLayout
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
    width: number
    height: number
}

export default CardShowcase