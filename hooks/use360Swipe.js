import { useEffect, useState, useRef, useCallback } from "react";
import styled from "styled-components";

const DEFAULT = "default";
const GRAB = "grab";
const SWIPE = "swipe";
const CLICK = "click";
const RIGHT = "right";
const LEFT = "left";

export default ({
  frameNumber = 0,
  minVelocity = 1,
  maxVelocity = 5,
  deltaX = 10,
}) => {
  const [totalFrame, setTotalFrame] = useState(frameNumber);
  const [minMoveVelocity, setMinVelocity] = useState(minVelocity);
  const [maxMoveVelocity, setMaxVelocity] = useState(maxVelocity);
  const [moveDeltaX, setMoveDeltaX] = useState(deltaX);
  const [initPositionX, setInitPositionX] = useState();
  const [currentPositionX, setCurrentPositionX] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentDirection, setCurrentDricetion] = useState(0);

  const [swipingCursor, setSwipingCursor] = useState(DEFAULT);
  const clickEventDivision = useRef(CLICK);
  const sliderRef = useRef();

  let startTime = new Date();
  let endTime = new Date();

  const handleMousedown = useCallback((event) => {
    const clientX = event?.clientX || event.touches[0]?.clientX;
    setInitPositionX(clientX);
    setCurrentPositionX(clientX);
    startTime = new Date(); // 시작
    setSwipingCursor(GRAB);
  }, []);

  const handleMousemove = (event) => {
    if (currentPositionX > 0) {
      clickEventDivision.current = SWIPE;

      endTime = new Date();
      let time = endTime - startTime;
      time = time < 1 ? 1 : time;

      const mouseClientX = event?.clientX || event.touches[0]?.clientX;
      const diff = mouseClientX - currentPositionX;
      if (Math.abs(diff) > moveDeltaX) {
        let velocity = Math.sqrt(Math.abs(mouseClientX - initPositionX)) / time; //√(absX^2) / time
        if (!isFinite(velocity) || velocity < minMoveVelocity) {
          velocity = minMoveVelocity;
        } else if (velocity > maxMoveVelocity) {
          velocity = maxMoveVelocity;
        }

        let direction;
        let swipingLeft = false;
        let swipingRight = false;
        if (diff > 0) {
          direction = RIGHT;
          swipingRight = true;
        } else if (diff < 0) {
          direction = LEFT;
          swipingLeft = true;
        }
        if (direction !== currentDirection) {
          setInitPositionX(mouseClientX);
        }
        setCurrentDricetion(direction);

        if (Math.abs(diff) > moveDeltaX) {
          const setFrameStatus = () => {
            intentedFrame.current += Math.abs(
              Math.ceil(diff / (moveDeltaX / velocity))
            );
            console.log(`velocity:${velocity}`);
            console.log(
              `sqrt:${Math.sqrt(Math.abs(mouseClientX - initPositionX))}`
            );
            console.log(moveDeltaX / velocity);
            console.log(intentedFrame);
            lastConnectToStart();
          };
          setCurrentPositionX(mouseClientX);
          setFrameStatus();
          redraw(swipingLeft, swipingRight);
        }

        setCurrentPositionX(mouseClientX);
      }
    }
  };

  const intentedFrame = useRef(0);
  const currentFrame = useRef(0);
  const frameCount = useRef(0);

  const redraw = (left = false, right = false) => {
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
    setCurrentIndex(currentFrame.current);
    console.log(currentFrame.current);
    frameCount.current++;
    if (left) {
      currentFrame.current--;
    }
    if (right) {
      currentFrame.current++;
    }

    lastConnectToStart();
    animating();
  };

  const lastConnectToStart = () => {
    const startIndex = 0;
    const lastIndex = totalFrame;
    if (currentFrame.current < startIndex) {
      currentFrame.current = lastIndex;
    } else if (currentFrame.current > lastIndex) {
      currentFrame.current = startIndex;
    }
    return currentFrame.current;
  };

  const handleMouseup = useCallback(() => {
    removeSlideEvent();
    setSwipingCursor(DEFAULT);
  }, [initPositionX, currentIndex]);

  const handleFocusout = useCallback(() => {
    removeSlideEvent();
  }, []);
  const removeSlideEvent = () => {
    setCurrentPositionX(-1);
  };

  const onMouseDown = handleMousedown;
  const onMouseMove = handleMousemove;
  const onMouseUp = handleMouseup;
  const onMouseOut = handleFocusout;
  const onTouchStart = handleMousedown;
  const onTouchMove = handleMousemove;
  const onTouchEnd = (event) => {
    event.preventDefault();
    handleMouseup();
    //  handleClick();
  };
  useEffect(() => {
    console.log(currentIndex);
  }, [currentIndex]);

  return {
    handlers: {
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onMouseOut,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    },
    currentIndex,
    sliderRef,
  };
};
