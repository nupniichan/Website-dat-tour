import React, { useRef, useState, useEffect } from "react";
import "../shared/search-bar.css";
import { Col, Form, FormGroup } from "reactstrap";
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [user, setUser] = useState(null);
  const locationRef = useRef("");
  const priceRef = useRef(0);
  const maxGroupSizeRef = useRef("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const searchHandler = () => {
    const location = locationRef.current.value;
    const price = priceRef.current.value;
    const maxGroupSize = maxGroupSizeRef.current.value;

    if (location === "") {
      return alert("Location is required");
    }

    // Navigate to the search results page with query parameters
    let query = `location=${location}`;
    if (price) query += `&price=${price}`;
    if (maxGroupSize) query += `&maxGroupSize=${maxGroupSize}`;

    navigate(`/tours/search?${query}`);
  };

  return (
    <>
      <Col lg="12">
        <div className="search__bar">
          <Form className="d-flex align-items-center">
            <FormGroup className="d-flex gap-3 form__group form__group-fast">
              <span>
                <i className="ri-map-pin-line"></i>
              </span>
              <div>
                <h6>Location</h6>
                <input
                  type="text"
                  placeholder="Where are you going?"
                  ref={locationRef}
                />
              </div>
            </FormGroup>
            <FormGroup className="d-flex gap-3 form__group form__group-fast">
              <span>
                <i className="ri-money-dollar-circle-line"></i>
              </span>
              <div>
                <h6>Price</h6>
                <input
                  type="number"
                  placeholder="Max Price"
                  ref={priceRef}
                />
              </div>
            </FormGroup>
            <FormGroup className="d-flex gap-3 form__group form__group-last">
              <span>
                <i className="ri-group-line"></i>
              </span>
              <div>
                <h6>Max People</h6>
                <input type="number" placeholder="0" ref={maxGroupSizeRef} />
              </div>
            </FormGroup>
            <span
              className="search__icon"
              type="submit"
              onClick={searchHandler}
            >
              <i className="ri-search-line"></i>
            </span>
          </Form>
        </div>
      </Col>
    </>
  );
};

export default SearchBar;
