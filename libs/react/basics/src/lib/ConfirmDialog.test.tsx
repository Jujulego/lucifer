import React, { useEffect } from 'react';
import { ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { createMount, createShallow } from '@material-ui/core/test-utils';

import ConfirmDialog from './ConfirmDialog';
import { useConfirm } from './confirm.hooks';

// Setup
let mount: ReturnType<typeof createMount>;
let shallow: ReturnType<typeof createShallow>;

beforeAll(() => {
  mount = createMount();
  shallow = createShallow();
});

afterAll(() => {
  mount.cleanUp();
});

// Tests
describe('ConfirmDialog', () => {
  it('should be closed and empty', () => {
    const TestComponent = () => {
      const { state } = useConfirm("");

      return (
        <ConfirmDialog state={state}>
          {(txt) => txt}
        </ConfirmDialog>
      )
    };

    // Render
    const wrapper = shallow(<TestComponent />).dive();

    expect(wrapper).toMatchSnapshot();
  });

  it('should be opened with content', () => {
    const TestComponent = () => {
      const { state, confirm } = useConfirm("");
      if (!state.open) confirm("Test");

      return (
        <ConfirmDialog state={state}>
          {(txt) => txt}
        </ConfirmDialog>
      )
    };

    // Render
    const wrapper = shallow(<TestComponent />).dive();

    expect(wrapper).toMatchSnapshot();
  });
});

describe('useConfirm().confirm', () => {
  // Setup
  let spy: jest.Mock<void,[boolean]>;

  let release: () => void;
  let waiter: Promise<void>;

  let wrapper: ReactWrapper;

  beforeEach(() => {
    // Utils
    spy = jest.fn();
    waiter = new Promise<void>(resolve => {
      release = resolve;
    });

    // Component
    const TestComponent = () => {
      const { state, confirm } = useConfirm("");

      useEffect(() => {
        confirm("Test")
          .then(spy)
          .finally(release);
      }, [confirm]);

      return (
        <ConfirmDialog state={state}>
          { (txt) => txt }
        </ConfirmDialog>
      )
    };

    // Render
    wrapper = mount(<TestComponent />);
  });

  // Tests
  it('should return false if canceled', async () => {
    // should have 2 buttons
    const buttons = wrapper.find('button');
    expect(buttons).toHaveLength(2);

    // 1st should contain "Annuler"
    const btn = buttons.first();
    expect(btn.text()).toBe('Annuler');

    // Act event
    act(() => {
      btn.simulate('click');
    });

    await waiter;
    expect(spy).toBeCalledWith(false);
  });

  it('should return true if confirmed', async () => {
    // should have 2 buttons
    const buttons = wrapper.find('button');
    expect(buttons).toHaveLength(2);

    // 2nd should contain "Confirmer"
    const btn = buttons.last();
    expect(btn.text()).toBe('Confirmer');

    // Act event
    act(() => {
      btn.simulate('click');
    });

    await waiter;
    expect(spy).toBeCalledWith(true);
  });
});
