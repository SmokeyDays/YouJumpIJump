import React from 'react';
import { Player } from '../../regulates/Interfaces';
import { Group, Text, Label, Tag } from 'react-konva';
import LinearLayout from './LinearLayout';
import { stringToArray } from 'konva/lib/shapes/Text';

interface PlayerListProps {
    playList?: (Player & { numberPos: number })[]
    x?: number,
    y?: number
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

    componentDidMount(): void {
        this.height = this.refDom.height
        this.width = this.refDom.width
    }

    render(): React.ReactNode {
        let fontSize = Math.max(15, Math.min(20, window.innerWidth / 100))
        let padding = Math.max(6, Math.min(10, window.innerWidth / 200))
        let players = this.props.playList.map((val, index) => {
            return (

                <LinearLayout
                    padding={10}
                >
                    <Label>
                        <Tag
                            fill={index < PlayerList.colorList.length ? PlayerList.colorList[index] : 'grey'}
                            lineJoin='round'
                            shadowColor='grey'
                            shadowBlur={10}
                            shadowOffsetX={5}
                            shadowOffsetY={5}
                            shadowOpacity={0.5}
                        >
                        </Tag>
                        <Text 
                        text={val.name}
                        width={70}
                        
                        fontSize={fontSize}
                        padding={padding}></Text>
                    </Label>
                    <Label>
                        <Tag
                            fill={'#d3d7d4'}
                            lineJoin='round'
                            shadowColor='grey'
                            shadowBlur={10}
                            shadowOffsetX={5}
                            shadowOffsetY={5}
                            shadowOpacity={0.5}
                        >
                        </Tag>
                        <Text text={
                            `  智识: ${val.mastery}` +
                            `  位置: 第${val.position[0] + 1}层 ${val.numberPos}`}
                            fontSize={fontSize}
                            padding={padding}
                            width={200}
                        ></Text>
                    </Label>
                </LinearLayout>)
        })
        return (
            <LinearLayout

                reff={(e) => { this.refDom = e }}
                {...this.props}
                orientation='vertical'
                padding={padding}
            >
                {players}
            </LinearLayout>
        )
    }

    refDom: any
    width: number = 0
    height: number = 0
}

export default PlayerList