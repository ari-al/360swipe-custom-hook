import { useEffect, useState, useRef, useCallback } from "react";
import styled from "styled-components";

function getFittingImageArray() {
  let fittingImageArray = [];
  let i = 0;
  for (; i < 120; i++) {
    const path = `https://d1j0ofdyze21yi.cloudfront.net/style-final/AVATAR-female-Muscle_Hair-Bob_Cool_Face-B_CLOTH-female-Muscle-W_NK_DF_RUN_DVN_TEMPO_LX_SHORT_CLOTH-female-Muscle-W_NK_DFADV_RUN_DVN_ENG_TANK_SHOES-female-W_PEGASUS_TURBO_NEXT_NATURE/${i
      .toString()
      .padStart(4, "0")}.jpg`;
    fittingImageArray.push(path);
  }
  return fittingImageArray;
}

const FittingViewer = () => {
  const [slideImages, setSlideImages] = useState([]);
  const sliderRef = useRef();
  const [positionX, setPositionX] = useState();
  const [currentPositionX, setCurrentPositionX] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [updateCurrentIndex, setUpdateCurrentIndex] = useState(0);
  const duration = useRef();
  const startTime = useRef();

  useEffect(() => {
    const imageArray = getFittingImageArray();
    setSlideImages([...imageArray]);
  }, []);

  const handleMousedown = useCallback((event) => {
    setPositionX(event.clientX);
    setCurrentPositionX(event.clientX);
    startTime.current = new Date();
  }, []);

  const handleMousemove = (event, deltaX = 10) => {
    if (currentPositionX > 0) {
      const mouseClientX = event.clientX;
      const diff = mouseClientX - currentPositionX;
      const startIndex = 0;
      const lastIndex = slideImages.length - 1;
      if (diff > 0) {
        //right
      } else if (diff < 0) {
        //left
      }
      if (Math.abs(diff) > deltaX) {
        // let nextIndex = currentIndex + (diff > 0 ? 1 : -1);
        let nextIndex = currentIndex + Math.ceil(diff / (5 / 2));
        if (nextIndex < startIndex) {
          nextIndex = lastIndex;
        } else if (nextIndex > lastIndex) {
          nextIndex = startIndex;
        }
        setCurrentIndex(nextIndex);
        setCurrentPositionX(mouseClientX);
      }
    }
  };

  const handleMouseup = useCallback(() => {
    removeSlideEvent();
  }, [positionX, startTime, slideImages, currentIndex]);

  const handleFocusout = useCallback(() => {
    removeSlideEvent();
  }, []);

  const removeSlideEvent = () => {
    setCurrentPositionX(-1);
  };

  useEffect(() => {
    console.log(currentIndex);
    setCurrentIndex(updateCurrentIndex);
  }, [updateCurrentIndex]);
  return (
    <>
      <Slider
        ref={sliderRef}
        onMouseDown={handleMousedown}
        onMouseMove={handleMousemove}
        onMouseUp={handleMouseup}
        onBlur={handleFocusout}
      />
      <Container className="fitting">
        <SlideImage src={slideImages[currentIndex]} />
      </Container>
    </>
  );
};

const Slider = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
`;

const Container = styled.div`
  &.fitting {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
`;

const SlideImage = styled.img``;

export default FittingViewer;
