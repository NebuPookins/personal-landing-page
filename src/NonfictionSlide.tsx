import React from 'react';

interface NonfictionSlideProps {
  id: string;
}

const NonfictionSlide: React.FC<NonfictionSlideProps> = ({ id }) => {
  return (
    <section
      id={id}
      className="slide"
      style={{ background: "orange" }}
    >
      <h2>Non-Fiction Writing</h2>
      <p><a href="https://nebu.substack.com" target="_blank" rel="noopener noreferrer">Read my essays on Substack</a></p>
      <div className="arrow">↓</div>
    </section>
  );
};

export default NonfictionSlide;
