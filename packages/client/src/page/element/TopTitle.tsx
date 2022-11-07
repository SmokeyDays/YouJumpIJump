import React, { Fragment } from 'react';
import { Text, } from 'react-konva';
import { LocalPlayer } from '../GamePage';
import Center from './Center';
import KButton from './KButton';
import LinearLayout from './LinearLayout';

interface TopTitleProps {
    currentBoard: number
    currentPlayer: string
    currentRound: number
    x?: number
    y?: number
    stage: number
    turn: number
    otherTip?: string
    canJump?: boolean
}


class TopTitle extends React.Component<TopTitleProps> {
    constructor(props) {
        super(props)
    }

    render(): React.ReactNode {
        console.log("turn", this.props.turn, LocalPlayer)
        return (
            <Center
                Type={LinearLayout}
                yCenter={false}
                typeProps={{
                    orientation: 'vertical',
                    xAlign: 'center',
                    padding: 20
                }}
                {...this.props}
            >
                <Text
                    Type={Text}
                    text={`第${this.props.currentRound}个回合` +
                        `当前是${this.props.currentPlayer}的${this.props.stage == 0 ? '迅捷' : '主动'}回合`}
                    fontSize={20}
                    fill={'#1b315e'}></Text>
                <Text
                    text={`第${this.props.currentBoard + 1}层`}
                    fontSize={20}
                    fill={'#1b315e'}></Text>

                {this.props.otherTip &&
                    <Text
                    text={this.props.otherTip}
                    fontSize={20}
                    fill={'#1b315e'}>

                    </Text>
                }

                {LocalPlayer == this.props.turn &&
                    (<KButton
                        text='跳过'
                        width={100}
                        height={50}
                        background={"#bb1111"}
                        onClick={() => console.log(this.props.currentPlayer, "jump out")}
                    >
                    </KButton>)}
            </Center>
        )
    }

}

export default TopTitle