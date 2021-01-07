import React, { FC, useMemo } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { useInterval } from '@lucifer/react/utils';

dayjs.extend(relativeTime);

// Types
type Mode = "from" | "to";

export interface RelativeDateProps {
  date: dayjs.ConfigType;
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
  const date = useMemo(() => dayjs(input), [input]);

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
