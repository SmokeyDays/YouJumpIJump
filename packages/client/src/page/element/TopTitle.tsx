import React, { Fragment } from 'react';
import { Group, Text, } from 'react-konva';
import Center from './Center';

interface TopTitleProps {
    currentBoard: number
    currentPlayer: string
    currentRound: number
}


class TopTitle extends React.Component<TopTitleProps> {
    constructor(props) {
        super(props)
    }

    render(): React.ReactNode {
        return (

            <Group>

                <Center
                    Type={Text}
                    text={`第${this.props.currentRound}个回合  当前是玩家${this.props.currentPlayer}的回合`}
                    fontSize={20}
                    x={window.innerWidth * 0.5}
                    y={window.innerHeight * 0.15}
                    fill={'#1b315e'}></Center>
                <Center
                    Type={Text}
                    text={`第${this.props.currentBoard + 1}层`}
                    fontSize={20}
                    x={window.innerWidth * 0.5}
                    y={window.innerHeight * 0.2}
                    fill={'#1b315e'}></Center>
            </Group>
        )
    }

}

export default TopTitle