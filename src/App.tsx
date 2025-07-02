import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

interface SlideData {
  id: string;
  bg: string;
  text?: string;
  extra?: string;
  condition?: () => boolean;
  textFromReferrer?: (ref: string) => string;
  links?: Array<{ label: string; slide: string }>;
}

const content: SlideData[] = [
  {
    id: "intro",
    bg: "red",
    text: "Hi, I'm Nebu Pookins",
    extra: '<div class="arrow">↓</div>'
  },
  {
    id: "referrer",
    bg: "green",
    condition: () => !!(document.referrer && !document.referrer.includes(location.hostname)),
    textFromReferrer: (ref: string) => {
      if (ref.includes("twitch.tv")) return "You came from Twitch, so you probably know me from Streaming.";
      if (ref.includes("github.com")) return "You came from GitHub, so you're probably a programmer like me.";
      if (ref.includes("substack.com")) return "You came from Substack — welcome, fellow reader.";
      return `You came from ${new URL(ref).hostname}`;
    },
  },
  {
    id: "menu",
    bg: "blue",
    text: "Did you know I'm into all of these things?",
    links: [
      { label: "Streaming", slide: "streaming" },
      { label: "Programming", slide: "programming" },
      { label: "Non-Fiction Writing", slide: "nonfiction" },
      { label: "Fiction Writing", slide: "fiction" },
    ]
  },
  { id: "streaming", bg: "purple", text: '<a href="https://twitch.tv/NebuPookins">Check out my Twitch</a>' },
  { id: "programming", bg: "darkslategray", text: '<a href="https://github.com/NebuPookins">Browse my GitHub</a>' },
  { id: "nonfiction", bg: "orange", text: '<a href="https://nebu.substack.com">Read my essays on Substack</a>' },
  { id: "fiction", bg: "brown", text: 'Fiction writing slide coming soon!' }
];

import Slide from './Slide';

const App: React.FC = () => {
  const smoother = useRef<ScrollSmoother | null>(null);
  const main = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (main.current) {
      smoother.current = ScrollSmoother.create({
        smooth: 1, // seconds it takes to "catch up" to native scroll position
        effects: true, // look for data-speed and data-lag attributes on elements
        smoothTouch: 0.1, // much shorter smoothing time on touch devices (default is NO smoothing on touch)
      });

      // Pin each slide and snap to it
      document.querySelectorAll<HTMLElement>(".slide").forEach((slide, index, slides) => {
        ScrollTrigger.create({
          trigger: slide,
          pin: true,
          pinSpacing: false, // No extra space added when pinning
          start: "top top",
          end: () => `+=${slide.offsetHeight}`, // End when the slide is fully scrolled
          snap: {
            snapTo: 1 / (slides.length -1), // Snap to the start of each slide
            duration: { min: 0.2, max: 0.6 }, // Snap animation duration
            delay: 0, // No delay before snapping
            ease: "power1.inOut"
          }
        });
      });
    }
    return () => {
      if (smoother.current) {
        smoother.current.kill();
      }
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <div id="smooth-wrapper" ref={main}>
      <div id="smooth-content">
        <div id="slides">
          {content.map(item => {
            if (item.id === "referrer" && item.condition) {
              if (!item.condition()) return null;
              const refText = item.textFromReferrer!(document.referrer);
              return <Slide key={`${item.id}-referrer`} id={item.id} bg={item.bg} htmlContent={refText} />;
            }

            let htmlContent = item.text || "";
            if (item.links) {
              htmlContent += '<ul>' + item.links.map(link => `<li><a href="#${link.slide}" onClick={(e) => { e.preventDefault(); smoother.current?.scrollTo(\`#${link.slide}\`, true);}} >${link.label}</a></li>`).join('') + '</ul>';
            }
            if (item.extra) {
              htmlContent += item.extra;
            }

            return <Slide key={item.id} id={item.id} bg={item.bg} htmlContent={htmlContent} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default App;
