import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import use360Swipe from "../hooks/use360Swipe";
import Image from "next/image";
import zoomIn from "../asset/images/zoom-in.png";
import zoomOut from "../asset/images/zoom-out.png";

function getFittingImageArray() {
  let fittingImageArray = [];
  let i = 1;
  for (; i <= 120; i++) {
    const path = `../fitting/fullbody.${i.toString().padStart(3, "0")}.png`;
    fittingImageArray.push(path);
  }
  return fittingImageArray;
}

const FittingViewer = (props) => {
  const config = {
    minVelocity: 1,
    maxVelocity: 10,
    frameNumber: 119,
    deltaX: 10,
  };
  const { handlers, currentIndex, sliderRef } = use360Swipe({
    ...config,
  });

  const [slideImages, setSlideImages] = useState(() => {
    const imageArray = getFittingImageArray();
    return [...imageArray];
  });

  const [slideZoomRatio, setSlideZoomRatio] = useState(1);
  const handleSlideImageZoomIn = () => {
    if (slideZoomRatio < 1.75) {
      setSlideZoomRatio(slideZoomRatio + 0.25);
    }
  };
  const handeSlideImageZoomOut = () => {
    if (slideZoomRatio > 1) {
      setSlideZoomRatio(slideZoomRatio - 0.25);
    }
  };
  return (
    <>
      <Slider ref={sliderRef} {...handlers} />
      <Container className="zoom-button">
        <button onClick={handleSlideImageZoomIn}>
          <Image src={zoomIn} />
        </button>
        <button onClick={handeSlideImageZoomOut}>
          <Image src={zoomOut} />
        </button>
      </Container>
      <Container className="fitting" zoomRatio={slideZoomRatio}>
        {slideImages.map((slideImage, index) => {
          const elKey = `slide-${index}`;
          return (
            <SlideImage
              key={elKey}
              src={slideImage}
              className={currentIndex === index ? "active" : ""}
            />
          );
        })}
      </Container>
    </>
  );
};

FittingViewer.propTypes = {};
const Slider = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  touch-action: none;
  z-index: 10;
  cursor: ${(props) => props.cursor};
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;
const Container = styled.div`
  &.fitting {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transform: scale(${(props) => props.zoomRatio});
    }
  }
  &.background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    transform: scale(${(props) => props.zoomRatio});
    background-size: cover;
    height: 100%;
  }
  &.zoom-button {
    display: flex;
    flex-flow: column;
    position: absolute;
    bottom: 4%;
    left: 4%;
    z-index: 15;
    button {
      height: 48px;
      width: 48px;
    }
    button:hover {
      &:before {
        content: "";
        height: 48px;
        width: 48px;
        display: inline-block;
        position: absolute;
        z-index: 15;
        background-color: #f1eee98a;
        border-radius: 10px;
      }
    }
  }
  &.background-button {
    position: absolute;
    z-index: 15;
    bottom: 4%;
    right: 4%;
    display: flex;
    flex-flow: column;
    row-gap: 4px;
    button {
      width: 40px;
      height: 40px;
      opacity: 0.5;
      border: 1px solid rgba(192, 192, 192, 0.5);
      border-radius: 9999px;
      &.active {
        opacity: 1;
      }
    }
  }
  @media screen and (max-width: 64rem) {
    &.zoom-button {
      button {
        height: 36px;
        width: 36px;
      }
    }
  }
`;

const SlideImage = styled.img`
  display: none;
  &.active {
    display: block;
  }
`;

export default FittingViewer;
