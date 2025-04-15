'use client';
import { useEffect, useState } from 'react';

export default function ThemePage() {
  // Flag to track if we're coming from external site (by clicking back)
  const [isFromExternal, setIsFromExternal] = useState(false);
  
  useEffect(() => {
    // If this is a fresh page load (not from clicking back)
    // we need to determine if we came from the game or the external site
    
    // This will run only once when the component mounts
    const referrer = document.referrer;
    
    // If referrer is the external site or empty (might be empty when clicking back)
    if (!referrer || !referrer.includes(window.location.host)) {
      setIsFromExternal(true);
    }
    
    // If we're not coming from external, and this is the initial load from the game
    // we shouldn't show this page (the redirect will happen from the game page)
  }, []);
  
  return (
    <div>
      {isFromExternal ? (
        // Show theme reveal content when coming back from external site
        <div className="theme-reveal-container">
          <h1>Theme Revealed!</h1>
          {/* Your theme reveal content */}
        </div>
      ) : (
        // Show nothing or a loading state when redirecting to external
        <div className="loading">Redirecting...</div>
      )}
    </div>
  );
}