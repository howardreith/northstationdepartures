import React, { useEffect } from 'react';

export default function MbtaBoardPage() {
  useEffect(() => {
    console.log('===> yo')
    fetch('https://api-v3.mbta.com/predictions?sort=arrival_time&filter%5Bdirection_id%5D=1')
      .then((res) => console.log('====> res', res));
  }, []);

  return <div>I am here</div>;
}
