import { useEffect, useState, useRef, useCallback } from "react";
import styled from "styled-components";
import ProductImageZoom from "./ProductImageZoom";

const DEFAULT = "default";
const GRAB = "grab";
const SWIPE = "swipe";
const CLICK = "click";

function getFittingImageArray() {
  let fittingImageArray = [];
  let i = 1;
  for (; i <= 120; i++) {
    const path = `../fitting/SEQ 2.${i.toString().padStart(3, "0")}.png`;
    fittingImageArray.push(path);
  }
  return fittingImageArray;
}

const FittingViewer = () => {
  const [slideImages, setSlideImages] = useState([]);
  const [positionX, setPositionX] = useState();
  const [currentPositionX, setCurrentPositionX] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentDirection, setCurrentDricetion] = useState(0);
  const [swipingCursor, setSwipingCursor] = useState(DEFAULT);
  const [zoomImageSrc, setZoomImageSrc] = useState("none");
  const clickEventDivision = useRef(CLICK);
  const sliderRef = useRef();
  let startTime = new Date();
  let endTime = new Date();

  useEffect(() => {
    const imageArray = getFittingImageArray();
    setSlideImages([...imageArray]);
  }, []);

  const handleMousedown = useCallback((event) => {
    const clientX = event?.clientX || event.touches[0]?.clientX;
    setPositionX(clientX);
    setCurrentPositionX(clientX);
    startTime = new Date(); // 시작
    setSwipingCursor(GRAB);
  }, []);

  const handleMousemove = (event, deltaX = 10) => {
    if (currentPositionX > 0) {
      endTime = new Date();
      const time = endTime - startTime;
      const mouseClientX = event?.clientX || event.touches[0]?.clientX;

      const diff = mouseClientX - currentPositionX;
      const startIndex = 0;
      const lastIndex = slideImages.length - 1;
      let velocity = Math.sqrt(Math.abs(mouseClientX - positionX)) / time; //√(absX^2) / time

      if (Math.abs(diff) > deltaX) {
        clickEventDivision.current = SWIPE;
        let direction;
        if (diff > 0) {
          direction = "right";
        } else if (diff < 0) {
          direction = "left";
        }
        if (direction !== currentDirection) {
          setPositionX(mouseClientX);
        }
        setCurrentDricetion(direction);

        let nextIndex = Math.ceil(currentIndex + diff * velocity);
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
    setSwipingCursor(DEFAULT);
  }, [positionX, slideImages, currentIndex]);

  const handleFocusout = useCallback(() => {
    removeSlideEvent();
  }, []);

  const removeSlideEvent = () => {
    setCurrentPositionX(-1);
  };

  const [isOpenZoomCompo, setIsOpenZoomCompo] = useState(false);
  const handleClick = () => {
    if (clickEventDivision.current === CLICK) {
      setIsOpenZoomCompo(true);
    }
    clickEventDivision.current = CLICK;
  };

  const handleClickZoomCloseButton = () => {
    setIsOpenZoomCompo(false);
  };

  useEffect(() => {
    setZoomImageSrc(slideImages[currentIndex]);
  }, [slideImages, currentIndex]);

  return (
    <>
      <Container className="background"></Container>
      <Slider
        ref={sliderRef}
        cursor={swipingCursor}
        onClick={handleClick}
        onMouseDown={handleMousedown}
        onMouseMove={handleMousemove}
        onMouseUp={handleMouseup}
        //  onMouseOut={handleFocusout}
        onTouchStart={handleMousedown}
        onTouchMove={handleMousemove}
        onTouchEnd={(event) => {
          event.preventDefault();
          handleMouseup();
          handleClick();
        }}
      />
      <Container className="fitting">
        {slideImages.map((slideImage, index) => {
          return (
            <>
              <SlideImage
                src={slideImage}
                style={
                  currentIndex === index
                    ? { display: "block" }
                    : { display: "none" }
                }
              />
            </>
          );
        })}
      </Container>
      {isOpenZoomCompo && (
        <ProductImageZoom
          zoomImageSrc={zoomImageSrc}
          isOpen={isOpenZoomCompo}
          onClose={handleClickZoomCloseButton}
        />
      )}
    </>
  );
};

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
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  &.background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: url("../background/default.png");
    height: 100%;
  }
`;

const SlideImage = styled.img``;

export default FittingViewer;
