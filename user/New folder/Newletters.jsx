import React from "react";
import "./newsletter.css";

import { Container, Row, Col } from "reactstrap";
import maleTourits from "../assets/images/male-tourist.png";
const Newletters = () => {
  return (
    <section className="newsletter">
      <Container>
        <Row>
          <Col lg="6">
            <div className="newsletter__content">
              <h2>Subcribe now to get useful travelling information.</h2>
              <div className="newsletter__input">
                <input type="email" placeholder="Enter your email" />
                <button className="btn newsletter__btn mt-0">Subcribe</button>
              </div>
              <p>
                Vịnh Hạ Long là một di sản thiên nhiên thế giới nằm ở tỉnh Quảng
                Ninh, Việt Nam, nổi tiếng với cảnh quan hùng vĩ của hàng ngàn
                hòn đảo đá vôi lớn nhỏ rải rác trên mặt nước xanh biếc.
              </p>
            </div>
          </Col>
          <Col lg="6">
            <div className="newsletter__img">
              <img src={maleTourits} alt="" />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Newletters;
