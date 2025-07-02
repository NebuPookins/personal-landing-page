import React from 'react';
import type { JSX } from 'react';

export type ReferrerBucket = "streaming" | "programming" | "non-fiction" | "fiction"

interface ReferrerSlideProps {
  domainName: string;
  bucket: ReferrerBucket;
}

const messageMap: {[K in ReferrerBucket]: (s: string) => JSX.Element} = {
  "streaming": (domain) => <p style={{ marginTop: '20px', fontSize: '1.2em' }}>You came from {domain}, so you probably know me from streaming!</p>,
  "programming": (domain) => <p style={{ marginTop: '20px', fontSize: '1.2em' }}>You came from {domain}, so you probably know me from one of my programming projects!</p>,
  "fiction": (domain) => <p style={{ marginTop: '20px', fontSize: '1.2em' }}>You came from {domain}, so you probably know me from one of my contrarian articles!</p>,
  "non-fiction": (domain) => <p style={{ marginTop: '20px', fontSize: '1.2em' }}>You came from {domain}, so you probably know me from one of my works of fiction!</p>,
}

const ReferrerSlide: React.FC<ReferrerSlideProps> = ({ domainName, bucket }) => {
  return (<section
      className="slide"
      style={{ background: "green" }}
    >
      {messageMap[bucket](domainName)}
      <div className="arrow" style={{ marginTop: '30px' }}>↓</div>
    </section>
  );
};

export default ReferrerSlide;
