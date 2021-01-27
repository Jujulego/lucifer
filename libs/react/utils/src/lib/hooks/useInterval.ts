import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import duration, { DurationUnitType } from 'dayjs/plugin/duration';

dayjs.extend(duration);

// Hooks
function useInterval(every: number, unit?: DurationUnitType): number {
  // State
  const [count, setCount] = useState(0);

  // Effects
  useEffect(() => {
    const ms = dayjs.duration(every, unit).milliseconds();
    const interval = setInterval(() => setCount(old => old + 1), ms);

    return () => { clearInterval(interval); }
  }, [every, unit]);

  return count;
}

export default useInterval;
