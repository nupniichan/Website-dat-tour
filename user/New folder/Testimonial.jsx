import React from "react";
import Slider from "react-slick";


const Testimonial = () => {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 1000,
    swipeToSlide: true,
    autoplaySpeed: 2000,
    slidesToShow: 3,

    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slideToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slideToScroll: 1,
        },
      },
    ],
  };
  const avt01 = "https://dulichtoday.vn/wp-content/uploads/2017/04/vinh-Ha-Long.jpg";
  const avt02 = "https://images.pexels.com/photos/20765385/pexels-photo-20765385/free-photo-of-thac-jungle-tuy-t-d-p-trong-m-t-khu-r-ng-nhi-t-d-i-v-i-nh-ng-t-ng-da-va-dong-song-nh-n-c-ng-t-trong-xanh-mua-he-la-m-i-n-n-phong-c-nh-thien-nhien-nh-ng-b-c-nh-d-c-dao-ten-no-la.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const avt03 = "https://images.pexels.com/photos/14780251/pexels-photo-14780251.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";


  return (
    <Slider {...settings}>
      <div className="testmonial py-4 px-3">
        <p>
          Vịnh Hạ Long là một di sản thiên nhiên thế giới nằm ở tỉnh Quảng Ninh,
          Việt Nam, nổi tiếng với cảnh quan hùng vĩ của hàng ngàn hòn đảo đá vôi
          lớn nhỏ rải rác trên mặt nước xanh biếc.
          <div className="d-flex align-items-center gap-4 mt-3">
            <img src={avt01} className="w-25 h-25 rounded-2" alt="" />
            <div>
              <h6 className="mb-0 mt-3">TAi Nguyen</h6>
              <p>Customer</p>
            </div>
          </div>
        </p>
      </div>
      <div className="testmonial py-4 px-3">
        <p>
          Vịnh Hạ Long là một di sản thiên nhiên thế giới nằm ở tỉnh Quảng Ninh,
          Việt Nam, nổi tiếng với cảnh quan hùng vĩ của hàng ngàn hòn đảo đá vôi
          lớn nhỏ rải rác trên mặt nước xanh biếc.
          <div className="d-flex align-items-center gap-4 mt-3">
            <img src={avt02} className="w-25 h-25 rounded-2" alt="" />
            <div>
              <h6 className="mb-0 mt-3">Hoài Nghĩa</h6>
              <p>Customer</p>
            </div>
          </div>
        </p>
      </div>
      <div className="testmonial py-4 px-3">
        <p>
          Vịnh Hạ Long là một di sản thiên nhiên thế giới nằm ở tỉnh Quảng Ninh,
          Việt Nam, nổi tiếng với cảnh quan hùng vĩ của hàng ngàn hòn đảo đá vôi
          lớn nhỏ rải rác trên mặt nước xanh biếc.
          <div className="d-flex align-items-center gap-4 mt-3">
            <img src={avt03} className="w-25 h-25 rounded-2" alt="" />
            <div>
              <h6 className="mb-0 mt-3">Tùng Lâm</h6>
              <p>Customer</p>
            </div>
          </div>
        </p>
      </div>
      <div className="testmonial py-4 px-3">
        <p>
          Vịnh Hạ Long là một di sản thiên nhiên thế giới nằm ở tỉnh Quảng Ninh,
          Việt Nam, nổi tiếng với cảnh quan hùng vĩ của hàng ngàn hòn đảo đá vôi
          lớn nhỏ rải rác trên mặt nước xanh biếc.
          <div className="d-flex align-items-center gap-4 mt-3">
            <img src={avt02} className="w-25 h-25 rounded-2" alt="" />
            <div>
              <h6 className="mb-0 mt-3">Hoài Nghĩa</h6>
              <p>Customer</p>
            </div>
          </div>
        </p>
      </div>
      <div className="testmonial py-4 px-3">
        <p>
          Vịnh Hạ Long là một di sản thiên nhiên thế giới nằm ở tỉnh Quảng Ninh,
          Việt Nam, nổi tiếng với cảnh quan hùng vĩ của hàng ngàn hòn đảo đá vôi
          lớn nhỏ rải rác trên mặt nước xanh biếc.
          <div className="d-flex align-items-center gap-4 mt-3">
            <img src={avt01} className="w-25 h-25 rounded-2" alt="" />
            <div>
              <h6 className="mb-0 mt-3">Hoàng Thanh</h6>
              <p>Customer</p>
            </div>
          </div>
        </p>
      </div>
    </Slider>
  );
};

export default Testimonial;
