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
      <h2>(And the cat's name is Marley)</h2>
      <div className="arrow">↓</div>
      <img
        src="nebu-and-marley.png"
        alt="An Asian guy holding up a cat"
        className={`animated-image ${animate ? 'slide-in' : ''}`}
        style={{
          position: 'absolute',
          bottom: '0px',
          right: '0px',
          width: '50vw',
          height: '50vh', 
          objectFit: 'cover',
        }}
      />
    </section>
  );
};

export default IntroSlide;
