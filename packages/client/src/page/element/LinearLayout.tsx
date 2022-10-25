import React from 'react';
import { Group, Text } from 'react-konva';

interface LayoutElementProps {
    transmitToParent: any
    Type: any
}

export class LayoutElement extends React.Component<any> {
    refDom: any
    constructor(props) {
        super(props)
        this.refDom = React.createRef()
    }

    componentDidMount(): void {
        this.props.transmitToParent(this.refDom.current.width(), this.refDom.current.height())
    }

    adject() {

    }

    render(): React.ReactNode {
        let element: React.ReactNode
        switch (this.props.Type) {
            case 'Text':
                element = <Text ref={this.refDom} {...this.props} fontSize={30}>{this.props.children}</Text>
                break;
            default: element = <Text ref={this.refDom} fontSize={30} text="未记录此类型"></Text>
        }
        return element;
    }
}

type LinearLayoutProps = typeof LinearLayout.defaultProps & {
    x?: number,
    y?: number,
    padding?: number,
    orientation?: "horizontal" | "vertical"
}

export class LinearLayout extends React.Component<LinearLayoutProps> {

    constructor(props) {
        super(props)
        this.getChildInfo = this.getChildInfo.bind(this)
        this.restChildren = React.Children.count(this.props.children)
        this.whInfos = new Array(this.restChildren)
    }

    componentDidMount(): void {

    }

    getChildInfo(index: number, width: number, height: number) {
        console.log(index, width, height)
        this.whInfos[index] = this.props.orientation=="horizontal" ? width:height
        this.restChildren--;
        if (this.restChildren == 0) {
            this.setState({})
        }
    }

    render(): React.ReactNode {
        let array: any[] = React.Children.toArray(this.props.children)
        let newChildren

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
            if (this.props.orientation == "horizontal") {

                let x = this.props.x;
                newChildren = array.map((value, index) => {
                    let nowX = x
                    x += this.whInfos[index] + this.props.padding
                    return (
                        <LayoutElement x={nowX} y={this.props.y} Type={value.type} transmitToParent={(w, h) => this.getChildInfo(index, w, h)} {...value.props}
                        >
                            {value.props.children}
                        </LayoutElement>
                    )
                })
            }
            else {
                let y = this.props.y;
                newChildren = array.map((value, index) => {
                    let nowY = y;
                    y += this.whInfos[index] + this.props.padding
                    return (
                        <LayoutElement x={this.props.x} y={nowY} Type={value.type} transmitToParent={(w, h) => this.getChildInfo(index, w, h)} {...value.props}
                        >
                            {value.props.children}
                        </LayoutElement>
                    )
                })
            }
        }
        return (
            <Group>
                {newChildren}
            </Group>
        )
    }

    static defaultProps = {
        x: 0,
        y: 0,
        padding: 0,
        orientation: "horizontal"
    }

    restChildren: number
    whInfos: number[]

}
