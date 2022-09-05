import { useEffect, useState, useRef, useCallback } from "react";
import styled from "styled-components";
import { useSwipeable } from "react-swipeable";

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

const FittingViewerSwipeable = () => {
  const [slideImageObjects, setSlideImageObjects] = useState([]);
  const sliderRef = useRef();
  const [currentPositionX, setCurrentPositionX] = useState(0);
  const [allImageLoaded, setAllImageLoaded] = useState(false);

  const ctx = useRef();
  const canvasRef = useRef();

  const startIndex = useRef(0);
  const lastIndex = useRef(10);

  const velocity = useRef(0);
  const flag = useRef(false);

  const configswipeable = {
    preventDefaultTouchmoveEvent: false, // call e.preventDefault *See Details*
    trackTouch: true, // track touch input
    trackMouse: true, // track mouse input
    rotationAngle: 0, // set a rotation angle
  };

  const handlers = useSwipeable({
    onSwiped: (eventData) => {
      //setDelta(0);
      flag.current = true;
    },
    onSwiping: (eventData, deltaX = 10, speed = 1.4) => {
      flag.current = false;
      velocity.current = eventData.velocity;
      const mouseClientX = eventData.deltaX;
      const diff = mouseClientX - currentPositionX;
      const setFrameStatus = () => {
        intentedFrame.current += Math.abs(
          Math.ceil(diff / (deltaX / (2 * eventData.velocity)))
        );
        lastConnectToStart();
      };
      let swipingLeft = false;
      let swipingRight = false;
      if (deltaX > 0) {
        swipingRight = true;
        swipingLeft = false;
      } else if (deltaX < 0) {
        swipingLeft = true;
        swipingRight = false;
      }
      if (Math.abs(diff) > deltaX) {
        setCurrentPositionX(mouseClientX);
        setFrameStatus();
        redraw(swipingLeft, swipingRight);
      }
    },
    ...configswipeable,
  });

  useEffect(() => {
    ctx.current = canvasRef.current.getContext("2d");

    const imageArray = getFittingImageArray();
    lastIndex.current = imageArray.length - 1;

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
    window.onresize = function (e) {
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

  const intentedFrame = useRef(0);
  const currentFrame = useRef(0);
  const frameCount = useRef(0);

  const redraw = (left = false, right = false, i = 1) => {
    const canvasWidth = canvasRef.current.width;
    const canvasHeight = canvasRef.current.height;
    let deceleration = 1 * i;
    const animating = () => {
      if (flag.current) {
        deceleration += 1;
        //  console.log(`deceleration : ${deceleration}`);
      }
      if (frameCount.current < intentedFrame.current) {
        //console.log(frameCount.current);
        setTimeout(() => {
          window.requestAnimationFrame(function () {
            redraw(left, right, deceleration);
          });
        }, 10);
      } else {
        intentedFrame.current = 0;
        frameCount.current = 0;
      }
    };
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

  function setCanvasSize() {
    canvasRef.current.width = canvasRef.current.parentElement.clientWidth;
    canvasRef.current.height = canvasRef.current.parentElement.clientHeight;
  }

  return (
    <>
      <Slider {...handlers}></Slider>
      <Container className="fitting">
        {!allImageLoaded && <h1>LOADING</h1>}
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
  touch-action: none;
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

export default FittingViewerSwipeable;
