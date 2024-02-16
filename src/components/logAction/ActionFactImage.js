import React from 'react';
import { CircularProgress } from '@mui/material';
import { useActionFactImage } from '../../hooks/use-action-fact-image';

const ActionFactImage = () => {
  const { randomImage, isLoading } = useActionFactImage();

  return !isLoading ? (
    randomImage ? (
      <figure
        style={{
          position: 'relative',
          margin: '1.5rem auto',
        }}
      >
        <img
          height="250px"
          src={randomImage['Thumb228']}
          alt={randomImage?.title}
          style={{ borderRadius: '1.5rem' }}
        />
        <figcaption
          style={{
            position: 'absolute',
            bottom: '1rem',
            right: '10px',
            color: 'white',
            fontSize: '14px',
            background: 'rgba(1,1,1,0.25)',
          }}
        >
          Photo by {randomImage['Artist']} from {randomImage['Country']}
        </figcaption>
      </figure>
    ) : null
  ) : (
    <CircularProgress />
  );
};

export default ActionFactImage;
