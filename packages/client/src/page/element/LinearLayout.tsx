import React from 'react';
import { Group, Text, Image as KImage, Rect } from 'react-konva';
import { threadId } from 'worker_threads';

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
        this.refDom = React.createRef()
    }

    componentDidMount(): void {
        if (typeof this.refDom.current.width == 'number') {
            this.props.transmitToParent(this.width = this.refDom.current.width, this.height = this.refDom.current.height)
        } else {
            this.props.transmitToParent(this.width = this.refDom.current.width(), this.height = this.refDom.current.height())
        }
    }

    adject() {

    }

    render(): React.ReactNode {
        let element: React.ReactNode
        if (typeof this.props.Type == 'string') {
            switch (this.props.Type) {
                case 'Text':
                    element = <Text ref={this.refDom} {...this.props}>{this.props.children}</Text>
                    break;
                case 'Image':
                    element = <KImage image={null} ref={this.refDom} {...this.props}>{this.props.children}</KImage>
                    break;
                case 'Rect':
                    element = <Rect ref={this.refDom} {...this.props}>{this.props.children}</Rect>
                    break;
                default: element = <Text ref={this.refDom} fontSize={40} text="未记录此类型"></Text>
            }
        }
        else {
            element = <this.props.Type ref={this.refDom} {...this.props}>{this.props.children}</this.props.Type>
        }
        return element;
    }
}

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
    align?: 'left' | 'center' | 'right'
}

class LinearLayout extends React.Component<LinearLayoutProps, {}> {

    constructor(props) {
        super(props)
        this.getChildInfo = this.getChildInfo.bind(this)
        this.restChildren = React.Children.count(this.props.children)
        this.whInfos = new Array(this.restChildren)
        this.cwidth = this.cheight = 0
    }

    componentDidMount(): void {

    }

    getChildInfo(index: number, width: number, height: number) {
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
            if(this.props.orientation=='horizontal') {
                this.cwidth-=this.props.padding
            }
            else {
                this.cheight-=this.props.padding
            }
            this.width = Math.max(this.props.width, this.cwidth)
            this.height = Math.max(this.props.height, this.cheight)
            this.setState({})
        }
    }

    getSuitableX(accumulate: number, width: number) {

        if (this.props.orientation == 'horizontal') {
            switch (this.props.align) {
                case 'left':
                    return accumulate;
                case 'center':
                    return (this.width - this.cwidth) / 2 + accumulate
                case 'right':
                    return this.width - this.cwidth + accumulate
            }
        }
        else {
            switch (this.props.align) {
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
        let array: any[] = React.Children.toArray(this.props.children)
        let newChildren
        let bg: any = null

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
                            x={this.getSuitableX(nowX,0)}
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
                            y={nowY}
                            x={this.getSuitableX(0, this.whInfos[index].w)}
                        >
                            {value.props.children}
                        </LayoutElement>
                    )
                })
            }

            if (this.props.background != null) {
                if (this.props.background.includes("/")) {
                    let bgimg = new Image()
                    bgimg.src = this.props.background
                    bg = <KImage
                        width={this.width}
                        height={this.height}
                        image={bgimg}
                    ></KImage>

                } else {
                    bg = <Rect
                        width={this.width}
                        height={this.height}
                        fill={this.props.background}
                    ></Rect>
                }
            }
        }
        return (
            <Group
                x={this.props.x}
                y={this.props.y}
                offsetX={this.props.offsetX}
                offsetY={this.props.offsetY}>
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
        align: 'left',
    }

    restChildren: number
    whInfos: { w: number, h: number }[]
    width: number
    height: number
    cwidth: number
    cheight: number

}

export default LinearLayout