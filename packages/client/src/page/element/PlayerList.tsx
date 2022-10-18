import React from 'react';
import { Player } from '../../regulates/Interfaces';
import { Group, Text, Label, Tag } from 'react-konva';

interface PlayerListProps {
    playList?: Player[]
}

class PlayerList extends React.Component<PlayerListProps> {

    static colorList = [
        "#4169E1",
        "#00FA9A",
        "#ADFF2F",
        "#FFA500",
        "#FF4500",
    ]

    constructor(props) {
        super(props)

    }

    render(): React.ReactNode {
        let players = this.props.playList.map((val, index) => {
            return (

                <Label
                    y={50 * index}
                >
                    <Tag
                        fill={index < PlayerList.colorList.length ? PlayerList.colorList[index]:'grey'}
                        lineJoin='round'
                        shadowColor='grey'
                        shadowBlur={10}
                        shadowOffsetX={5}
                        shadowOffsetY={5}
                        shadowOpacity={0.5}
                    >
                    </Tag>
                    <Text text={
                        `玩家${index + 1}:   ` +
                        (val.alive ? "存活" : "死亡") +
                        `  智识: ${val.mastery}` +
                        `  位置: 第${val.position[0] + 1}层 ${val.position[1]}, ${val.position[2]}`}
                        fontSize={20}
                        padding={7}
                    ></Text>
                </Label>)
        })
        return (
            <Group x={20} y={20}>
                {players}
            </Group>
        )
    }

}

export default PlayerList