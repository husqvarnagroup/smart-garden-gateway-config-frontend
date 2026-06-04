import { afterEach, beforeEach, vi } from 'vitest';

let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
let consoleErrorsAllowed = false;

export const allowConsoleErrors = () => {
  consoleErrorsAllowed = true;
};

export const getConsoleErrorSpy = () => consoleErrorSpy;

beforeEach(() => {
  consoleErrorsAllowed = false;
  consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  if (!consoleErrorsAllowed && consoleErrorSpy.mock.calls.length > 0) {
    const formatted = (consoleErrorSpy.mock.calls as unknown[][])
      .map((args) =>
        args.map((a) => (a instanceof Error ? (a.stack ?? a.message) : String(a))).join(' '),
      )
      .join(' | ');
    throw new Error(`Unexpected console.error call in test: ${formatted}`);
  }

  consoleErrorSpy.mockRestore();
});
