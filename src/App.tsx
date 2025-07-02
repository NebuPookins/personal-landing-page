import React from 'react';
import IntroSlide from './IntroSlide';
import MenuSlide from './MenuSlide';
import ReferrerSlide from './ReferrerSlide';
import StreamingSlide from './StreamingSlide';
import ProgrammingSlide from './ProgrammingSlide';
import NonfictionSlide from './NonfictionSlide';
import FictionSlide from './FictionSlide';

const App: React.FC = () => {
  const shouldShowReferrerSlide = !!(document.referrer && !document.referrer.includes(location.hostname));

  const menuItems = [
    { label: "Streaming", slide: "streaming", href: "#streaming" },
    { label: "Programming", slide: "programming", href: "#programming" },
    { label: "Non-Fiction Writing", slide: "nonfiction", href: "#nonfiction" },
    { label: "Fiction Writing", slide: "fiction", href: "#fiction" },
  ];

  return (
    <div id="slides">
      <IntroSlide />
      {shouldShowReferrerSlide && <ReferrerSlide />}
      <MenuSlide
        id="menu"
        bg="blue"
        title="Did you know I'm into all of these things?"
        items={menuItems}
      />
      <StreamingSlide id="streaming" />
      <ProgrammingSlide id="programming" />
      <NonfictionSlide id="nonfiction" />
      <FictionSlide id="fiction" />
    </div>
  );
};

export default App;
