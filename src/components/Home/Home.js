import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, Menu, Button } from "antd";
import { DownOutlined } from '@ant-design/icons';

import "./home.css";
import "antd/dist/antd.css";

export default class Home extends Component {
  render() {
    return (
      <div className="landing-landing">
        <header className="landing-header">
          <div className="logo">
            <img src=""></img>
          </div>
          <div className="landing-header__menu-list">
            <div className="landing-header__menu-item">Góp ý</div>
            <div className="landing-header__menu-item">Liên hệ</div>
            <div className="landing-header__menu-item">Tính năng</div>
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="android-landing">
                    Tải bản Android - CH Play
                </Menu.Item>
                  <Menu.Item key="ios-landing">Tải bản IOS - App Store</Menu.Item>
                </Menu>
              }
            >
              <div className="landing-header__menu-item">
                Mobile app
              <DownOutlined />
              </div>
            </Dropdown>
            <div className="landing-header__menu-item">Web app</div>
            <div className="landing-header__menu-item-separate"></div>
            <div className="landing-header__menu-item"><Link to="/login">Đăng nhập</Link></div>
            <div className="landing-header__menu-item"> <Link to="/create-family">Đăng ký</Link></div>
          </div>
        </header>
        <div className="landing-body">
          {/* Banner */}
          <div className="grid">
            <div className="landing-body__banner">
              <div className="landing-body__banner-intro">
                <h1 className="banner-main-title">
                  Trợ lý ảo gia đình{' '}
                  <span style={{ color: '#40A9FF' }}>SMART</span>
                FAMILY
              </h1>
                <h3 className="banner-second-title">
                  Ứng dụng trợ giúp việc gia đình giúp bạn tiết kiệm thời gian tổ
                  chức và quản lý một cách hiệu quả công việc của gia đình.
              </h3>
                <div className="banner-buttons">
                  <Button
                    size="large"
                    type="primary"
                    className="banner-button-item"
                  >
                    <Link to="/create-family" style={{ fontWeight: 500 }}>Đăng ký ngay!</Link>
                  </Button>
                </div>
              </div>
              <div className="landing-body__banner-image"></div>
            </div>
          </div>
          {/* End banner */}

          <div className="landing-body__features-container">
            <div className="landing-body__special-features">
              {/* sf - special - feature */}
              <div className="landing-body__sf-image"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
