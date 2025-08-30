import React from 'react';

interface ProgrammingSlideProps {
  id: string;
}

const startedWorkingInSoftware = 2004;

const ProgrammingSlide: React.FC<ProgrammingSlideProps> = ({ id }) => {
  const currentYear = new Date().getFullYear();
  const yearsOfExperience = currentYear - startedWorkingInSoftware;

  return (
    <section
      id={id}
      className="slide"
      style={{ background: "darkslategray" }}
    >
      <h2>Programming</h2>
      <div style={{ maxWidth: '30em', textAlign: 'left', marginLeft: 'auto', marginRight: 'auto' }}>
      <p>I'm a "classically trained" Software Development Engineer with {yearsOfExperience} years of experience.</p>
      <p>By "classically trained", I mean I earned a Bachelor of Computer Science from McGill University before LLMs were a thing.</p>
      <p>I've worked at various small companies you've probably never heard of (fewer than 20 employees), and at Amazon.</p>
      </div>
      <p><a href="https://github.com/NebuPookins" target="_blank" rel="noopener">Browse my GitHub</a></p>
      <div className="arrow">↓</div>
    </section>
  );
};

export default ProgrammingSlide;
