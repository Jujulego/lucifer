import React, { FC, useMemo } from 'react';
import moment from 'moment';

import { useInterval } from '@lucifer/react/utils';

// Types
type Mode = "from" | "to";

export interface RelativeDateProps {
  date: moment.MomentInput;
  mode: Mode;

  /**
   * @default false
   */
  withoutPrefix?: boolean;
}

// Component
const RelativeDate: FC<RelativeDateProps> = (props) => {
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
  return ( // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      { mode === "to" ? date.toNow(withoutPrefix) : date.fromNow(withoutPrefix) }
    </>
  );
};

export default RelativeDate;
