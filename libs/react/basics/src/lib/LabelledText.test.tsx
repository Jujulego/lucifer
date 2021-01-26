import React from 'react';
import { screen, render } from '@testing-library/react';

import { createShallow } from '@material-ui/core/test-utils';
import { Check as CheckIcon } from '@material-ui/icons';

import LabelledText from '../lib/LabelledText';

// Setup
let shallow: ReturnType<typeof createShallow>;

beforeAll(() => {
  shallow = createShallow();
});

// Tests
describe('LabelledText', () => {
  it('should render labelled content', () => {
    // Render
    render(
      <LabelledText label="Label">Content</LabelledText>
    );

    // Check elements
    expect(screen.queryByText('Label')).toBeInTheDocument();

    const content = screen.getByLabelText('Label');
    expect(content).toHaveTextContent('Content');
  });

  it('should render with an icon', () => {
    // Render
    render(
      <LabelledText label="Label" endAdornment={<CheckIcon data-testid='icon' />}>
        Content
      </LabelledText>
    );

    // Check elements
    const content = screen.getByLabelText('Label');
    const icon = screen.getByTestId('icon');

    expect(content.parentElement).toContainElement(icon);
  });

  it('should render with minWidth: 0', () => {
    // Render
    render(
      <LabelledText label="Label" zeroMinWidth>
        Content
      </LabelledText>
    );

    // Check elements
    const content = screen.getByLabelText('Label');
    expect(content).toHaveStyle({ minWidth: 0 });
  });
});
