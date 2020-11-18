import React, { useMemo } from 'react';
import moment from 'moment';

import { useInterval } from '@lucifer/react/utils';

// Types
type Mode = "from" | "to";

export interface RelativeDateProps {
  date: moment.MomentInput,
  mode: Mode,
  withoutPrefix?: boolean
}

// Component
const RelativeDate = (props: RelativeDateProps) => {
  // Props
  const {
    date: input,
    mode, withoutPrefix
  } = props;

  // Memo
  const date = useMemo(() => moment(input), [input]);

  // Interval
  useInterval(1, 'minute');

  // Render
  return (
    <>
      { mode === "to" ? date.toNow(withoutPrefix) : date.fromNow(withoutPrefix) }
    </>
  );
};

export default RelativeDate;
