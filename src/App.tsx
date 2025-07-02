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
  // The "referrer" entry is removed from here as it's handled directly above the map.
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
import ReferrerSlide from './ReferrerSlide'; // Import the new component

// interface SlideData and const content are already defined above and should not be duplicated.

const App: React.FC = () => {
  const shouldShowReferrerSlide = !!(document.referrer && !document.referrer.includes(location.hostname));

  return (
    <div id="slides">
      <IntroSlide />
      {shouldShowReferrerSlide && <ReferrerSlide />}
      {content.map(item => {
        // Filter out any potential "referrer" type items from content array if they were missed,
        // though it should have been removed.
        if (item.type === "referrer") return null;

        switch (item.type) {
          case "menu":
            return <MenuSlide key={item.id} id={item.id} bg={item.bg} title={item.text} items={item.links?.map(link => ({ ...link, href: `#${link.slide}` }))} />;
          // case "referrer": // This case is now removed
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
