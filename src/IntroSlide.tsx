import React, { useEffect, useState } from 'react';

interface IntroSlideProps {
}

const IntroSlide: React.FC<IntroSlideProps> = ({}) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger animation on component mount
    setAnimate(true);
  }, []);

  return (
    <section
      className="slide"
      style={{ background: "red", position: 'relative', overflow: 'hidden' }}
    >
      <h1>Hi, I'm Nebu Pookins</h1>
      <div className="arrow">↓</div>
      <img
        src="placeholder.svg"
        alt="Placeholder"
        className={`animated-image ${animate ? 'slide-in' : ''}`}
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          width: '100px', // Adjust as needed
          height: '100px', // Adjust as needed
        }}
      />
    </section>
  );
};

export default IntroSlide;
