import { useState, useEffect } from 'react';

export const useActionFactImage = () => {
  //Find a default image to use
  const [randomImage, setRandomImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchImages = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(
        'https://research.tigweb.org/gg/api/submissions/4965'
      );
      const data = await res.json();
      setRandomImage(
        data?.result[Math.floor(Math.random() * data?.result.length)]
      );
      setIsLoading(false);
    } catch (error) {
      setError(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return { randomImage, isLoading, error };
};
