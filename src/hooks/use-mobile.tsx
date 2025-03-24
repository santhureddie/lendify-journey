
import { useState, useEffect } from 'react';

// Define the useMediaQuery hook in the use-mobile file
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    const listener = () => setMatches(media.matches);
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, [matches, query]);

  return matches;
};

// Export the original useMobile hook if it exists
export const useMobile = () => {
  return useMediaQuery('(max-width: 768px)');
};

export default useMobile;
