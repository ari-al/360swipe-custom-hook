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

const FittingViewerAnimation = () => {
  const [slideImageObjects, setSlideImageObjects] = useState([]);
  const sliderRef = useRef();
  const [currentPositionX, setCurrentPositionX] = useState();

  const ctx = useRef();
  const canvasRef = useRef();

  const startIndex = useRef(0);
  const lastIndex = useRef(10);
  const [animationStopTrigger, setAnimationStopTrigger] = useState(false);

  const startTurntableAnimation = () => {
    if (!animationStopTrigger) {
      const canvasWidth = canvasRef.current.width;
      const canvasHeight = canvasRef.current.height;
      const imageObj = slideImageObjects[currentFrame.current];
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
      currentFrame.current++;
      lastConnectToStart();
      setTimeout(() => {
        window.requestAnimationFrame(function () {
          startTurntableAnimation();
        });
      }, 20);
    }
  };

  useEffect(() => {
    ctx.current = canvasRef.current.getContext("2d");

    const imageArray = getFittingImageArray();
    lastIndex.current = imageArray.length - 1;

    const imageObjects = [];
    imageArray.forEach((item) => {
      const image = new Image();
      image.src = item;
      imageObjects.push(image);
    });
    setSlideImageObjects([...imageObjects]);
    setCanvasSize();
    window.onresize = function (e) {
      console.log("resize");
      setCanvasSize();
      redraw();
    };
  }, []);

  useEffect(() => {
    if (slideImageObjects.length > 0) {
      slideImageObjects[0].onload = function () {
        redraw();
      };
      redraw();
      //startTurntableAnimation();
    }
  }, [slideImageObjects]);

  const handleMousedown = useCallback((event) => {
    setCurrentPositionX(event.clientX);
    setAnimationStopTrigger(true);
  }, []);

  const intentedFrame = useRef(0);
  const currentFrame = useRef(0);
  const frameCount = useRef(0);

  const handleMousemove = (event, deltaX = 10, speed = 1.4) => {
    if (currentPositionX > 0) {
      const mouseClientX = event.clientX;
      const diff = mouseClientX - currentPositionX;
      const setFrameStatus = () => {
        intentedFrame.current += Math.abs(
          Math.ceil((diff / (deltaX / 2)) * speed)
        );
        lastConnectToStart();
      };
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
    }
  };

  const redraw = (left = false, right = false) => {
    console.log("start redraw");
    const canvasWidth = canvasRef.current.width;
    const canvasHeight = canvasRef.current.height;
    const animating = () => {
      console.log(`start animating : ${intentedFrame.current}`);
      if (frameCount.current < intentedFrame.current) {
        setTimeout(() => {
          window.requestAnimationFrame(function () {
            redraw(left, right);
          });
        }, 10);
      } else {
        intentedFrame.current = 0;
        frameCount.current = 0;
      }
    };
    console.log(slideImageObjects.length);
    if (slideImageObjects.length > 0) {
      const imageObj = slideImageObjects[currentFrame.current];
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

      frameCount.current++;
      if (left) {
        currentFrame.current--;
      }
      if (right) {
        currentFrame.current++;
      }
      lastConnectToStart();
      animating();
    }
  };

  const lastConnectToStart = () => {
    if (currentFrame.current < startIndex.current) {
      currentFrame.current = lastIndex.current;
    } else if (currentFrame.current > lastIndex.current) {
      currentFrame.current = startIndex.current;
    }
    return currentFrame.current;
  };

  const handleMouseup = useCallback((event) => {
    removeSlideEvent();
    setAnimationStopTrigger(false);
  }, []);

  const handleFocusout = useCallback(() => {
    removeSlideEvent();
  }, []);

  const removeSlideEvent = () => {
    setCurrentPositionX(-1);
  };

  function setCanvasSize() {
    canvasRef.current.width = canvasRef.current.parentElement.clientWidth;
    canvasRef.current.height = canvasRef.current.parentElement.clientHeight;
  }

  return (
    <>
      <Slider
        ref={sliderRef}
        onMouseDown={handleMousedown}
        onMouseMove={handleMousemove}
        onMouseUp={handleMouseup}
        onMouseOut={handleFocusout}
      />
      <Container className="fitting">
        <canvas ref={canvasRef} height={100} width={100} />
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

export default FittingViewerAnimation;