import React from 'react';

interface NonfictionSlideProps {
  id: string;
}

const posts = [
{title: "From Hot Dogs to Parallel Universes: The Hidden Politics of Scientific Labels", url: "https://open.substack.com/pub/nebu/p/from-hot-dogs-to-parallel-universes?r=7fgws&utm_campaign=post&utm_medium=web&showWelcomeOnShare=true", image: "substack-hotdog.jpg"},
{title: "The Convenient Myth of Experimental Rigor in Science", url: "https://open.substack.com/pub/nebu/p/the-convenient-myth-of-experimental?r=7fgws&utm_campaign=post&utm_medium=web&showWelcomeOnShare=true", image: "substack-scientific-rigor.jpg"},
{title: "The GPU Coincidence: How Hardware Compatibility May Be Shaping the Future of AI", url: "https://open.substack.com/pub/nebu/p/the-gpu-coincidence-how-hardware?r=7fgws&utm_campaign=post&utm_medium=web&showWelcomeOnShare=true", image: "substack-gpu-coincidence.jpg"}
];

const NonfictionSlide: React.FC<NonfictionSlideProps> = ({ id }) => {
  return (
    <section
      id={id}
      className="slide"
      style={{ background: "orange" }}
    >
      <h2>Non-Fiction Writing</h2>
      <p><a href="https://nebu.substack.com" target="_blank" rel="noopener">Read my essays on Substack</a></p>
      
      <div className="posts-grid">
        {posts.map((post, index) => (
          <a 
            key={index}
            href={post.url} 
            target="_blank" 
            rel="noopener"
            className="post-thumbnail"
          >
            <img src={`${post.image}`} alt={post.title} />
          </a>
        ))}
      </div>
      
      <div className="arrow">↓</div>
    </section>
  );
};

export default NonfictionSlide;
