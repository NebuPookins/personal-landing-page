import React from 'react';

interface StreamingSlideProps {
  id: string;
}

const StreamingSlide: React.FC<StreamingSlideProps> = ({ id }) => {
  return (
    <section
      id={id}
      className="slide"
      style={{ background: "purple" }}
    >
      <h2>Streaming</h2>
      <p><a href="https://twitch.tv/NebuPookins" target="_blank" rel="noopener noreferrer">Check out my Twitch</a></p>
      <div className="arrow">↓</div>
    </section>
  );
};

export default StreamingSlide;
