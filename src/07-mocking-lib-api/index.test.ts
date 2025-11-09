import axios from 'axios';
import { throttledGetDataFromApi, THROTTLE_TIME } from './index';

jest.mock('axios');

describe('throttledGetDataFromApi', () => {
  let mockGet: jest.Mock;
  let mockCreate: jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    mockGet = jest.fn();
    mockCreate = jest.fn(() => ({ get: mockGet }));
    (axios.create as jest.Mock).mockImplementation(mockCreate);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('should create instance with provided base url', async () => {
    mockGet.mockResolvedValueOnce({ data: {} });
    throttledGetDataFromApi('/posts');
    jest.runAllTimers();
    expect(mockCreate).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    mockGet.mockResolvedValueOnce({ data: {} });
    throttledGetDataFromApi('/todos/1');
    jest.runAllTimers();
    expect(mockGet).toHaveBeenCalledWith('/todos/1');
  });

  test('should return response data', async () => {
    const fakeData = { id: 1, title: 'test' };
    mockGet.mockResolvedValueOnce({ data: fakeData });

    throttledGetDataFromApi('/posts/1');

    jest.advanceTimersByTime(THROTTLE_TIME);

    await Promise.resolve();

    expect(mockGet).toHaveBeenCalledWith('/posts/1');
    expect(mockGet).toHaveReturned();
  });
});
