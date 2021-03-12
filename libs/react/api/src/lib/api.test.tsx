import React, { FC } from 'react';
import axios from 'axios';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApiCache, useAPI } from '@lucifer/react-api';

// Types
interface TestGetProps {
  url: string;
}

interface TestPostProps extends TestGetProps {
  callback: (data: string) => void;
}

// Mocks
beforeEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

// Test suites
describe('useAPI.get', () => {
  const TestComponent: FC<TestGetProps> = ({ url }) => {
    const { data, loading, reload, update } = useAPI.get<string>(url);

    return (
      <div>
        <div data-testid="loading">{ loading ? 'loading' : 'loaded' }</div>
        <div data-testid="response">{ data }</div>
        <button data-testid="reload" onClick={() => reload()} />
        <button data-testid="update" onClick={() => update('cache')} />
      </div>
    );
  };

  beforeEach(() => {
    jest.spyOn(axios, 'get')
      .mockResolvedValue({ data: 'get' });
  });

  // Tests
  it('should call axios.get', async () => {
    // Render
    render(
      <ApiCache>
        <TestComponent url='test' />
      </ApiCache>
    );

    // Return
    const loading = screen.getByTestId('loading');
    const response = screen.getByTestId('response');

    expect(loading).toHaveTextContent('loading');
    expect(response).toHaveTextContent('');

    // Wait for answer
    await waitFor(() => {
      expect(loading).toHaveTextContent('loaded');
      expect(response).toHaveTextContent('get');
    });

    expect(axios.get).toBeCalledWith('test', {
      cancelToken: expect.anything(),
    });
  });

  it('should update cache', async () => {
    // Render
    render(
      <ApiCache>
        <TestComponent url='test' />
      </ApiCache>
    );

    // Return
    const loading = screen.getByTestId('loading');
    const response = screen.getByTestId('response');
    const update = screen.getByTestId('update');

    expect(loading).toHaveTextContent('loading');
    expect(response).toHaveTextContent('');

    // Wait for answer
    await waitFor(() => {
      expect(loading).toHaveTextContent('loaded');
      expect(response).toHaveTextContent('get');
    });

    // Update cache
    userEvent.click(update);

    expect(loading).toHaveTextContent('loaded');
    expect(response).toHaveTextContent('cache');
  });

  it('should reload', async () => {
    // Render
    render(
      <ApiCache>
        <TestComponent url='test' />
      </ApiCache>
    );

    // Return
    const loading = screen.getByTestId('loading');
    const response = screen.getByTestId('response');
    const reload = screen.getByTestId('reload');

    expect(loading).toHaveTextContent('loading');
    expect(response).toHaveTextContent('');

    // Wait for answer
    await waitFor(() => {
      expect(loading).toHaveTextContent('loaded');
      expect(response).toHaveTextContent('get');
    });

    // Reload
    (axios.get as jest.Mock)
      .mockResolvedValue({ data: 'cache' });

    userEvent.click(reload);

    expect(loading).toHaveTextContent('loading');
    expect(response).toHaveTextContent('get');

    // Wait for reload answer
    await waitFor(() => {
      expect(loading).toHaveTextContent('loaded');
      expect(response).toHaveTextContent('cache');
    });
  });

  it('should warn without cache', async () => {
    jest.spyOn(console, 'warn')
      .mockReturnValue();

    // Render
    render(
      <TestComponent url='test' />
    );

    // Return
    const loading = screen.getByTestId('loading');

    // Wait for answer
    await waitFor(() => {
      expect(loading).toHaveTextContent('loaded');
    });

    expect(console.warn).toBeCalledWith(expect.any(String));
  });
});

