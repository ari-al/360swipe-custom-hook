import { useEffect, useState, useRef, useCallback } from "react";
import styled from "styled-components";
import ProductImageZoom from "./ProductImageZoom";

const DEFAULT = "default";
const GRAP = "grap";
const SWIPE = "swipe";
const CLICK = "click";

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
  const [currentDirection, setCurrentDricetion] = useState(0);
  const [swipingCursor, setSwipingCursor] = useState(DEFAULT);
  const [zoomImageSrc, setZoomImageSrc] = useState("");
  const clickEventDivision = useRef(CLICK);
  let startTime = new Date();
  let endTime = new Date();

  useEffect(() => {
    const imageArray = getFittingImageArray();
    setSlideImages([...imageArray]);

    setZoomImageSrc(imageArray[0]);
  }, []);

  const handleMousedown = useCallback((event) => {
    const clientX = event?.clientX || event.touches[0]?.clientX;
    setPositionX(clientX);
    setCurrentPositionX(clientX);
    startTime = new Date(); // 시작
    setSwipingCursor(GRAP);
  }, []);

  const handleMousemove = (event, deltaX = 10) => {
    if (currentPositionX > 0) {
      endTime = new Date();
      const time = endTime - startTime;
      const mouseClientX = event?.clientX || event.touches[0]?.clientX;

      const diff = mouseClientX - currentPositionX;
      const startIndex = 0;
      const lastIndex = slideImages.length - 1;
      let velocity = Math.sqrt(Math.abs(mouseClientX - positionX)) / time; //√(absX^2 + absY^2) / time
      // velocity = velocity < 1 ? velocity * 10 : velocity;

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
  }, [currentIndex]);

  return (
    <>
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
        <SlideImage src={slideImages[currentIndex]} />
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
`;

const SlideImage = styled.img``;

export default FittingViewer;
