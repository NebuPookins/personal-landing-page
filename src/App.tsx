import React from 'react';

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
  return (
    <div id="slides">
      {content.map(item => {
        if (item.id === "referrer" && item.condition) {
          if (!item.condition()) return null;
          const refText = item.textFromReferrer!(document.referrer);
          // Use a unique key for the referrer slide, as item.id might not be unique if multiple referrers are possible
          return <Slide key={`${item.id}-referrer`} id={item.id} bg={item.bg} htmlContent={refText} />;
        }

        let htmlContent = item.text || "";
        if (item.links) {
          htmlContent += '<ul>' + item.links.map(link => `<li><a href="#${link.slide}">${link.label}</a></li>`).join('') + '</ul>';
        }
        if (item.extra) {
          htmlContent += item.extra;
        }

        return <Slide key={item.id} id={item.id} bg={item.bg} htmlContent={htmlContent} />;
      })}
    </div>
  );
};

export default App;