describe('useAPI.head', () => {
  const TestComponent: FC<TestGetProps> = ({ url }) => {
    const { data, loading, reload, update } = useAPI.head<string>(url);

    return (
      <div>
        <div data-testid="loading">{ loading ? 'loading' : 'loaded' }</div>
        <div data-testid="response">{ data }</div>
        <button data-testid="reload" onClick={() => reload()} />
        <button data-testid="update" onClick={() => update('cache')} />
      </div>
    );
  };

  beforeEach(() => {
    jest.spyOn(axios, 'head')
      .mockResolvedValue({ data: 'head' });
  });

  // Tests
  it('should call axios.head', async () => {
    jest.spyOn(axios, 'head')
      .mockResolvedValue({ data: 'head' });

    // Render
    render(
      <ApiCache>
        <TestComponent url='test' />
      </ApiCache>
    );

    // Return
    const loading = screen.getByTestId('loading');
    const response = screen.getByTestId('response');

    expect(loading).toHaveTextContent('loading');
    expect(response).toHaveTextContent('');

    // Wait for answer
    await waitFor(() => {
      expect(loading).toHaveTextContent('loaded');
      expect(response).toHaveTextContent('head');
    });

    expect(axios.head).toBeCalledWith('test', {
      cancelToken: expect.anything(),
    });
  });

  it('should update cache', async () => {
    // Render
    render(
      <ApiCache>
        <TestComponent url='test' />
      </ApiCache>
    );

    // Return
    const loading = screen.getByTestId('loading');
    const response = screen.getByTestId('response');
    const update = screen.getByTestId('update');

    expect(loading).toHaveTextContent('loading');
    expect(response).toHaveTextContent('');

    // Wait for answer
    await waitFor(() => {
      expect(loading).toHaveTextContent('loaded');
      expect(response).toHaveTextContent('head');
    });

    // Update cache
    userEvent.click(update);

    expect(loading).toHaveTextContent('loaded');
    expect(response).toHaveTextContent('cache');
  });

  it('should reload', async () => {
    // Render
    render(
      <ApiCache>
        <TestComponent url='test' />
      </ApiCache>
    );

    // Return
    const loading = screen.getByTestId('loading');
    const response = screen.getByTestId('response');
    const reload = screen.getByTestId('reload');

    expect(loading).toHaveTextContent('loading');
    expect(response).toHaveTextContent('');

    // Wait for answer
    await waitFor(() => {
      expect(loading).toHaveTextContent('loaded');
      expect(response).toHaveTextContent('head');
    });

    // Reload
    (axios.head as jest.Mock)
      .mockResolvedValue({ data: 'cache' });

    userEvent.click(reload);

    expect(loading).toHaveTextContent('loading');
    expect(response).toHaveTextContent('head');

    // Wait for reload answer
    await waitFor(() => {
      expect(loading).toHaveTextContent('loaded');
      expect(response).toHaveTextContent('cache');
    });
  });

  it('should warn without cache', async () => {
    jest.spyOn(console, 'warn')
      .mockReturnValue();

    // Render
    render(
      <TestComponent url='test' />
    );

    // Return
    const loading = screen.getByTestId('loading');

    // Wait for answer
    await waitFor(() => {
      expect(loading).toHaveTextContent('loaded');
    });

    expect(console.warn).toBeCalledWith(expect.any(String));
  });
});

