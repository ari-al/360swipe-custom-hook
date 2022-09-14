import { useEffect, useState, useRef, useCallback } from "react";
import styled from "styled-components";
import ProductImageZoom from "./ProductImageZoom";

const DEFAULT = "default";
const GRAP = "grap";
const SWIPE = "swipe";
const CLICK = "click";

function getFittingImageArray() {
  let fittingImageArray = [];
  for (let i = 0; i < 120; i++) {
    const path = `/fitting/SEQ.${i.toString().padStart(4, "0")}.png`;
    fittingImageArray.push(path);
  }
  return fittingImageArray;
}

const FittingViewer = () => {
  const sliderRef = useRef();
  const [positionX, setPositionX] = useState();
  const [currentPositionX, setCurrentPositionX] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentDirection, setCurrentDricetion] = useState(0);
  const [swipingCursor, setSwipingCursor] = useState(DEFAULT);
  const [zoomImageSrc, setZoomImageSrc] = useState("none");
  const clickEventDivision = useRef(CLICK);
  let startTime = new Date();
  let endTime = new Date();

  const ctx = useRef();
  const canvasRef = useRef();
  const [slideImageObjects, setSlideImageObjects] = useState([]);
  const [allImageLoaded, setAllImageLoaded] = useState(false);
  const [slideImages, setSlideImages] = useState([]);

  useEffect(() => {
    ctx.current = canvasRef.current.getContext("2d");

    const imageArray = getFittingImageArray();
    setSlideImages([...imageArray]);
    const imageObjects = [];
    let loadedImageCounter = 0;
    imageArray.forEach((item, index) => {
      const image = new Image();
      image.src = item;
      imageObjects.push(image);
      imageObjects[index].onload = function () {
        console.log(loadedImageCounter);
        console.log(imageObjects[index].src);
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
      console.log(zoomImageSrc);
    }
    clickEventDivision.current = CLICK;
  };

  const handleClickZoomCloseButton = () => {
    setIsOpenZoomCompo(false);
  };

  useEffect(() => {
    setZoomImageSrc(slideImages[currentIndex]);
  }, [slideImages, currentIndex]);

  const drawCanvas = () => {
    const canvasWidth = canvasRef.current.width;
    const canvasHeight = canvasRef.current.height;
    const imageObj = slideImageObjects[currentIndex];
    const imageWidth = imageObj.width || 1920;
    const imageHeight = imageObj.height || 1080;
    let ratio = imageObj.height / imageObj.width;
    let width = canvasHeight / ratio;
    ctx.current.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.current.fillStyle = "green";
    ctx.current.fillRect(0, 0, canvasWidth, canvasHeight);
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

export default FittingViewer;
