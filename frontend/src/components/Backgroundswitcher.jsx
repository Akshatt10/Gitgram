import { useEffect } from "react";

const BackgroundSwitcher = () => {
  useEffect(() => {
    const images = [
      '/bg.png',
      '/beautiful-nature-landscape-with-mountains-lake.jpg',
      '/starry-night-nature-background-with-mountains-aesthetic-remixed-media.jpg',
      '/starry-sky-mountain-background-nature-remixed-media.jpg',
      '/jonatan-pie-h8nxGssjQXs-unsplash (1).jpg',
      '/nathan-anderson-iYO-EGosrCo-unsplash.jpg',
      '/patrick-hendry-rGoxQdG6GXc-unsplash.jpg',
      '/rosie-sun-1L71sPT5XKc-unsplash.jpg',
      '/ryan-lum-1ak3Z7ZmtQA-unsplash.jpg'
    ];

    const randomImage = images[Math.floor(Math.random() * images.length)];
    
    // Apply the background image dynamically
    document.body.style.backgroundImage = `linear-gradient(to bottom right, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.4)), url('${randomImage}')`;

    console.log('Random background image:', randomImage);

  }, []); // Runs only once when the component mounts

  return null; // Since we don't need to return any JSX
};

export default BackgroundSwitcher;