describe('useAPI.options', () => {
  const TestComponent: FC<TestGetProps> = ({ url }) => {
    const { data, loading, reload, update } = useAPI.options<string>(url);

    return (
      <div>
        <div data-testid="loading">{ loading ? 'loading' : 'loaded' }</div>
        <div data-testid="response">{ data }</div>
        <button data-testid="reload" onClick={() => reload()} />
        <button data-testid="update" onClick={() => update('cache')} />
      </div>
    );
  };

  beforeEach(() => {
    jest.spyOn(axios, 'options')
      .mockResolvedValue({ data: 'options' });
  });

  // Tests
  it('should call axios.options', async () => {
    jest.spyOn(axios, 'options')
      .mockResolvedValue({ data: 'options' });

    // Render
    render(
      <ApiCache>
        <TestComponent url='test' />
      </ApiCache>
    );

    // Return
    const loading = screen.getByTestId('loading');
    const response = screen.getByTestId('response');

    expect(loading).toHaveTextContent('loading');
    expect(response).toHaveTextContent('');

    // Wait for answer
    await waitFor(() => {
      expect(loading).toHaveTextContent('loaded');
      expect(response).toHaveTextContent('options');
    });

    expect(axios.options).toBeCalledWith('test', {
      cancelToken: expect.anything(),
    });
  });

  it('should update cache', async () => {
    // Render
    render(
      <ApiCache>
        <TestComponent url='test' />
      </ApiCache>
    );

    // Return
    const loading = screen.getByTestId('loading');
    const response = screen.getByTestId('response');
    const update = screen.getByTestId('update');

    expect(loading).toHaveTextContent('loading');
    expect(response).toHaveTextContent('');

    // Wait for answer
    await waitFor(() => {
      expect(loading).toHaveTextContent('loaded');
      expect(response).toHaveTextContent('options');
    });

    // Update cache
    userEvent.click(update);

    expect(loading).toHaveTextContent('loaded');
    expect(response).toHaveTextContent('cache');
  });

  it('should reload', async () => {
    // Render
    render(
      <ApiCache>
        <TestComponent url='test' />
      </ApiCache>
    );

    // Return
    const loading = screen.getByTestId('loading');
    const response = screen.getByTestId('response');
    const reload = screen.getByTestId('reload');

    expect(loading).toHaveTextContent('loading');
    expect(response).toHaveTextContent('');

    // Wait for answer
    await waitFor(() => {
      expect(loading).toHaveTextContent('loaded');
      expect(response).toHaveTextContent('options');
    });

    // Reload
    (axios.options as jest.Mock)
      .mockResolvedValue({ data: 'cache' });

    userEvent.click(reload);

    expect(loading).toHaveTextContent('loading');
    expect(response).toHaveTextContent('options');

    // Wait for reload answer
    await waitFor(() => {
      expect(loading).toHaveTextContent('loaded');
      expect(response).toHaveTextContent('cache');
    });
  });

  it('should warn without cache', async () => {
    jest.spyOn(console, 'warn')
      .mockReturnValue();

    // Render
    render(
      <TestComponent url='test' />
    );

    // Return
    const loading = screen.getByTestId('loading');

    // Wait for answer
    await waitFor(() => {
      expect(loading).toHaveTextContent('loaded');
    });

    expect(console.warn).toBeCalledWith(expect.any(String));
  });
});

describe('useAPI.delete', () => {
  const TestComponent: FC<TestPostProps> = ({ url, callback }) => {
    const { data, loading, send } = useAPI.delete<string>(url);

    return (
      <div>
        <div data-testid="loading">{ loading ? 'loading' : 'loaded' }</div>
        <div data-testid="response">{ data }</div>
        <button data-testid="send" onClick={() => send({ test: true }).then(callback)} />
      </div>
    );
  };

  beforeEach(() => {
    jest.spyOn(axios, 'delete')
      .mockResolvedValue({ data: 'delete' });
  });

  // Tests
  it('should call axios.delete and return answer', async () => {
    const spy = jest.fn();

    // Render
    render(
      <TestComponent url='test' callback={spy} />
    );

    // Return
    const loading = screen.getByTestId('loading');
    const response = screen.getByTestId('response');
    const send = screen.getByTestId('send');

    expect(loading).toHaveTextContent('loaded');
    expect(response).toHaveTextContent('');

    // Emit request
    userEvent.click(send);
    expect(loading).toHaveTextContent('loading');
    expect(response).toHaveTextContent('');

    // Wait for answer
    await waitFor(() => {
      expect(loading).toHaveTextContent('loaded');
      expect(response).toHaveTextContent('delete');
    });

    expect(axios.delete).toBeCalledWith('test', {
      params: { test: true },
      cancelToken: expect.anything(),
    });

    expect(spy).toBeCalledWith('delete');
  });

  it('should call axios.delete with custom url', async () => {
    const TestComponent: FC<TestGetProps> = ({ url }) => {
      const { loading, send } = useAPI.delete<string>(url);

      return (
        <div>
          <div data-testid="loading">{ loading ? 'loading' : 'loaded' }</div>
          <button data-testid="send" onClick={() => send('other-url', { test: true })} />
        </div>
      );
    };

    // Render
    render(
      <TestComponent url='test' />
    );

    // Return
    const loading = screen.getByTestId('loading');
    const send = screen.getByTestId('send');

    // Emit request
    userEvent.click(send);

    // Wait for answer
    await waitFor(() => {
      expect(loading).toHaveTextContent('loaded');
    });

    expect(axios.delete).toBeCalledWith('other-url', {
      params: { test: true },
      cancelToken: expect.anything(),
    });
  });
});

