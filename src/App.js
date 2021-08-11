import React from 'react';
import './App.css';
import {
  Box, makeStyles,
} from '@material-ui/core';
import MbtaBoardPage from './components/mbtaBoard/MbtaBoardPage';
import backgroundImage from './resources/northSationBackground.jpeg';

const useStyles = makeStyles({
  appWrapper: {
    backgroundImage: `url(${backgroundImage})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%',
    height: '100vh',
    width: '100%',
    margin: 0,
    position: 'fixed',
  },
});

function App() {
  const classes = useStyles();
  return (
    <Box className={classes.appWrapper}>
      <Box>
        <MbtaBoardPage />
      </Box>
    </Box>
  );
}

export default App;
