import React from 'react';

interface IntroSlideProps {
}

const IntroSlide: React.FC<IntroSlideProps> = ({}) => {
  return (
    <section
      className="slide"
      style={{ background: "red" }}
    >
      <h1>Hi, I'm Nebu Pookins</h1>
      <div className="arrow">↓</div>
    </section>
  );
};

export default IntroSlide;
