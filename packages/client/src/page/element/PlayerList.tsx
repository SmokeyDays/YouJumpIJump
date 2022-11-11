import React from 'react';
import { Player } from '../../regulates/Interfaces';
import { Group, Text, Label, Tag } from 'react-konva';
import LinearLayout from './LinearLayout';
import { stringToArray } from 'konva/lib/shapes/Text';

interface PlayerListProps {
    playList?: (Player & { numberPos: number })[]
    x?: number,
    y?: number,
    trun: number,
    currentRound: number,
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
        let maxLength = 7
        for (let val of this.props.playList) {
            maxLength = Math.max(val.name.length, maxLength)
        }
        let players = this.props.playList.map((val, index) => {
            return (

                <LinearLayout
                    key={val.name}
                    padding={10}
                >
                    <Text></Text>
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
                            width={fontSize * maxLength}
                            fill={"#f7f7f7"}
                            fontSize={fontSize}
                            padding={padding}></Text>
                    </Label>
                    <Label>
                        <Tag
                            fill={val.alive ? (this.props.trun == index ? '#41b349' : '#a1a5a2') : '#46485f'}
                            lineJoin='round'
                            shadowColor='grey'
                            shadowBlur={10}
                            shadowOffsetX={5}
                            shadowOffsetY={5}
                            shadowOpacity={0.5}
                        >
                        </Tag>
                        <Text text={
                            val.alive ?
                                `  智识: ${val.mastery}` +
                                `  位置: 第${val.position[0] + 1}层 ${val.numberPos}` : 'Dead!!!'}
                            fill={"#f7f7f7"}
                            fontSize={fontSize}
                            padding={padding}
                            width={fontSize * 15}
                        ></Text>
                    </Label>
                    <Text></Text>

                </LinearLayout>)
        })
        return (
            <LinearLayout

                reff={(e) => { this.refDom = e }}
                {...this.props}
                orientation='vertical'
                xAlign='center'
                padding={padding}
                shadow={true}
                background='#000000'
                opacity={0.3}
            >
                <Text></Text>
                <Text
                        text={`第${this.props.currentRound + 1}个回合 ${this.props.playList[this.props.trun].name}的回合`}
                        fontSize={fontSize}
                        fill='white'></Text>
                {players}
                <Text></Text>
            </LinearLayout>
        )
    }

    refDom: any
    width: number = 0
    height: number = 0
}

export default PlayerList