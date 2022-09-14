import styled from "styled-components";
import { useState, useRef } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Image from "next/image";
import closeButton from "../asset/images/close.png";
import plusCursor from "../asset/images/plus.png";
import minusCursor from "../asset/images/minus.png";

export default function ProductImageZoom({ zoomImageSrc, isOpen, onClose }) {
  const zoomCounter = useRef(1);
  const zoomRef = useRef();
  const [stopZoom, setStopZoom] = useState(false);
  const [zoomCursorSrc, setZoomCursorSrc] = useState(plusCursor.src);
  const panningProps = {
    disabled: false,
  };
  const wheelProps = {
    disabled: true,
  };
  const handleZoomInAndOut = () => {
    console.log(zoomCounter.current);
    if (!stopZoom) {
      if (zoomCounter.current < 3) {
        zoomCounter.current++;
        zoomRef.current.zoomIn();
      } else {
        zoomCounter.current = 1;
        zoomRef.current.resetTransform();
      }

      if (zoomCounter.current === 3) {
        setZoomCursorSrc(minusCursor.src);
      } else {
        setZoomCursorSrc(plusCursor.src);
      }
    }
    setStopZoom(false);
  };

  return (
    <Container isOpen={isOpen}>
      <button className="close-button" onClick={onClose}>
        <Image src={closeButton} />
      </button>
      <TransformWrapper
        panning={panningProps}
        wheel={wheelProps}
        maxScale={3}
        ref={zoomRef}
        onPanning={() => setStopZoom(true)}
      >
        <>
          <TransformComponent>
            <ZoomContainer
              onClick={handleZoomInAndOut}
              onTouchEnd={(event) => {
                event.preventDefault();
                handleZoomInAndOut();
              }}
              cursor={zoomCursorSrc}
            >
              <div>
                <ZoomImage src={zoomImageSrc}></ZoomImage>
              </div>
            </ZoomContainer>
          </TransformComponent>
        </>
      </TransformWrapper>
    </Container>
  );
}

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f6f5f3;
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  z-index: 50;
  .close-button {
    position: absolute;
    top: 0;
    right: 0;
    width: 72px;
    height: 72px;
    z-index: 20;
  }
  .close-button:hover {
    &:before {
      content: "";
      height: 72px;
      width: 72px;
      display: inline-block;
      position: absolute;
      z-index: 20;
      background-color: #f1eee98a;
      box-shadow: -1px 1px #eae8e4;
    }
  }
  @media screen and (max-width: 64rem) {
    .close-button {
      width: 56px;
      height: 56px;
    }
  }
`;
const ZoomContainer = styled.div`
  text-align: center;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  picture {
    text-align: center;
  }
  &:hover {
    cursor: url(${(props) => props.cursor}), auto;
  }
`;
const ZoomImage = styled.img`
  width: 50%;
  @media screen and (max-width: 64rem) {
    height: 100vh;
    width: auto;
    position: relative;
    left: -50%;
    transform: translate(25%);
  }
`;
