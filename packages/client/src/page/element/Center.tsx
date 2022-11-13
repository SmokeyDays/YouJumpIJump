import { type } from "os"
import React from "react"

type CenterProps = typeof Center.defaultProps & {
    Type: any,
    xCenter?: boolean,
    yCenter?: boolean,
    typeProps?: any,
    x?: number,
    y?: number
} 

class Center extends React.Component<CenterProps ,{ width: number, height: number }> {

    static defaultProps = {
        Type: null,
        xCenter: true,
        yCenter: true,
        typeProps: {},
    } 

    constructor(props) {
        super(props)
        this.refDom = React.createRef()
        this.state = {
            width: 0,
            height: 0
        }
    }

    componentDidMount(): void{
        try{
        if(typeof this.refDom.current.width == 'number') {
            [this.width,this.height]=[this.refDom.current.width,this.refDom.current.height]
        }
        else {
            
            [this.width,this.height]=[this.refDom.current.width(),this.refDom.current.height()]
        }
        this.setState({ width: this.width, height: this.height})
        }
        catch(e){
            console.log('!',this.refDom.current)
        }
    }

    render(): React.ReactNode {
        return (
            <this.props.Type
                ref={this.refDom}
                {...this.props}
                {...this.props.typeProps}
                offsetX={this.props.xCenter ? this.state.width / 2 : 0}
                offsetY={this.props.yCenter ? this.state.height / 2:0}
            >

            </this.props.Type>
        )
    }

    refDom: any
    width: number
    height: number
}

export default Center