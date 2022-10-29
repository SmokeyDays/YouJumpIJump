import React, { Fragment } from 'react';
import { Text, } from 'react-konva';
import Center from './Center';
import LinearLayout from './LinearLayout';

interface TopTitleProps {
    currentBoard: number
    currentPlayer: string
    currentRound: number
    x?: number
    y?: number
}


class TopTitle extends React.Component<TopTitleProps> {
    constructor(props) {
        super(props)
    }

    render(): React.ReactNode {
        return (
            <Center
                Type={LinearLayout}
                {...this.props}
                orientation='vertical'
                xAlign='center'
                padding={20}
            >
                <Text
                    Type={Text}
                    text={`第${this.props.currentRound}个回合  当前是玩家${this.props.currentPlayer}的回合`}
                    fontSize={20}
                    fill={'#1b315e'}></Text>
                <Text
                    text={`第${this.props.currentBoard + 1}层`}
                    fontSize={20}
                    fill={'#1b315e'}></Text>
            </Center>
        )
    }

}

export default TopTitle