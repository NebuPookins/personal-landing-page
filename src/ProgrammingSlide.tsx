import React from 'react';

interface ProgrammingSlideProps {
  id: string;
}

const ProgrammingSlide: React.FC<ProgrammingSlideProps> = ({ id }) => {
  return (
    <section
      id={id}
      className="slide"
      style={{ background: "darkslategray" }}
    >
      <h2>Programming</h2>
      <p><a href="https://github.com/NebuPookins" target="_blank" rel="noopener">Browse my GitHub</a></p>
      <div className="arrow">↓</div>
    </section>
  );
};

export default ProgrammingSlide;
