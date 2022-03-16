import React from 'react';
import { styled } from '@mui/material';

const MainSection = styled('div')({
  boxSizing: 'border-box',
  width: '80%',
  margin: '50px auto 120px',
});

const Section = (props) => {
  return (
    <MainSection className={props.className}>{props.children}</MainSection>
  );
};

export default Section;
