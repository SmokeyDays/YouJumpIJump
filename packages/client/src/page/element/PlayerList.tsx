import React from 'react';
import { Player } from '../../regulates/Interfaces';
import { Group, Text } from 'react-konva';

interface PlayerListProps {
    playList?: Player[]
}

class PlayerList extends React.Component<PlayerListProps> {
    constructor(props) {
        super(props)

    }
    
    render(): React.ReactNode {
        let players = this.props.playList.map((val, index)=>{
            return (
            <Text text={
                `玩家${index+1}:   ` + 
                (val.alive?"存活":"死亡") +
              `  智识: ${val.mastery}` +
              `  位置: 第${val.position[0]+1}层 ${val.position[1]}, ${val.position[2]}`}
             fontSize={20}
             y={30*index}
             ></Text>)
        })
        console.log(this.props.playList)
        console.log(players)
        return (
            <Group x={20} y={20}>
                {players}
            </Group>
        )
    }

}

export default PlayerList