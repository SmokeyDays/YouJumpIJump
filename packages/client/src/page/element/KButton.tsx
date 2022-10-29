import React from "react";
import { Text, Image as KImage } from 'react-konva'
import LinearLayout from "./LinearLayout";

type KButtonProps = typeof KButton.defaultProps & {
    x: number,
    y: number,
    width: number,
    height: number,
    onClick?: any,
    text?: string,
    background?: string,
    clickBackground?: string,
    disabledBackground?: string,
    fontSize?: number,
    fontColor?: string,

}

interface KButtonState {
    isEnable: boolean
    background: string
}

class KButton extends React.Component<KButtonProps, KButtonState> {

    static defaultProps = {
        x: 0,
        y: 0,
        width: 100,
        height: 60,
        onClick: null,
        onselect: null,
        text: "",
        background: "#0000ff",
        clickBackground: null,
        disabledBackground: null,
        fontSize: 20,
        fontColor: 'black'
    }

    constructor(props) {
        super(props);
        this.width = this.props.width
        this.height = this.props.height
        this.background = this.props.background
        if (this.background.search('/') == -1) {
            this.clickBackground = KButton.changeColor(this.background, "#111111",true);
            this.disabledBackground = KButton.changeColor(this.background, "#222222",true);
        }
        else {
            this.clickBackground = this.props.clickBackground
            this.disabledBackground = this.props.disabledBackground
        }
        this.state = {
            isEnable: true,
            background: this.background
        };
    }

    render(): React.ReactNode {
        return (
            <LinearLayout
                onMouseDown={() => { this.clickBackground && this.setState({ background: this.clickBackground }) }}
                onMouseUp={() => { this.setState({ background: this.background }) }}
                onMouseLeave={() => { this.background != this.state.background && this.setState({ background: this.background }) }}
                xAlign="center"
                yAlign="middle"
                {...this.props}
                background={this.state.background}
            >
                <Text text={this.props.text} fontSize={this.props.fontSize} fill={this.props.fontColor}></Text>
            </LinearLayout>
        )
    }

    static changeColor(rgb: string, addRgb: string, minus: boolean = false): string {
        let rExb1: RegExp = /#([\da-f]{2})([\da-f]{2})([\da-f]{2})/g //?
        let rExb2: RegExp = /#([\da-f]{2})([\da-f]{2})([\da-f]{2})/g //?
        let x = rExb1.exec(rgb)
        let y = rExb2.exec(addRgb)
        if (x && y) {
            let r, g, b: number;
            if (minus) {
                r = Math.max(0, parseInt(x[1], 16) - parseInt(y[1], 16))
                g = Math.max(0, parseInt(x[2], 16) - parseInt(y[2], 16))
                b = Math.max(0, parseInt(x[3], 16) - parseInt(y[3], 16))
            }
            else {

                r = Math.min(255, parseInt(x[1], 16) + parseInt(y[1], 16))
                g = Math.min(255, parseInt(x[2], 16) + parseInt(y[2], 16))
                b = Math.min(255, parseInt(x[3], 16) + parseInt(y[3], 16))
            }
            let result = '#' + (r+256).toString(16).slice(1,3) + (g+256).toString(16).slice(1,3) + (b+256).toString(16).slice(1,3);
            return result
        }
        return null;
    }

    width: number
    height: number
    background: string
    clickBackground: string
    disabledBackground: string
}

export default KButton