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
      <p>I've written a sci-fi horror story.</p>
      <a 
        href="https://amzn.to/45GmIp3" 
        target="_blank" 
        rel="noopener"
        className="amazon-link"
      >
        <img 
          src="tiny-pests-cover.jpg" 
          alt="[Tiny Pests by Nebu Pookins]" 
          style={{
            maxWidth: '200px',
            height: 'auto',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            transition: 'transform 0.2s ease-in-out'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        />
      </a>
      <small
        style={{
          maxWidth: '40em',
          fontSize: '50%',
          textAlign: 'left',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <p>
          From mind-altering parasites in nature to unsettling anomalies in modern research labs,
          Tiny Pests unfolds through a chilling collection of recovered audio logs, personal memos,
          and field notes from scientists across the globe. At first, the strange findings seem
          disconnected&emdash;quirky, even fascinating. A virus that makes animals rabid. A wasp
          that turns cockroaches into puppets. Microplastics showing up in places they shouldn't.
        </p>
        <p>
          But with each new log, a darker picture begins to emerge. Something is linking these
          discoveries. Something that's watching. Learning. Spreading.
        </p>
        <p>
          You'll think it's about bugs.<br/>
          You'll wish it were just bugs.
        </p>
        <p>
          <b>Tiny Pests</b> is a slow-burn horror story about science, control, and the terrifying
          realization that your thoughts may not be your own.
        </p>
      </small>
    </section>
  );
};

export default FictionSlide;
