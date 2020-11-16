import { useEffect, useState } from 'react';
import moment from 'moment';

// Hooks
function useInterval(every: number, unit?: moment.DurationInputArg2): number {
  // State
  const [count, setCount] = useState(0);

  // Effects
  useEffect(() => {
    const ms = moment.duration(every, unit).milliseconds();
    const interval = setInterval(() => setCount(old => old + 1), ms);

    return () => { clearInterval(interval); }
  }, [every, unit]);

  return count;
}

export default useInterval;