import React from 'react';

interface SlideProps {
  id: string;
  bg: string;
  htmlContent: string;
}

const Slide: React.FC<SlideProps> = ({ id, bg, htmlContent }) => {
  return (
    <section
      id={id}
      className="slide"
      style={{ background: bg }}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export default Slide;
