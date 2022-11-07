import React from 'react';
import { Text, Line, Group, Circle } from 'react-konva';
import Center from './Center';
import { Player } from '../../regulates/Interfaces';
import PlayerList from './PlayerList';
import { socket } from '../../communication/connection';
import { CurrentBoard } from '../GamePage';

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
    onClick: ()=>{}
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
      <Group
        onClick={()=>this.props.onClick()}
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
          typeProps = {{
            
          text: (this.props.index as number).toString(),
          fontSize: this.props.radius,
          fill: '#1b315e'
          }}
          x={this.props.x}
          y={this.props.y}>

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
          onClick={
            ()=>{
              if(this.props.accessSlotList.indexOf(`${value.ix},${value.iy}`) != -1) {
                socket.emit('resolve-signal',{
                  type: "move", 
                  val: [CurrentBoard,value.x,value.y]
                })
                console.log("emit","move",[CurrentBoard,value.x,value.y])
              }
            }
          }
        >
        </Slot>

      )
    });

    let playerCount: {[key:string]:[number,number]} ={}
    console.log("***",this.props.playerState)
    for( let value of this.props.playerState) {
      if(!value.alive||value.position[0]!=CurrentBoard) continue;
      if( playerCount[`${value.position[1]},${value.position[2]}`] != null) {
        playerCount[`${value.position[1]},${value.position[2]}`][0] ++;
      }
      else {
        playerCount[`${value.position[1]},${value.position[2]}`] =[1,0];
      }
    }
    let players = []

    this.props.playerState.forEach((value, index) => {
      if (value.position&&value.alive&&value.position[0]==CurrentBoard)
      {
        let pos = `${value.position[1]},${value.position[2]}`
        let radius = info.slotTemplate.props.radius * 0.9 / playerCount[pos][0]
        let mid = playerCount[pos][0]/2
        playerCount[pos][1]++;
        let offetX = 2 * radius * (playerCount[pos][1]-mid) - radius
        console.log("index",index, offetX,(playerCount[pos][1]-mid), radius)
        
        players.push(
          <Group
            x={offetX + info.slotInfos[info.slotMap[pos]].x}
            y={info.slotInfos[info.slotMap[pos]].y}>

            {value.magician &&
              <Circle
                fill='#dec674'
                radius={radius }
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
              typeProps = {
                {
                  
              text: value.name[0],
              fontSize: radius 
                }
              }
            ></Center>
            <Center
              Type={Text}
              typeProps = {{

                text: value.prayer > 0 ? value.prayer : null,
                fontSize: radius / 2,
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

  //
  setSlotStatus(ix: number, iy: number, isBroken: boolean) {
    let index = this.slotMap[`${ix},${iy}`]
    if(index != null) {
      this.slotInfos[this.slotMap[`${ix},${iy}`]].isBroken = isBroken;
    }
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