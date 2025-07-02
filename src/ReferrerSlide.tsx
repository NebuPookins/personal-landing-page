import React, { useEffect, useState } from 'react';

interface ReferrerSlideProps {
  // No props needed for now, content is determined internally
}

const ReferrerSlide: React.FC<ReferrerSlideProps> = ({}) => {
  const [referrerText, setReferrerText] = useState<string>('');

  useEffect(() => {
    // Logic moved from App.tsx
    const ref = document.referrer;
    let text = "Welcome!"; // Default text

    if (ref && !ref.includes(location.hostname)) {
      if (ref.includes("twitch.tv")) {
        text = "You came from Twitch, so you probably know me from Streaming.";
      } else if (ref.includes("github.com")) {
        text = "You came from GitHub, so you're probably a programmer like me.";
      } else if (ref.includes("substack.com")) {
        text = "You came from Substack — welcome, fellow reader.";
      } else {
        try {
          text = `You came from ${new URL(ref).hostname}`;
        } catch (e) {
          // if ref is not a valid URL, use a generic message or the ref itself if desired
          text = `You came from an external page.`;
        }
      }
    } else {
      // This case might not be reached if App.tsx's condition prevents rendering,
      // but as a fallback or if used directly:
      text = "It seems you navigated here directly or from within the site.";
    }
    setReferrerText(text);
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <section
      className="slide"
      style={{ background: "green" }}
    >
      <h1>Referrer Information</h1>
      <p style={{ marginTop: '20px', fontSize: '1.2em' }}>{referrerText}</p>
      {/* Input field removed as per new direction to match existing behavior which was text-based */}
      <div className="arrow" style={{ marginTop: '30px' }}>↓</div>
    </section>
  );
};

export default ReferrerSlide;
