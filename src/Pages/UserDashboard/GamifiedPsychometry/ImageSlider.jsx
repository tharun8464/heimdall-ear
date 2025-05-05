import React, { useEffect, useState } from 'react'

function ImageSlider({ images, onComplete }) {

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1));
    }, 3000);

    if (currentSlide > images.length - 1) {
      clearInterval(interval);
      onComplete();
    }

    return () => clearInterval(interval);
  }, [currentSlide]);

  return (
    <div className="w-full h-full flex flex-row justify-center items-start">
      {images.map((image, index) => (
        <div
          key={index}
          className={`w-full md:w-2/4 aspect-video ${index === currentSlide ? 'block' : 'hidden'}`}
        >
          <img className='w-full h-full object-cover rounded-md drop-shadow-md border' src={image.signedImageUrl} loading="lazy" alt={`Slide ${index}`} />
        </div>
      ))}
    </div>
  )
}

export default ImageSlider