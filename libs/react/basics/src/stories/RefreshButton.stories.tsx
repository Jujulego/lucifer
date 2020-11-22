import React, { useEffect, useState } from 'react';
import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';

import RefreshButton from '../lib/RefreshButton';

// Stories
export default {
  title: 'Basics/RefreshButton',
  component: RefreshButton
}

export const Usable = () => {
  // State
  const [loading, setLoading] = useState(false);

  // Effect
  useEffect(() => {
    if (loading) {
      const id = setTimeout(() => setLoading(false), 5000);
      return () => clearTimeout(id);
    }
  }, [loading, setLoading]);

  // Handlers
  const handleClick = () => {
    action('click')();
    setLoading(true);
  };

  // Render
  return (
    <RefreshButton
      refreshing={loading}
      onClick={handleClick}
    />
  );
};

export const Playable = () => {
  // Render
  return (
    <RefreshButton
      refreshing={boolean('refreshing', false)}
      onClick={action('click')}
    />
  );
};
