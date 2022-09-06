import { useEffect, useState, useRef, useCallback } from "react";
import styled from "styled-components";
import { useSwipeable } from "react-swipeable";
import ProductImageZoom from "./ProductImageZoom";

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

const FittingViewerWithoutAnimation = () => {
  const DEFAULT = "default";
  const GRAP = "grap";
  const SWIPE = "swipe";
  const CLICK = "click";
  const [slideImageObjects, setSlideImageObjects] = useState([]);
  const [allImageLoaded, setAllImageLoaded] = useState(false);
  const [swipingCursor, setSwipingCursor] = useState(DEFAULT);
  const [zoomImageSrc, setZoomImageSrc] = useState("");
  const clickEventDivision = useRef(CLICK);

  const ctx = useRef();
  const canvasRef = useRef();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [delta, setDelta] = useState(0);

  const configswipeable = {
    preventDefaultTouchmoveEvent: false, // call e.preventDefault *See Details*
    trackTouch: true, // track touch input
    trackMouse: true, // track mouse input
    rotationAngle: 0, // set a rotation angle
  };

  const handlers = useSwipeable({
    onSwipeStart: () => {
      setSwipingCursor(GRAP);
      clickEventDivision.current = SWIPE;
      console.log("swiping start");
    },
    onSwiped: () => {
      setSwipingCursor(DEFAULT);
      setDelta(0);
      console.log("swiping end");
    },
    onSwiping: (eventData) => {
      const diff = delta - eventData.deltaX;
      if (Math.abs(diff) > 5) {
        let start = 0;
        let end = slideImageObjects.length - 1;
        const minVelocity =
          eventData.velocity * 10 < 1
            ? eventData.velocity * 10
            : eventData.velocity;
        let index = Math.round(currentIndex - diff * minVelocity);

        if (index < start) {
          index = end;
        } else if (index > end) {
          index = start;
        }
        setCurrentIndex(index);
        setDelta(eventData.deltaX);
        drawCanvas();
      }
    },
    ...configswipeable,
  });

  const drawCanvas = () => {
    console.log(`currentIndex: ${currentIndex}`);
    const canvasWidth = canvasRef.current.width;
    const canvasHeight = canvasRef.current.height;
    const imageObj = slideImageObjects[currentIndex];
    const imageWidth = imageObj.width || 1920;
    const imageHeight = imageObj.height || 1080;
    let ratio = imageObj.height / imageObj.width;
    let width = canvasHeight / ratio;
    ctx.current.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.current.drawImage(
      imageObj,
      imageWidth / 2 - imageHeight / 2,
      0,
      imageWidth,
      imageHeight,
      0,
      0,
      width,
      canvasHeight
    );
  };

  useEffect(() => {
    ctx.current = canvasRef.current.getContext("2d");

    const imageArray = getFittingImageArray();
    const imageObjects = [];
    let loadedImageCounter = 0;
    imageArray.forEach((item, index) => {
      const image = new Image();
      image.src = item;
      imageObjects.push(image);
      imageObjects[index].onload = function () {
        if (loadedImageCounter === imageArray.length - 1) {
          setAllImageLoaded(true);
        }
        loadedImageCounter++;
      };
    });
    setSlideImageObjects([...imageObjects]);
    setCanvasSize();
    setZoomImageSrc(imageArray[0]);
  }, []);

  useEffect(() => {
    window.onresize = function (e) {
      setCanvasSize();
      drawCanvas();
    };
    if (slideImageObjects.length > 0) {
      slideImageObjects[0].onload = function () {
        drawCanvas();
      };
      drawCanvas();
    }
    setZoomImageSrc(slideImageObjects[currentIndex]?.getAttribute("src"));
  }, [slideImageObjects, currentIndex]);

  function setCanvasSize() {
    canvasRef.current.width = canvasRef.current.parentElement.clientWidth;
    canvasRef.current.height = canvasRef.current.parentElement.clientHeight;
  }

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

  return (
    <>
      <Slider
        {...handlers}
        cursor={swipingCursor}
        onClick={handleClick}
      ></Slider>
      <Container className="fitting">
        {!allImageLoaded && <h1>LOADING</h1>}
        <canvas ref={canvasRef} height={100} width={100} />
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
  z-index: 10;
  touch-action: none;
  cursor: ${(props) => props.cursor};
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

export default FittingViewerWithoutAnimation;
