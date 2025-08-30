import React from 'react';

interface StreamingSlideProps {
  id: string;
}

const StreamingSlide: React.FC<StreamingSlideProps> = ({ id }) => {
  const tiktokVideos = [
    { id: "7372832293834018091", title: "Please enter favorite animal" },
    { id: "7481911156873989407", title: "Super Secret Special White Sauce for Suki" },
    { id: "7405856116267224366", title: "GOTTEM" },
    { id: "7494528210877566251", title: "I don't want to get too political here, but..." },
    { id: "7511507687478234414", title: "The resident evil meme" }
  ];

  return (
    <section
      id={id}
      className="slide"
      style={{ background: "purple" }}
    >
      <h1>I Stream on <a href="https://twitch.tv/NebuPookins" target="_blank" rel="noopener noreferrer">Twitch</a></h1>
      <br />
      <h2>Here's my channel trailer</h2>
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/a2Bk7hbfJ88?si=sEZ3lZf9X77t0hvC"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
        <br />
    </section>
  );
};

export default StreamingSlide;
