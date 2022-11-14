import React, { Fragment } from 'react';
import { Text, } from 'react-konva';
import { socket } from '../../communication/connection';
import GamePage, { LocalPlayer } from '../GamePage';
import CardContainer from './CardContainer';
import CardShowcase from './CardShowcase';
import Center from './Center';
import KButton from './KButton';
import LinearLayout from './LinearLayout';

interface TopTitleProps {
    x?: number
    y?: number
    stage: number
    otherTip?: string
    canJump?: boolean
    isInRecast: boolean,
    clearState: () => void
}


class TopTitle extends React.Component<TopTitleProps> {
    constructor(props) {
        super(props)
    }


    render(): React.ReactNode {

        let tip: string;
        let fontSize: number = Math.min(20,window.innerWidth/25)

        if (this.props.isInRecast) {
            tip = '   当前是你的重铸回合, 请重铸卡牌或者跳过   '
        }
        else {
            if (this.props.stage) {
                tip = '   当前是你的主要回合, 请进行主要行动或者跳过   '
            }
            else {
                tip = '   当前是你的迅捷回合, 请进行迅捷行动或者跳过   '
            }
        }
        /*
        reff={(e) => { this.refDom = e }}
        {...this.props}
        orientation='vertical'
        xAlign='center'
        padding={padding}
        shadow={true}
        background='#000000'
        opacity={0.3}
        */
        return (
            <Center
                x = {window.innerWidth/2}
                Type={LinearLayout}
                yCenter={false}
                typeProps={{
                    orientation: 'vertical',
                    xAlign: 'center',
                    padding: 10,
                    shadow: true,
                    background: '#88bb88',
                    stroke:'#669966',
                    strokeWidth: 4,
                    opacity: 0.9,
                }}
                {...this.props}
            >
                <Text></Text>
                <Text
                    Type={Text}
                    text={tip}
                    fontSize={fontSize}
                    fill={'white'}></Text>

                <KButton
                    text='跳过'
                    width={70}
                    height={40}
                    background={"#9acd32"}
                    fontColor={"#f7f7f7"}
                    opacity={0.8}
                    onClick={() => {
                        this.props.clearState()
                        GamePage.instance.setState({canSkip:false})
                        console.log("Skip");
                        socket.emit('resolve-signal', { type: 'none', val: null })
                        if (this.props.isInRecast) {
                            GamePage.instance.setInRecast(false)
                        }
                    }}
                >
                </KButton>

                <Text></Text>
            </Center>
        )
    }

}

export default TopTitle