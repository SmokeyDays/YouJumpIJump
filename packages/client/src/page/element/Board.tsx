import React from 'react';
import { Text, Line, Group, Circle } from 'react-konva';
import Center from './Center';
import { Player } from '../../regulates/Interfaces';
import PlayerList from './PlayerList';

const dx = Math.cos(Math.PI / 3);
const dy = Math.sin(Math.PI / 3);

type SlotProps = typeof Slot.defaultProps & {
  radius?: number;
  color?: string;
  strokeWidth?: number;
  stroke?: string;
  x?: number;
  y?: number;
  index?: number;
}

export class Slot extends React.Component<SlotProps> {

  static defaultProps = {
    radius: 30,
    color: 'DarkCyan',
    strokeWidth: 5,
    stroke: '#293047',
    x: 0,
    y: 0,
    index: 0
  }

  points: Array<number> = new Array<number>;
  constructor(props: any) {
    super(props)

    for (let i = Math.PI / 6; i < 2 * Math.PI; i += Math.PI / 3) {
      this.points.push(Math.cos(i) * props.radius, Math.sin(i) * props.radius);
    }
  }

  render(): React.ReactNode {
    return (
      <Group>
        <Line
          points={this.points}
          closed={true}
          fill={this.props.color}
          stroke={this.props.stroke}
          strokeWidth={this.props.strokeWidth}
          x={this.props.x}
          y={this.props.y}
        />
        <Center
          Type={Text}
          text={(this.props.index as number).toString()}
          fontSize={this.props.radius}
          x={this.props.x}
          y={this.props.y}
          fill={'#1b315e'}>

        </Center>
      </Group>
    );
  }
};

interface BoardProps {
  boardInfo: BoardInfo,
  accessSlotList: string[],
  playerState: Player[],
}

interface BoardState {
  scale: number,
}
export class Board extends React.Component<BoardProps, BoardState> {

  //放大棋盘
  setScale(scale: number) {
    this.setState({ scale: scale });
  }

  constructor(props: BoardProps) {
    super(props);
    this.setScale = this.setScale.bind(this);
    this.state = {
      scale: 1,
    }
  }

  componentDidMount() {
  }



  render(): React.ReactNode {

    let info = this.props.boardInfo;
    console.log(this.props.accessSlotList)
    let slots = info.slotInfos.map((value, index) => {
      return (
        <Slot
          {...info.slotTemplate.props}
          x={value.x}
          y={value.y}
          index={index}
          key={index}
          color={value.isBroken ? info.brokeColor : info.slotTemplate.props.color}
          stroke={this.props.accessSlotList.indexOf(`${value.ix},${value.iy}`) == -1 ? info.slotTemplate.props.stroke : info.accessColor}
        >
        </Slot>

      )
    });

    let players = this.props.playerState.map((value, index) => {
      if (value.position)
        return (
          <Group
            x={info.slotInfos[info.slotMap[`${value.position[1]},${value.position[2]}`]].x}
            y={info.slotInfos[info.slotMap[`${value.position[1]},${value.position[2]}`]].y}>

            {value.magician &&
              <Circle
                fill='#dec674'
                radius={info.slotTemplate.props.radius * 0.8}
              >
              </Circle>
            }
            <Circle
              fill={index < PlayerList.colorList.length ? PlayerList.colorList[index] : 'grey'}
              radius={info.slotTemplate.props.radius * 0.7}
            >
            </Circle>
            <Center
              Type={Text}
              text={value.name.slice(0, Math.min(6, value.name.length))}
              fontSize={info.slotTemplate.props.radius / 2}
            ></Center>
            <Center
              Type={Text}
              text={value.prayer > 0 ? value.prayer : null}
              fontSize={info.slotTemplate.props.radius / 2}
              y={-info.slotTemplate.props.radius / 2}
              fill="#9b95c9"
            ></Center>
          </Group>
        )
    })

    return (
      <Group
        scaleX={this.state.scale}
        scaleY={this.state.scale}
      >
        {slots}
        {players}
      </Group>
    )
  }

}

export class BoardInfo {
  constructor(radius = 3, brokeColor = 'white',
    accessColor = 'green', slotTemplate = <Slot></Slot>,) {
    this.radius = radius
    this.accessColor = accessColor
    this.brokeColor = brokeColor
    this.slotTemplate = slotTemplate
    this.initSlotInfos()

  }

  //
  setSlotStatus(ix: number, iy: number, isBroken: boolean) {
    this.slotInfos[this.slotMap[`${ix},${iy}`]].isBroken = isBroken;
  }

  initSlotInfos() {
    this.slotInfos = []
    this.slotInfos[0] = { x: 0, y: 0, ix: 0, iy: 0, isBroken: false };
    this.slotMap['0,0'] = 0

    let cnt = 1;
    const radius = this.slotTemplate.props.radius;
    for (let i = 1; i < this.radius; i++) {
      let xx = 2 * radius * i, yy = 0;
      let ix = i, iy = 0;
      for (let d = 0; d < 6; d++) {
        for (let j = 0; j < i; j++) {
          this.slotInfos[cnt] = {
            x: xx,
            y: yy,
            ix: ix,
            iy: iy,
            isBroken: false,
          }
          this.slotMap[`${ix},${iy}`] = cnt;
          cnt++;
          ix += BoardInfo.directions[d][0];
          iy += BoardInfo.directions[d][1];
          xx += BoardInfo.directions[d][2] * 2 * radius;
          yy += BoardInfo.directions[d][3] * 2 * radius;
        }
      }
    }
  }

  radius: number
  brokeColor: string
  accessColor: string
  slotTemplate: React.ReactElement

  slotInfos: {
    x: number,
    y: number,
    ix: number,
    iy: number,
    isBroken: boolean,
  }[] = [];

  slotMap: {
    [key: string]: number
  } = {}

  static directions: number[][] = [
    [0, 1, -dx, -dy],
    [-1, 0, -1, 0],
    [-1, -1, -dx, dy],
    [0, -1, dx, dy],
    [1, 0, 1, 0],
    [1, 1, dx, -dy],
  ]
}