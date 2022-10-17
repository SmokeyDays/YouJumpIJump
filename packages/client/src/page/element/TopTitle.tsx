import React from 'react';
import { Group, Text } from 'react-konva';

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
            <Text
            x={window.innerWidth*0.4}
            y={window.innerHeight*0.1}
            text={`第${this.props.currentRound}个回合 当前是玩家${this.props.currentPlayer}的回合\n第${this.props.currentBoard+1}层`}
            fontSize={30}>
            </Text>
        )
    }
}

export default TopTitle