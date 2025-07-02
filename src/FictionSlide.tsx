import React from 'react';

interface FictionSlideProps {
  id: string;
}

const FictionSlide: React.FC<FictionSlideProps> = ({ id }) => {
  return (
    <section
      id={id}
      className="slide"
      style={{ background: "brown" }}
    >
      <h2>Fiction Writing</h2>
      <p>Fiction writing slide coming soon!</p>
      <div className="arrow">↓</div>
    </section>
  );
};

export default FictionSlide;
