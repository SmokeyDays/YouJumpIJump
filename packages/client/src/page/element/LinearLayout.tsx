import React from 'react';
import { Group, Text, Image as KImage, Rect, Label } from 'react-konva';

interface LayoutElementProps {
    transmitToParent: any
    Type: any
}

class LayoutElement extends React.Component<any> {
    refDom: any
    width: number
    height: number
    constructor(props) {
        super(props)
        this.refDom = null
    }

    componentDidUpdate(): void {
        if (typeof this.refDom.width == 'number') {
            this.props.transmitToParent(this.width = this.refDom.width, this.height = this.refDom.height)
        } else {
            this.props.transmitToParent(this.width = this.refDom.width(), this.height = this.refDom.height())
        }
    }

    componentDidMount(): void {
        if (typeof this.refDom.width == 'number') {
            this.props.transmitToParent(this.width = this.refDom.width, this.height = this.refDom.height)
        } else {
            this.props.transmitToParent(this.width = this.refDom.width(), this.height = this.refDom.height())
        }
    }

    render(): React.ReactNode {
        let element: React.ReactNode
        if (typeof this.props.Type == 'string') {
            switch (this.props.Type) {
                case 'Text':
                    element = <Text {...this.props}
                        ref={e => { this.refDom = e; this.props.ref && this.props.ref(e) }}

                    >{this.props.children}</Text>
                    break;
                case 'Image':
                    element = <KImage image={null} {...this.props}
                        ref={e => { this.refDom = e; this.props.ref && this.props.ref(e) }}

                    >{this.props.children}</KImage>
                    break;
                case 'Rect':
                    element = <Rect {...this.props}
                        ref={e => { this.refDom = e; this.props.ref && this.props.ref(e) }}
                    >{this.props.children}</Rect>
                    break;
                case 'Label':
                    element = <Label {...this.props}
                        ref={e => { this.refDom = e; this.props.ref && this.props.ref(e) }}
                    >{this.props.children}</Label>
                    break;
                default: element = <Text fontSize={40} text="未记录此类型"
                ></Text>
            }
        }
        else {
            if (this.props.parentRef != undefined) {
                element = <this.props.Type {...this.props}
                    ref={e => { this.refDom = e; this.props.ref && this.props.ref(e) }}
                    parentRef={this}
                >{this.props.children}</this.props.Type>
            }
            else {
                element = <this.props.Type {...this.props}
                    ref={e => { this.refDom = e; this.props.ref && this.props.ref(e) }}
                >{this.props.children}</this.props.Type>
            }
        }
        return element;
    }
}

const XAlign = ['left', 'center', 'right'] as const
const YAlign = ['top', 'middle', 'bottom'] as const
type LinearLayoutProps = typeof LinearLayout.defaultProps & {
    x?: number,
    y?: number,
    padding?: number,
    orientation?: "horizontal" | "vertical",
    offsetX?: number,
    offsetY?: number,
    width?: number,
    height?: number,
    background?: string,
    xAlign?: typeof XAlign[number]
    yAlign?: typeof YAlign[number]
    onClick?: any,
    onMouseDown?: any,
    onMouseUp?: any,
    onMouseLeave?: any,
    reff?: any,
    k?: string,
    opacity?: number,
    stroke?: string,
    strokeWidth?: number,
    shadow?: boolean
}

class LinearLayout extends React.Component<LinearLayoutProps, {}> {

    constructor(props) {
        super(props)
        this.getChildInfo = this.getChildInfo.bind(this)
        this.childrenCount = this.restChildren = React.Children.count(this.props.children)
        this.whInfos = new Array(this.restChildren)
        this.cwidth = this.cheight = 0
        this.width = this.height = 0
    }

    componentDidMount(): void {
        this.width = Math.max(this.props.width, this.cwidth)
        this.height = Math.max(this.props.height, this.cheight)
        this.setState({})
    }

    getChildInfo(index: number, width: number, height: number) {

        if (this.restChildren == 0) {

            if (this.whInfos[index].w == width && this.whInfos[index].h == height) return
            if (this.props.orientation == 'horizontal') {
                this.cwidth += width + this.props.padding - this.whInfos[index].w
                this.cheight = Math.max(this.cheight, height)
            }
            else {
                this.cheight += height + this.props.padding - this.whInfos[index].h
                this.cwidth = Math.max(this.cwidth, width)
            }

            this.whInfos[index] = { w: width, h: height }
            this.setState({})
        }
        else {
            this.whInfos[index] = { w: width, h: height }
            this.restChildren--;
            if (this.props.orientation == 'horizontal') {
                this.cwidth += width + this.props.padding
                this.cheight = Math.max(this.cheight, height)
            }
            else {
                this.cheight += height + this.props.padding
                this.cwidth = Math.max(this.cwidth, width)

            }
            if (this.restChildren == 0) {
                if (this.props.orientation == 'horizontal') {
                    this.cwidth -= this.props.padding
                }
                else {
                    this.cheight -= this.props.padding
                }
                this.width = Math.max(this.props.width, this.cwidth)
                this.height = Math.max(this.props.height, this.cheight)
                this.setState({})
            }
        }
    }

