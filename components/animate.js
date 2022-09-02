let params;

params.framesCount = 120;

deltaDif = Math.ceil(delta / (GESTURE_DELTA / 2));
countFrames += deltaDif;

frameCount = 0;

var animateFrames = function () {
  if (animDirection == 1) {
    curFrame++;
  }

  if (animDirection == 2) {
    curFrame--;
  }

  frameCount++;
  if (curFrame < 0) {
    curFrame = params.framesCount - 1;
  }
  if (curFrame > params.framesCount - 1) {
    curFrame = 0;
  }
  drawFrame();
  if (frameCount < countFrames) {
    requestAnimFrame(function () {
      animateFrames();
    });
  } else {
    animDirection = 0;
    countFrames = 0;
    frameCount = 0;
    animatingFrames = false;
  }
};
var drawFrame = function () {
  if (curFrame > params.framesCount - 1) {
    curFrame = 0;
  }
  if (curFrame < 0) {
    curFrame = params.framesCount - 1;
  }

  currentImage = frameImages[curFrame];

  if (curFrame >= 0 && curFrame < params.framesCount - 1) {
    context.drawImage(currentImage, imagePositionX, imagePositionY);
  }
};
