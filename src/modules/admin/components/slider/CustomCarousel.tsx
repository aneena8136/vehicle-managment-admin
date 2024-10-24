// components/CustomCarousel.js
import React, { useState } from 'react';
import styles from './CustomCarousel.module.css';

const CustomCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className={styles.carousel}>
      <button className={styles.arrow} onClick={prevSlide}>❮</button>
      <div className={styles.imageContainer}>
        <img src={images[currentIndex]} alt={`Slide ${currentIndex}`} className={styles.image} />
      </div>
      <button className={styles.arrow} onClick={nextSlide}>❯</button>
    </div>
  );
};

export default CustomCarousel;
