import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, Menu, Button, Input } from "antd";
import { CloseOutlined, DownOutlined, ArrowRightOutlined, MenuOutlined } from '@ant-design/icons';

import logoImg from '../../assets/logo.png';
import "./home.css";
import "antd/dist/antd.css";
import ui1 from '../../assets/image-home-page/IMG1.png';
import ui2 from '../../assets/image-home-page/IMG2.png';
import ui3 from '../../assets/image-home-page/IMG3.png';
import ui4 from '../../assets/image-home-page/IMG4.png';
import ui5 from '../../assets/image-home-page/IMG5.png';


export default class Home extends Component {
  state = {
    enableHumberMenu: false,
    idFeatureRecent: 1,
    imgRecent: ui1,
    featureList: [
      { id: 1, feature: 'Quản lý hoạt động gia đình', imgF: ui1 },
      { id: 2, feature: 'Quản lý sự kiện thành viên', imgF: ui2 },
      { id: 3, feature: 'Quản lý công việc gia đình', imgF: ui3 },
      { id: 4, feature: 'Quản lý dánh sách mua sắm', imgF: ui4 },
      { id: 5, feature: 'Hoạt động đổi thưởng', imgF: ui5 },
    ]
  }

  handleClickChangeTitleFeature = (id) => {
    let imgRecent = null;
    switch (id) {
      case 1: {
        imgRecent = ui1;
        break;
      }
      case 2: {
        imgRecent = ui2;
        break;
      }
      case 3: {
        imgRecent = ui3;
        break;
      }
      case 4: {
        imgRecent = ui4;
        break;
      }
      case 5: {
        imgRecent = ui5;
        break;
      }
      default: break;
    }

    this.setState({ idFeatureRecent: id, imgRecent: imgRecent })
  }

  showHamburMenu = () => {
    const { enableHumberMenu } = this.state;
    this.setState({ enableHumberMenu: !enableHumberMenu })
  }
  render() {
    const { enableHumberMenu, featureList, idFeatureRecent, imgRecent } = this.state;
    return (
      <div className="landing-landing">
        <header className="landing-header">
          <div style={{ marginTop: 30 }}>
            <img src={logoImg} className="logo-img"></img>
          </div>
          <div className="landing-header__menu-list">
            <div className="landing-header__menu-item">Góp ý</div>
            <div className="landing-header__menu-item">Liên hệ</div>
            <div className="landing-header__menu-item">Tính năng</div>
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="android-landing">
                    Tải bản Android - Đang cập nhật
                </Menu.Item>
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

          <div className="hambur-menu">
            {enableHumberMenu === false
              ? <MenuOutlined className="hambur__icon" onClick={this.showHamburMenu} />
              : <CloseOutlined className="hambur__icon" onClick={this.showHamburMenu} />}
            {enableHumberMenu ? <> <div className="ham__overlay"></div>
              <ul className="hambur__list">
                <li className="hambur__menu-item"><Link to="/login">Đăng nhập</Link></li>
                <li className="hambur__menu-item"><Link to="/create-family">Đăng ký</Link></li>
                <li className="hambur__menu-item">Web app</li>
                <li className="hambur__menu-item">Mobile app</li>
                <li className="hambur__menu-item">Tính năng</li>
                <li className="hambur__menu-item">Liên hệ</li>
                <li className="hambur__menu-item">Góp ý</li>
              </ul></> : null}
          </div>
        </header>


        <div className="landing-body">
          {/* Banner */}
          <div className="grid home-body">
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

            <div className="landing-body__features-container">
              <div className="landing-body__special-features">
                {/* sf - special - feature */}
                <div className="landing-body__sf-image">
                  <img src={imgRecent} className="sf_image"></img>
                </div>
                <div className="landing-body__sf-title">
                  <div className="sf__intro">Các chức năng chính của ứng dụng trợ giúp việc gia đình</div>
                  {featureList.length && featureList.map((item, index) =>
                    <div key={index}
                      className={`sf__title-item ${item.id === idFeatureRecent ? "sf__title-item-recent" : null}`}
                      onClick={() => this.handleClickChangeTitleFeature(item.id)}>{item.feature}</div>
                  )}


                </div>
              </div>
            </div>


            <div className="landing-body__intro">
              <div className="landing-body__intro--title">
                <div className="intro--des">
                  Ứng dụng trợ giúp việc gia đình SmartFamily sẽ giúp bạn giải quyết những vấn đề về việc quản lý công việc gia đình.
                </div>
                <div className="intro--des-second">
                  Ứng dụng sẽ giúp bạn tiết kiệm được nhiều thời gian hơn, làm việc hiệu quả hơn và đảm bảo các công việc trong gia đình vẫn được thực hiện.
                </div>
                <div className="intro--link">
                  <Link to="/create-family">Đăng ký gia đình &ensp; <ArrowRightOutlined /></Link>
                </div>
              </div>
              <div className="landing-body__intro--image">
              </div>

            </div>


            <div className="landing-body__get-contact">
              <div className="get-contact__title">
                Kết nối gia đình bạn trên nền tảng trực tuyến SmartFamily
              </div>
              <div className="get-contact__form">
                <Input type="email" className="get-contact__input" placeholder="Nhập email của bạn"></Input>
                <Button size="large" className="get-contact__button" type="primary">Kết nối</Button>
              </div>
              <div className="get-contact__more">SmartFamily là ứng dụng trợ giúp việc gia đình sử dụng miễn phí. Chúng tôi vẫn đang trong quá trình phát triển hơn, mong các bạn đóng góp ý kiến để giúp đỡ và hoàn thiện hơn.</div>
            </div>

            <footer className="landing-footer">
              <div className="footer__col">
                <img src={logoImg} className="logo-img-footer"></img>
              </div>
              <div className="footer__col">
                <div className="footer__col--item">
                  Tính năng
                </div>
                <div className="footer__col--item">
                  Điểm nổi bật
                </div>
                <div className="footer__col--item">
                  Đang phát triển
                </div>
                <div className="footer__col--item">
                  Tải app
                </div>
              </div>
              <div className="footer__col">
                <div className="footer__col--item">
                  Góp ý
                </div>
                <div className="footer__col--item">
                  Liên hệ
                </div>
                <div className="footer__col--item">
                  Trụ sở
                </div>
              </div>
              <div className="footer__col">
                <div className="footer__col--item">
                  Tuyển dụng
                </div>
                <div className="footer__col--item">
                  Câu hỏi???
                </div>
                <div className="footer__col--item">
                  Điều khoản
                </div>
                <div className="footer__col--item">
                  Bảo mật
                </div>
              </div>
            </footer>
          </div>
          {/* End banner */}


        </div>
      </div>
    );
  }
}
