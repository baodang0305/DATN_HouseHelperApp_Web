import React from 'react';
import { Radio } from 'antd';

import './AvatarsDefault.css';
import { colors } from '../../../constants/colors';

class AvatarsDefault extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        return (
            <Radio.Group
                onChange={(e) => this.props.onChange(e.target.value)}
                className="avatars-default-container"
            >
                <Radio.Button value="camera" className="avatar camera-avatar">
                    <i className="fa fa-camera" aria-hidden="true" />
                </Radio.Button>
                <Radio.Button value={colors.red} className="avatar red-avatar" style={{ backgroundColor: colors.red }}></Radio.Button>
                <Radio.Button value={colors.yellow} className="avatar yellow-avatar" style={{ backgroundColor: colors.yellow }}></Radio.Button>
                <Radio.Button value={colors.orange} className="avatar orange-avatar" style={{ backgroundColor: colors.orange }}></Radio.Button>
                <Radio.Button value={colors.purple} className="avatar purple-avatar" style={{ backgroundColor: colors.purple }}></Radio.Button>
                <Radio.Button value={colors.blue} className="avatar blue-avatar" style={{ backgroundColor: colors.blue }}></Radio.Button>
                <Radio.Button value={colors.green} className="avatar green-avatar" style={{ backgroundColor: colors.green }}></Radio.Button>
            </Radio.Group>
        )
    }
}

export default AvatarsDefault;