import React from 'react';
import IntroSlide from './IntroSlide';
import MenuSlide from './MenuSlide';
import ReferrerSlide from './ReferrerSlide';
import StreamingSlide from './StreamingSlide';
import ProgrammingSlide from './ProgrammingSlide';
import NonfictionSlide from './NonfictionSlide';
import FictionSlide from './FictionSlide';

interface ReferrerInfo {
  domainName: string;
  bucket: string;
}

const getReferrerInfo = (referrer: string): ReferrerInfo | null => {
  if (!referrer || referrer.includes(location.hostname)) {
    return null;
  }

  try {
    const url = new URL(referrer);
    const domain = url.hostname;
    let bucket = "unknown";

    if (domain.includes("twitch.tv")) {
      bucket = "streaming";
    } else if (domain.includes("github.com")) {
      bucket = "programming";
    } else if (domain.includes("substack.com") || domain.includes("medium.com")) {
      bucket = "writing";
    } else if (domain.includes("dev.to")) {
      bucket = "programming";
    } else if (domain.includes("youtube.com")) {
      bucket = "streaming";
    } else if (domain.includes("linkedin.com")) {
      bucket = "professional";
    } else if (domain.includes("twitter.com") || domain.includes("x.com")) {
      bucket = "social";
    }
    return { domainName: domain, bucket };
  } catch (e) {
    console.error("Error parsing referrer URL:", e);
    // For invalid URLs, we might still want to show a generic message
    // or treat as 'unknown' but without a valid domain.
    // For now, returning a generic "unknown" bucket and the raw referrer as domain.
    return { domainName: referrer, bucket: "unknown" };
  }
};

const App: React.FC = () => {
  const referrerInfo = getReferrerInfo(document.referrer);
  const shouldShowReferrerSlide = !!referrerInfo;

  const menuItems = [
    { label: "Streaming", slide: "streaming", href: "#streaming" },
    { label: "Programming", slide: "programming", href: "#programming" },
    { label: "Non-Fiction Writing", slide: "nonfiction", href: "#nonfiction" },
    { label: "Fiction Writing", slide: "fiction", href: "#fiction" },
  ];

  return (
    <div id="slides">
      <IntroSlide />
      {shouldShowReferrerSlide && referrerInfo && (
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
