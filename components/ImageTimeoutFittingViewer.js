import { useEffect, useState, useRef, useCallback } from "react";
import styled from "styled-components";
import Image from "next/image";
import ProductImageZoom from "./ProductImageZoom";
import zoomIn from "../asset/images/zoom-in.png";
import zoomOut from "../asset/images/zoom-out.png";

const DEFAULT = "default";
const GRAB = "grab";
const SWIPE = "swipe";
const CLICK = "click";

function getFittingImageArray() {
  let fittingImageArray = [];
  let i = 1;
  for (; i <= 120; i++) {
    const path = `../fitting/fullbody.${i.toString().padStart(3, "0")}.png`;
    fittingImageArray.push(path);
  }
  return fittingImageArray;
}
const background = {
  none:"none",
  basic: "../background/bg1.png",
  sky: "../background/bg2.png",
  flower: "../background/bg3.png",
};
const FittingViewer = () => {
  const [slideImages, setSlideImages] = useState([]);
  const [positionX, setPositionX] = useState();
  const [currentPositionX, setCurrentPositionX] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentDirection, setCurrentDricetion] = useState(0);
  const [swipingCursor, setSwipingCursor] = useState(DEFAULT);
  const [zoomImageSrc, setZoomImageSrc] = useState("none");
  const [selectedBackground, setSelectedBackground] = useState("basic");
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
      let time = endTime - startTime;
      time = time < 1 ? 1 : time;
      console.log(`time:${time}`);
      const mouseClientX = event?.clientX || event.touches[0]?.clientX;

      const diff = mouseClientX - currentPositionX;
      if (Math.abs(diff) > deltaX) {
        let velocity = Math.sqrt(Math.abs(mouseClientX - positionX)) / time; //√(absX^2) / time
        if (!isFinite(velocity) || velocity < 1) {
          velocity = 1;
        } else if (velocity > 5) {
          velocity = 5;
        }
        const setFrameStatus = () => {
          intentedFrame.current += Math.abs(
            Math.ceil(diff / (deltaX / velocity))
          );
          console.log(`velocity:${velocity}`);
          console.log(`sqrt:${Math.sqrt(Math.abs(mouseClientX - positionX))}`);
          console.log(deltaX / velocity);
          console.log(intentedFrame);
          lastConnectToStart();
        };

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

        let swipingLeft = false;
        let swipingRight = false;
        if (diff > 0) {
          swipingRight = true;
        } else if (diff < 0) {
          swipingLeft = true;
        }
        if (Math.abs(diff) > deltaX) {
          setCurrentPositionX(mouseClientX);
          setFrameStatus();
          redraw(swipingLeft, swipingRight);
        }

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
  const handleSelectBackground = (event) => {
    setSelectedBackground(event.target.dataset.name);
    console.log(selectedBackground);
  };
  useEffect(() => {
    setZoomImageSrc(slideImages[currentIndex]);
  }, [slideImages, currentIndex]);

  const intentedFrame = useRef(0);
  const currentFrame = useRef(0);
  const frameCount = useRef(0);

  const redraw = (left = false, right = false, i = 1) => {
    //  console.time("draw time");
    const animating = () => {
      if (frameCount.current < intentedFrame.current) {
        window.requestAnimationFrame(function () {
          redraw(left, right);
        });
      } else {
        intentedFrame.current = 0;
        frameCount.current = 0;
      }
    };
    if (slideImages.length > 0) {
      setCurrentIndex(currentFrame.current);

      frameCount.current++;
      if (left) {
        currentFrame.current--;
      }
      if (right) {
        currentFrame.current++;
      }
      //  console.timeEnd("draw time");

      lastConnectToStart();
      animating();
    }
  };

  const lastConnectToStart = () => {
    const startIndex = 0;
    const lastIndex = slideImages.length - 1;
    if (currentFrame.current < startIndex) {
      currentFrame.current = lastIndex;
    } else if (currentFrame.current > lastIndex) {
      currentFrame.current = startIndex;
    }
    return currentFrame.current;
  };

  return (
    <>
      <Container
        className="background"
        selectedBackground={selectedBackground}
        zoomRatio={slideZoomRatio}
      ></Container>
      <Container className="zoom-button">
        <button onClick={handleSlideImageZoomIn}>
          <Image src={zoomIn} />
        </button>
        <button onClick={handeSlideImageZoomOut}>
          <Image src={zoomOut} />
        </button>
      </Container>
      <Container className="background-button">
        <button
          style={{
            background: "url(../background/bg1_thumbnail.png)",
            backgroundSize: "cover",
          }}
          onClick={handleSelectBackground}
          data-name={"basic"}
          className={selectedBackground === "basic" ? "active" : ""}
        ></button>
        <button
          style={{
            background: "url(../background/bg2_thumbnail.png)",
            backgroundSize: "cover",
          }}
          onClick={handleSelectBackground}
          data-name={"sky"}
          className={selectedBackground === "sky" ? "active" : ""}
        ></button>
        <button
          style={{
            background: "url(../background/bg3_thumbnail.png)",
            backgroundSize: "cover",
          }}
          onClick={handleSelectBackground}
          data-name={"flower"}
          className={selectedBackground === "flower" ? "active" : ""}
        ></button>
         <button
          style={{background:'white'
          }}
          onClick={handleSelectBackground}
          data-name={"none"}
          className={selectedBackground === "none" ? "active" : ""}
        ></button>
      </Container>
      <Slider
        ref={sliderRef}
        cursor={swipingCursor}
        onClick={handleClick}
        onMouseDown={handleMousedown}
        onMouseMove={handleMousemove}
        onMouseUp={handleMouseup}
        onMouseOut={handleFocusout}
        onTouchStart={handleMousedown}
        onTouchMove={handleMousemove}
        onTouchEnd={(event) => {
          event.preventDefault();
          handleMouseup();
          handleClick();
        }}
      />
      <Container className="fitting" zoomRatio={slideZoomRatio}>
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
          backgroundSrc={background[selectedBackground]}
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
    background: url(${(props) => background[props.selectedBackground]});
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

const SlideImage = styled.img``;

export default FittingViewer;
