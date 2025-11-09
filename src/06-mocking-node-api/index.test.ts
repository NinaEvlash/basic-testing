import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';

jest.mock('fs');
jest.mock('fs/promises');
jest.mock('path');

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    const spy = jest.spyOn(global, 'setTimeout');

    doStuffByTimeout(callback, 1000);

    expect(spy).toHaveBeenCalledWith(callback, 1000);

    spy.mockRestore();
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();

    doStuffByTimeout(callback, 1000);
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    const spy = jest.spyOn(global, 'setInterval');

    doStuffByInterval(callback, 1000);

    expect(spy).toHaveBeenCalledWith(callback, 1000);

    spy.mockRestore();
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();

    doStuffByInterval(callback, 1000);
    jest.advanceTimersByTime(3000);

    expect(callback).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  const mockJoin = join as jest.Mock;
  const mockExistsSync = existsSync as jest.Mock;
  const mockReadFile = readFile as jest.Mock;
  test('should call join with pathToFile', async () => {
    mockJoin.mockReturnValue('/fake/full/path');
    mockExistsSync.mockReturnValue(false);

    await readFileAsynchronously('test.txt');
    expect(mockJoin).toHaveBeenCalledWith(__dirname, 'test.txt');
  });

  test('should return null if file does not exist', async () => {
    mockJoin.mockReturnValue('/fake/full/path');
    mockExistsSync.mockReturnValue(false);

    const res = await readFileAsynchronously('null.txt');

    expect(res).toBeNull();
    expect(mockReadFile).not.toHaveBeenCalled();
  });

  test('should return file content if file exists', async () => {
    mockJoin.mockReturnValue('/fake/full/path');
    mockExistsSync.mockReturnValue(true);
    mockReadFile.mockResolvedValue(Buffer.from('Text in file...'));

    const res = await readFileAsynchronously('fileToRead.txt');

    expect(mockReadFile).toHaveBeenCalledWith('/fake/full/path');
    expect(res).toBe('Text in file...');
  });
});
