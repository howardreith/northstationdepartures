import React, { useEffect, useState } from 'react';
import {
  makeStyles, Box,
} from '@material-ui/core';
import * as PropTypes from 'prop-types';

const useStyles = makeStyles({
  clockText: {
    color: 'gold',
    margin: 0,
  },
});

export default function Clock(props) {
  const [value, setValue] = useState(new Date());
  const { isTime } = props;
  const classes = useStyles();

  useEffect(() => {
    const interval = setInterval(
      () => setValue(new Date()),
      1000,
    );

    return () => {
      clearInterval(interval);
    };
  }, []);

  let time = value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (time[0] === '0') {
    time = time.replace('0', '');
  }
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeek = days[value.getDay()];
  const date = value.toLocaleDateString().replace(/\//g, '-');

  if (!isTime) {
    return (
      <Box>
        <p className={classes.clockText}>CURRENT TIME</p>
        <p className={classes.clockText}>
          {time}
        </p>
      </Box>
    );
  }
  return (
    <Box>
      <p className={classes.clockText}>{dayOfWeek}</p>
      <p className={classes.clockText}>
        {date}
      </p>
    </Box>
  );
}

Clock.propTypes = {
  isTime: PropTypes.bool.isRequired,
};
