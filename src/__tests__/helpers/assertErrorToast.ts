import { expect } from 'vitest';
import { mockToastError, mockToastSuccess } from './mockUseToast';
import { getConsoleErrorSpy } from '../setup';

// "one error toast fired, no success toast" pair
export const expectErrorToastFired = ({ withConsoleError = false } = {}) => {
  expect(mockToastError).toHaveBeenCalledOnce();
  expect(mockToastSuccess).not.toHaveBeenCalled();
  if (withConsoleError) {
    expect(getConsoleErrorSpy()).toHaveBeenCalledOnce();
  }
};

// "one success toast fired, no error toast" pair
export const expectSuccessToastFired = () => {
  expect(mockToastSuccess).toHaveBeenCalledOnce();
  expect(mockToastError).not.toHaveBeenCalled();
};
