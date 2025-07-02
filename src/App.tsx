import React from 'react';
import IntroSlide from './IntroSlide';
import MenuSlide from './MenuSlide';
import ReferrerSlide from './ReferrerSlide';
import type { ReferrerBucket } from './ReferrerSlide';
import StreamingSlide from './StreamingSlide';
import ProgrammingSlide from './ProgrammingSlide';
import NonfictionSlide from './NonfictionSlide';
import FictionSlide from './FictionSlide';

interface ReferrerInfo {
  domainName: string;
  bucket: ReferrerBucket;
}

const domainToBucketMap: {[key:string] : ReferrerBucket} = {
  "github.com": "programming",
  "twitch.tv": "streaming",
  "substack.com": "non-fiction",
  "medium.com": "non-fiction",
  "dev.to": "programming",
  "youtube.com": "streaming",
  "linkedin.com": "programming",
}

const getReferrerInfo = (referrer: string): ReferrerInfo | null => {
  if (!referrer || referrer.includes(location.hostname)) {
    return null;
  }

  try {
    const url = new URL(referrer);
    const domain = url.hostname;
    let bucket: ReferrerBucket | null = null;
    for (const [key, value] of Object.entries(domainToBucketMap)) {
      if (domain.includes(key)) {
        bucket = value
        break;
      }
    }
    if (bucket) {
      return { domainName: domain, bucket };
    }
  } catch (e) {
    console.error("Error parsing referrer URL:", e);
  }
  return null;
};

const App: React.FC = () => {
  let testReferrer: { domainName: string, bucket: ReferrerBucket} | null = null;
  //testReferrer = { domainName: "example.com", bucket: "streaming" };
  const referrerInfo = testReferrer || getReferrerInfo(document.referrer);

  const menuItems = [
    { label: "Streaming", slide: "streaming", href: "#streaming" },
    { label: "Programming", slide: "programming", href: "#programming" },
    { label: "Non-Fiction Writing", slide: "nonfiction", href: "#nonfiction" },
    { label: "Fiction Writing", slide: "fiction", href: "#fiction" },
  ];

  return (
    <div id="slides">
      <IntroSlide />
      {referrerInfo && (
        <ReferrerSlide domainName={referrerInfo.domainName} bucket={referrerInfo.bucket} />
      )}
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
