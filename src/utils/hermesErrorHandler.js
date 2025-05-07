/**
 * Hermes Error Handler
 *
 * This utility prevents the common InternalBytecode.js error from flooding the console
 * by overriding certain error handlers in development mode.
 */

// Save original console methods
const originalConsoleError = console.error;

// Pattern to identify Hermes bytecode errors
const HERMES_ERROR_PATTERN = /InternalBytecode\.js/;

// Override console.error to filter out Hermes-related errors
console.error = function (...args) {
  // Check if this is a Hermes bytecode error that we want to suppress
  const errorString = args.join(' ');
  if (
    HERMES_ERROR_PATTERN.test(errorString) &&
    errorString.includes('ENOENT') &&
    errorString.includes('no such file or directory')
  ) {
    // Suppress the specific error we're targeting
    return;
  }

  // Pass all other errors to the original console.error
  originalConsoleError.apply(console, args);
};

// If in development, patch the ErrorUtils to handle unhandled promise rejections
if (__DEV__ && global.ErrorUtils) {
  try {
    const originalHandler = global.ErrorUtils.getGlobalHandler();

    global.ErrorUtils.setGlobalHandler((error, isFatal) => {
      // Suppress Hermes bytecode errors
      if (
        error &&
        error.message &&
        HERMES_ERROR_PATTERN.test(error.message) &&
        error.code === 'ENOENT'
      ) {
        return;
      }

      // Handle all other errors with the original handler
      originalHandler(error, isFatal);
    });
  } catch (e) {
    console.warn('Failed to set error handler:', e);
  }
}

export default {
  install: () => {
    // This function is called to install the handler
    // It doesn't need to do anything since the overrides are applied when the file is imported
    console.log('Hermes error handler installed');
  }
};