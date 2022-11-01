import { type } from "os"
import React from "react"

interface CenterProps {
    Type: any
} 

class Center extends React.Component<any ,{ width: number, height: number }> {
    constructor(props) {
        super(props)
        this.refDom = React.createRef()
        this.state = {
            width: 0,
            height: 0
        }
    }

    componentDidMount(): void{
        if(typeof this.refDom.current.width == 'number') {
            [this.width,this.height]=[this.refDom.current.width,this.refDom.current.height]
        }
        else {
            
            [this.width,this.height]=[this.refDom.current.width(),this.refDom.current.height()]
        }
        this.setState({ width: this.width, height: this.height})

    }

    render(): React.ReactNode {
       // console.log(this.props.text, this.state.width)
        return (
            <this.props.Type
                ref={this.refDom}
                {...this.props}
                offsetX={this.state.width / 2}
                offsetY={this.state.height / 2}
            >

            </this.props.Type>
        )
    }

    refDom: any
    width: number
    height: number
}

export default Center