describe('useAPI.post', () => {
  const TestComponent: FC<TestPostProps> = ({ url, callback }) => {
    const { data, loading, send } = useAPI.post<string,string>(url);

    return (
      <div>
        <div data-testid="loading">{ loading ? 'loading' : 'loaded' }</div>
        <div data-testid="response">{ data }</div>
        <button data-testid="send" onClick={() => send('test').then(callback)} />
      </div>
    );
  };

  beforeEach(() => {
    jest.spyOn(axios, 'post')
      .mockResolvedValue({ data: 'post' });
  });

  // Tests
  it('should call axios.post and return answer', async () => {
    const spy = jest.fn();

    // Render
    render(
      <TestComponent url='test' callback={spy} />
    );

    // Return
    const loading = screen.getByTestId('loading');
    const response = screen.getByTestId('response');
    const send = screen.getByTestId('send');

    expect(loading).toHaveTextContent('loaded');
    expect(response).toHaveTextContent('');

    // Emit request
    userEvent.click(send);
    expect(loading).toHaveTextContent('loading');
    expect(response).toHaveTextContent('');

    // Wait for answer
    await waitFor(() => {
      expect(loading).toHaveTextContent('loaded');
      expect(response).toHaveTextContent('post');
    });

    expect(axios.post).toBeCalledWith('test', 'test', {
      params: {},
      cancelToken: expect.anything(),
    });

    expect(spy).toBeCalledWith('post');
  });
});

describe('useAPI.put', () => {
  const TestComponent: FC<TestPostProps> = ({ url, callback }) => {
    const { data, loading, send } = useAPI.put<string,string>(url);

    return (
      <div>
        <div data-testid="loading">{ loading ? 'loading' : 'loaded' }</div>
        <div data-testid="response">{ data }</div>
        <button data-testid="send" onClick={() => send('test').then(callback)} />
      </div>
    );
  };

  beforeEach(() => {
    jest.spyOn(axios, 'put')
      .mockResolvedValue({ data: 'put' });
  });

  // Tests
  it('should call axios.put and return answer', async () => {
    const spy = jest.fn();

    // Render
    render(
      <TestComponent url='test' callback={spy} />
    );

    // Return
    const loading = screen.getByTestId('loading');
    const response = screen.getByTestId('response');
    const send = screen.getByTestId('send');

    expect(loading).toHaveTextContent('loaded');
    expect(response).toHaveTextContent('');

    // Emit request
    userEvent.click(send);
    expect(loading).toHaveTextContent('loading');
    expect(response).toHaveTextContent('');

    // Wait for answer
    await waitFor(() => {
      expect(loading).toHaveTextContent('loaded');
      expect(response).toHaveTextContent('put');
    });

    expect(axios.put).toBeCalledWith('test', 'test', {
      params: {},
      cancelToken: expect.anything(),
    });

    expect(spy).toBeCalledWith('put');
  });
});

describe('useAPI.patch', () => {
  const TestComponent: FC<TestPostProps> = ({ url, callback }) => {
    const { data, loading, send } = useAPI.patch<string,string>(url);

    return (
      <div>
        <div data-testid="loading">{ loading ? 'loading' : 'loaded' }</div>
        <div data-testid="response">{ data }</div>
        <button data-testid="send" onClick={() => send('test').then(callback)} />
      </div>
    );
  };

  beforeEach(() => {
    jest.spyOn(axios, 'patch')
      .mockResolvedValue({ data: 'patch' });
  });

  // Tests
  it('should call axios.patch and return answer', async () => {
    const spy = jest.fn();

    // Render
    render(
      <TestComponent url='test' callback={spy} />
    );

    // Return
    const loading = screen.getByTestId('loading');
    const response = screen.getByTestId('response');
    const send = screen.getByTestId('send');

    expect(loading).toHaveTextContent('loaded');
    expect(response).toHaveTextContent('');

    // Emit request
    userEvent.click(send);
    expect(loading).toHaveTextContent('loading');
    expect(response).toHaveTextContent('');

    // Wait for answer
    await waitFor(() => {
      expect(loading).toHaveTextContent('loaded');
      expect(response).toHaveTextContent('patch');
    });

    expect(axios.patch).toBeCalledWith('test', 'test', {
      params: {},
      cancelToken: expect.anything(),
    });

    expect(spy).toBeCalledWith('patch');
  });
});
