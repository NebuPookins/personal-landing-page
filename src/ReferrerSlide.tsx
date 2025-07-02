import React from 'react';

interface ReferrerSlideProps {
  domainName: string;
  bucket: string;
}

const ReferrerSlide: React.FC<ReferrerSlideProps> = ({ domainName, bucket }) => {
  let message = "";

  switch (bucket) {
    case "streaming":
      message = `You came from ${domainName}, so you probably know me from streaming!`;
      break;
    case "programming":
      message = `You came from ${domainName}, so you're probably a programmer like me.`;
      break;
    case "writing":
      message = `You came from ${domainName} (a writing platform) — welcome, fellow reader.`;
      break;
    case "social":
      message = `Looks like you clicked over from ${domainName}. Welcome!`;
      break;
    case "professional":
      message = `Welcome from ${domainName}! Glad to connect with you.`;
      break;
    case "unknown":
    default:
      if (domainName && domainName !== "unknown") { // Check if domainName is not the placeholder for invalid URLs
        message = `You came from ${domainName}. Welcome to my personal site!`;
      } else {
        message = "Welcome! It's great to have you here."; // Generic for unparseable or empty referrers
      }
      break;
  }

  return (
    <section
      className="slide"
      style={{ background: "green" }}
    >
      <h1>Referrer Information</h1>
      <p style={{ marginTop: '20px', fontSize: '1.2em' }}>{message}</p>
      <div className="arrow" style={{ marginTop: '30px' }}>↓</div>
    </section>
  );
};

export default ReferrerSlide;
