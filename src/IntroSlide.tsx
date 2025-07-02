import React from 'react';

interface IntroSlideProps {
  id: string;
  bg: string;
  title?: string; // Title is from item.text, which is optional
  body?: string;  // Body is from item.extra, which is optional (and can be HTML string)
}

const IntroSlide: React.FC<IntroSlideProps> = ({ id, bg, title, body }) => {
  return (
    <section
      id={id}
      className="slide"
      style={{ background: bg }}
    >
      {title && <h1>{title}</h1>}
      {body && <div dangerouslySetInnerHTML={{ __html: body }} />}
    </section>
  );
};

export default IntroSlide;
