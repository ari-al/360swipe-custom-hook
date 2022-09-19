This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open http://localhost:3000 with your favorite browser to see your project.

### API

```
  const { handlers, currentIndex, sliderRef } = use360Swipe({
    ...config,
  });

  return(
      <Slider ref={sliderRef} {...handlers} />
  )
```

### Configuration props and default values

```
{
  frameNumber: 0,
  deltaX: 10,
  minVelocity: 1,
  maxVelocity: 5,
}
```

### Props

```
{
  handlers,       // event handler
  currentIndex,   // current frame
  sliderRef       // ref
}
```
