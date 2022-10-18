import { type } from "os"
import React from "react"

interface CenterProps {
    Type: any
} 

class Center extends React.Component<any,{ width: number, height: number }> {
    constructor(props) {
        super(props)
        this.refDom = React.createRef()
        this.state = {
            width: 0,
            height: 0
        }
    }

    componentDidMount(): void{
        if (this.state.width != this.refDom.current.width() || this.state.height != this.refDom.current.height()) {
            this.setState({ width: this.refDom.current.width(), height: this.refDom.current.height()})
        }

    }

    render(): React.ReactNode {
        return (
            <this.props.Type
                ref={this.refDom}
                offsetX={this.state.width / 2}
                offsetY={this.state.height / 2}
                {...this.props}
            >

            </this.props.Type>
        )
    }

    refDom
}

export default Center