    getSuitableY(accumulate: number, height: number) {

        if (this.props.orientation == 'vertical') {
            switch (this.props.yAlign) {
                case 'top':
                    return accumulate;
                case 'middle':
                    return (this.height - this.cheight) / 2 + accumulate
                case 'bottom':
                    return this.height - this.cheight + accumulate
            }
        }
        else {
            switch (this.props.yAlign) {
                case 'top':
                    return 0;
                case 'middle':
                    return (this.height - height) / 2
                case 'bottom':
                    return this.height - height
            }
        }
    }

    getSuitableX(accumulate: number, width: number) {

        if (this.props.orientation == 'horizontal') {
            switch (this.props.xAlign) {
                case 'left':
                    return accumulate;
                case 'center':
                    return (this.width - this.cwidth) / 2 + accumulate
                case 'right':
                    return this.width - this.cwidth + accumulate
            }
        }
        else {
            switch (this.props.xAlign) {
                case 'left':
                    return 0;
                case 'center':
                    return (this.width - width) / 2
                case 'right':
                    return this.width - width
            }
        }
    }

    render(): React.ReactNode {

        if (this.props.reff) {
            this.props.reff(this)
        }
        let array: any[] = React.Children.toArray(this.props.children)
        let newChildren
        let bg: any = null

        if(this.childrenCount!=array.length) {
            this.childrenCount = this.restChildren = array.length;
        }

        if (this.restChildren > 0) {
            newChildren = array.map((value, index) => {
                return (
                    <LayoutElement Type={value.type} transmitToParent={(w, h) => this.getChildInfo(index, w, h)} {...value.props}
                    >
                        {value.props.children}
                    </LayoutElement>
                )
            })
        }
        else {

            this.width = Math.max(this.props.width, this.cwidth)
            this.height = Math.max(this.props.height, this.cheight)
            if (this.props.orientation == "horizontal") {

                let x = 0;
                newChildren = array.map((value, index) => {
                    let nowX = x
                    x += this.whInfos[index].w + this.props.padding
                    return (
                        <LayoutElement Type={value.type} transmitToParent={(w, h) => this.getChildInfo(index, w, h)} {...value.props}
                            x={this.getSuitableX(nowX, 0)}
                            y={this.getSuitableY(0, this.whInfos[index].h)}
                        >
                            {value.props.children}
                        </LayoutElement>
                    )
                })
            }
            else {
                let y = 0;
                newChildren = array.map((value, index) => {
                    let nowY = y;
                    y += this.whInfos[index].h + this.props.padding
                    return (
                        <LayoutElement Type={value.type} transmitToParent={(w, h) => this.getChildInfo(index, w, h)} {...value.props}
                            y={this.getSuitableY(nowY, 0)}
                            x={this.getSuitableX(0, this.whInfos[index].w)}
                        >
                            {value.props.children}
                        </LayoutElement>
                    )
                })
            }

            if (this.props.background != null) {
                let shadowProps = this.props.shadow?
                {
                    shadowColor:'black',
                    shadowBlur:10,
                    shadowOffsetX:5,
                    shadowOffsetY:5,
                    shadowOpacity:0.5,
                }:{}
                if (this.props.background.includes("/")) {
                    let bgimg = new Image()
                    bgimg.src = this.props.background
                    bg = <KImage
                        width={this.width}
                        height={this.height}
                        image={bgimg}
                        opacity={this.props.opacity}
                        stroke={this.props.stroke}
                        strokeWidth={this.props.strokeWidth}
                        {...shadowProps}
                    ></KImage>

                } else {
                    bg = <Rect
                        width={this.width}
                        height={this.height}
                        fill={this.props.background}
                        opacity={this.props.opacity}
                        stroke={this.props.stroke}
                        strokeWidth={this.props.strokeWidth}
                        {...shadowProps}
                    ></Rect>
                }
            }
        }
        return (
            <Group
                {...this.props}
                ref={null}
                x={this.props.x}
                y={this.props.y}
                offsetX={this.props.offsetX}
                offsetY={this.props.offsetY}
                opacity={1}
                stroke={null}
                strokeWidth={0}
                >
                {bg != null && bg}
                {newChildren}
            </Group>
        )
    }

    static defaultProps = {
        x: 0,
        y: 0,
        padding: 0,
        orientation: "horizontal",
        offsetX: 0,
        offsetY: 0,
        width: 0,
        height: 0,
        background: null,
        xAlign: 'left',
        yAlign: 'top',
        reff: null,
        opacity: 1,
        shadow: false
    }

    restChildren: number
    childrenCount: number
    whInfos: { w: number, h: number }[]
    width: number
    height: number
    cwidth: number
    cheight: number

}

export default LinearLayout