import React from 'react';
import {Text, Line, Group} from 'react-konva';

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

interface SlotState {
  color?: string;
}

export class Slot extends React.Component<SlotProps, SlotState> {

  static defaultProps = {
    radius: 30,
    color: 'blue',
    strokeWidth: 5,
    stroke: 'black',
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
        <Text
          text={(this.props.index as number).toString()}
          fontSize={this.props.radius}
          x={this.props.x}
          y={this.props.y}
        >
        </Text>
      </Group>
    );
  }
};

type BoardProps = typeof Board.defaultProps & {
  radius?: number,
  x?: number,
  y?: number,
  brokeColor?: string,
  slotTemplate?: Slot
}

interface BoardState {
  scale?: number
}
class Board extends React.Component<BoardProps, BoardState> {

  //设置格子是否破碎
  setSlot(ix: number, iy: number, isBroken: boolean) {
    this.slotMap[`${ix},${iy}`] = !this.slotMap[`${ix},${iy}`];
    this.setState({});
  }

  //放大棋盘
  setScale(scale: number) {
    this.setState({ scale: scale });
  }

  constructor(props: BoardProps) {
    super(props);

    this.setSlot = this.setSlot.bind(this);
    this.setScale = this.setScale.bind(this);

    this.state = {
      scale: 1
    }

    this.slotInfos[0] = { x: props.x, y: props.y, ix: 0, iy: 0 };
    this.slotMap['0,0'] = false;

    let cnt = 1;
    const radius = props.slotTemplate.props.radius;
    for (let i = 1; i < props.radius; i++) {
      let xx = props.x + 2 * radius * i, yy = props.y;
      let ix = i, iy = 0;
      for (let d = 0; d < 6; d++) {
        for (let j = 0; j < i; j++) {
          this.slotInfos[cnt] = {
            x: xx,
            y: yy,
            ix: ix,
            iy: iy
          }
          this.slotMap[`${ix},${iy}`] = false;
          cnt++;
          ix += Board.directions[d][0];
          iy += Board.directions[d][1];
          xx += Board.directions[d][2] * 2 * radius;
          yy += Board.directions[d][3] * 2 * radius;
        }
      }
    }
  }

  componentDidMount() {
    this.setState({})
  }

  render(): React.ReactNode {

    let slots = this.slotInfos.map((value, index) => {
      return (
        <Slot
          x={value.x}
          y={value.y}
          index={index}
          color={this.slotMap[`${value.ix},${value.iy}`] ? this.props.brokeColor : this.props.slotTemplate.props.color}
          radius={this.props.slotTemplate.props.radius}></Slot>
      )
    });

    return (
      <Group ref={dom => this.panelDom = dom}
        
        onClick={()=>this.setScale(2)}
        scaleX={this.state.scale}
        scaleY={this.state.scale}
        width={200}
        height={200}
        offsetX={100}
        offsetY={100}
        >
          {slots}
        </Group>
    )
  }

  static defaultProps = {
    radius: 4,
    x: 500,
    y: 300,
    brokeColor: 'white',
    slotTemplate: (<Slot></Slot>) as unknown as Slot
  }

  static directions: number[][] = [
    [0, 1, -dx, -dy],
    [-1, 0, -1, 0],
    [-1, -1, -dx, dy],
    [0, -1, dx, dy],
    [1, 0, 1, 0],
    [1, 1, dx, -dy],
  ]

  slotInfos: {
    x: number,
    y: number,
    ix: number,
    iy: number
  }[] = [];

  slotMap: {
    [key: string]: boolean
  } = {}

  panelDom: any;
  width = 0;
  height = 0;
}

export default Board