import * as lodash from 'lodash';
import {
  getBankAccount,
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
} from '.';

jest.mock('lodash');

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const account = getBankAccount(1000);
    expect(account.getBalance()).toBe(1000);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const account = getBankAccount(1000);
    expect(() => account.withdraw(2000)).toThrow(InsufficientFundsError);
    expect(() => account.withdraw(2000)).toThrow('Insufficient funds');
  });

  test('should throw error when transferring more than balance', () => {
    const accountFrom = getBankAccount(1000);
    const accountTo = getBankAccount(0);
    expect(() => accountFrom.transfer(2000, accountTo)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    const accountFrom = getBankAccount(1000);
    expect(() => accountFrom.transfer(2000, accountFrom)).toThrow(
      TransferFailedError,
    );
    expect(() => accountFrom.transfer(2000, accountFrom)).toThrow(
      'Transfer failed',
    );
  });

  test('should deposit money', () => {
    const account = getBankAccount(1000);
    account.deposit(500);
    expect(account.getBalance()).toBe(1500);
  });

  test('should withdraw money', () => {
    const account = getBankAccount(1000);
    account.withdraw(500);
    expect(account.getBalance()).toBe(500);
  });

  test('should transfer money', () => {
    const accountFrom = getBankAccount(1000);
    const accountTo = getBankAccount(0);

    accountFrom.transfer(400, accountTo);

    expect(accountFrom.getBalance()).toBe(600);
    expect(accountTo.getBalance()).toBe(400);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const account = getBankAccount(0);
    jest
      .spyOn(lodash, 'random')
      .mockImplementationOnce(() => 42)
      .mockImplementationOnce(() => 1);
    const result = await account.fetchBalance();
    expect(typeof result).toBe('number');
    expect(result).toBe(42);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const account = getBankAccount(0);
    jest
      .spyOn(lodash, 'random')
      .mockImplementationOnce(() => 50)
      .mockImplementationOnce(() => 1);
    await account.synchronizeBalance();
    expect(account.getBalance()).toBe(50);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const account = getBankAccount(0);
    jest
      .spyOn(lodash, 'random')
      .mockImplementationOnce(() => 50)
      .mockImplementationOnce(() => 0);
    await expect(account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
