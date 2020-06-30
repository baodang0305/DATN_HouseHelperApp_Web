import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import "./Loading.css";

const Loading = () => {

    return (
        <div className="loading-container">
            <Spin
                style={{ color: 'white' }}
                size="large"
                indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </div>
    )
}

export default Loading;