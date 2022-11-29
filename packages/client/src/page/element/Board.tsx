import React from 'react';
import { Text, Line, Group, Circle, Image as KImage } from 'react-konva';
import Center from './Center';
import { Player } from '../../regulates/Interfaces';
import PlayerList from './PlayerList';
import { socket } from '../../communication/connection';
import GamePage, { CurrentBoard } from '../GamePage';
import CardShowcase from './CardShowcase';
import KButton from './KButton';
import BrokenImg from '../../assets/images/broken.png'

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
  willBroken?: boolean;
  onClick?: () => void;
}
export class Slot extends React.Component<SlotProps> {

  static defaultProps = {
    radius: 30,
    color: 'DarkCyan',
    strokeWidth: 5,
    stroke: '#293047',
    x: 0,
    y: 0,
    index: 0,
    willBroken: false,
    onClick: () => { }
  }

  brokenImg: HTMLImageElement;
  points: Array<number> = new Array<number>;
  constructor(props: any) {
    super(props)

    for (let i = Math.PI / 6; i < 2 * Math.PI; i += Math.PI / 3) {
      this.points.push(Math.cos(i) * props.radius, Math.sin(i) * props.radius);
    }

    this.brokenImg = new Image();
    this.brokenImg.src = BrokenImg;
  }

  render(): React.ReactNode {
    return (
      <Group
        onClick={() => this.props.onClick()}
        onTap={() => this.props.onClick()}
      >
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
          typeProps={{

            text: (this.props.index as number).toString(),
            fontSize: this.props.radius * 0.6,
            fill: '#1b315e'
          }}
          x={this.props.x}
          y={this.props.y}>

        </Center>
        {this.props.willBroken &&
          <Center
            Type={KImage}
            typeProps={{

              height: 2 * this.props.radius,
              width: 2 * this.props.radius,
              image: this.brokenImg,
            }}
            x={this.props.x}
            y={this.props.y}
          >

          </Center>
        }

      </Group>
    );
  }
};

interface BoardProps {
  boardInfo: BoardInfo,
  accessSlotList: string[],
  freSlotList: string[],
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
    this.onSlotClick = this.onSlotClick.bind(this)
  }

  componentDidMount() {
  }

  onSlotClick(value) {
    console.log("slot is clicked", value.ix, value.iy, value.isBroken)
    if (this.props.accessSlotList.indexOf(`${value.ix},${value.iy}`) != -1) {
      socket.emit('resolve-signal', {
        type: "move",
        val: [CurrentBoard, value.ix, value.iy]
      })
      console.log("emit", "move", [CurrentBoard, value.ix, value.iy])
      GamePage.instance.setAccessSlotList([])
    }
  }

  render(): React.ReactNode {

    let info = this.props.boardInfo;
    let slots = info.slotInfos.map((value, index) => {
      return (
        value.isBroken ? null :
          <Slot
            {...info.slotTemplate.props}
            x={value.x}
            y={value.y}
            index={index}
            key={index}
            color={KButton.changeColorByNum(info.slotTemplate.props.color, value.dis * 40, value.dis * 40, value.dis * 40)}
            stroke={this.props.freSlotList.indexOf(`${value.ix},${value.iy}`) != -1 ? 'orange' : this.props.accessSlotList.indexOf(`${value.ix},${value.iy}`) == -1 ? info.slotTemplate.props.stroke : info.accessColor}
            willBroken={this.props.boardInfo.willBrokenSlotList.indexOf(`${value.ix},${value.iy}`) != -1}
            onClick={
              () => this.onSlotClick(value)
            }
          >
          </Slot>

      )
    });

    let playerCount: { [key: string]: [number, number] } = {}
    for (let value of this.props.playerState) {
      if (!value.alive || value.position[0] != CurrentBoard) continue;
      if (playerCount[`${value.position[1]},${value.position[2]}`] != null) {
        playerCount[`${value.position[1]},${value.position[2]}`][0]++;
      }
      else {
        playerCount[`${value.position[1]},${value.position[2]}`] = [1, 0];
      }
    }
    let players = []

    this.props.playerState.forEach((value, index) => {
      if (value.position && value.alive && value.position[0] == CurrentBoard) {
        let pos = `${value.position[1]},${value.position[2]}`
        let radius = info.slotTemplate.props.radius * 0.9 / playerCount[pos][0]
        let mid = playerCount[pos][0] / 2
        playerCount[pos][1]++;
        let offetX = 2 * radius * (playerCount[pos][1] - mid) - radius
        let slot = info.slotInfos[info.slotMap[pos]]

        players.push(
          <Group
            key={value.name[0]}
            x={offetX + slot.x}
            y={slot.y}
            onClick={
              () => {
                this.onSlotClick(slot)
              }
            }
          >

            {value.magician &&
              <Circle
                fill='#dec674'
                radius={radius}
              >
              </Circle>
            }
            <Circle
              fill={index < PlayerList.colorList.length ? PlayerList.colorList[index] : 'grey'}
              radius={radius * 0.9}
            >
            </Circle>
            <Center
              Type={Text}
              typeProps={
                {

                  text: value.name[0],
                  fontSize: radius
                }
              }
            ></Center>
            <Center
              Type={Text}
              typeProps={{

                text: value.prayer > 0 ? value.prayer : null,
                fontSize: radius * 0.8,
                fill: "#9b95c9"
              }}
              y={-radius / 2}
            ></Center>
          </Group>
        )
      }
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

  addWillBrokenSlot(list: string[]) {
    this.willBrokenSlotList=this.willBrokenSlotList.concat(list)
  }

  //
  setSlotStatus(ix: number, iy: number, isBroken: boolean) {
    let index = this.slotMap[`${ix},${iy}`]
    if (index != null) {
      this.slotInfos[this.slotMap[`${ix},${iy}`]].isBroken = isBroken;
    }
  }

  initSlotInfos() {
    this.slotInfos = []
    this.slotInfos[0] = { x: 0, y: 0, ix: 0, iy: 0, isBroken: false, dis: 0 };
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
            dis: i
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
  willBrokenSlotList: string[] = []

  slotInfos: {
    x: number,
    y: number,
    ix: number,
    iy: number,
    isBroken: boolean,
    dis: number,
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