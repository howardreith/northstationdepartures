import React, { useEffect, useState } from 'react';
import {
  makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles({
  clockText: {
    color: 'gold',
  },
});

export default function Clock() {
  const [value, setValue] = useState(new Date());
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

  return (
    <div>
      <p>Current time:</p>
      <p className={classes.clockText}>
        {time}
      </p>
    </div>
  );
}
