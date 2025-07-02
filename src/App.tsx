import React from 'react';

interface SlideData {
  id: string;
  type: 'intro' | 'menu' | 'referrer' | 'generic';
  bg: string;
  text?: string;
  extra?: string;
  condition?: () => boolean;
  textFromReferrer?: (ref: string) => string;
  links?: Array<{ label: string; slide: string }>;
}

const content: SlideData[] = [
  {
    id: "referrer",
    type: "referrer",
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
    type: "menu",
    bg: "blue",
    text: "Did you know I'm into all of these things?",
    links: [
      { label: "Streaming", slide: "streaming" },
      { label: "Programming", slide: "programming" },
      { label: "Non-Fiction Writing", slide: "nonfiction" },
      { label: "Fiction Writing", slide: "fiction" },
    ]
  },
  { id: "streaming", type: "generic", bg: "purple", text: '<a href="https://twitch.tv/NebuPookins">Check out my Twitch</a>' },
  { id: "programming", type: "generic", bg: "darkslategray", text: '<a href="https://github.com/NebuPookins">Browse my GitHub</a>' },
  { id: "nonfiction", type: "generic", bg: "orange", text: '<a href="https://nebu.substack.com">Read my essays on Substack</a>' },
  { id: "fiction", type: "generic", bg: "brown", text: 'Fiction writing slide coming soon!' }
];

// import React from 'react'; // React is already imported at the top
import Slide from './Slide';
import IntroSlide from './IntroSlide';
import MenuSlide from './MenuSlide';

// interface SlideData and const content are already defined above and should not be duplicated.

const App: React.FC = () => {
  return (
    <div id="slides">
      <IntroSlide />;
      {content.map(item => {
        switch (item.type) {
          case "menu":
            return <MenuSlide key={item.id} id={item.id} bg={item.bg} title={item.text} items={item.links?.map(link => ({ ...link, href: `#${link.slide}` }))} />;
          case "referrer":
            if (item.condition && !item.condition()) return null;
            const refText = item.textFromReferrer ? item.textFromReferrer(document.referrer) : "Came from another page";
            return <Slide key={`${item.id}-referrer`} id={item.id} bg={item.bg} htmlContent={refText} />;
          case "generic":
          default:
            let htmlContent = item.text || "";
            if (item.extra) { // Generic slides can still use 'extra' if defined
              htmlContent += item.extra;
            }
            return <Slide key={item.id} id={item.id} bg={item.bg} htmlContent={htmlContent} />;
        }
      })}
    </div>
  );
};

export default App;
