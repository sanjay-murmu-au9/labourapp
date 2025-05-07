import { Alert } from 'react-native';

// Using interface merging instead of redeclaration
interface Global {
  HermesInternal?: {
    handleError(error: any): void;
  };
}

type ErrorHandler = (error: any, isFatal?: boolean) => void;

const defaultErrorHandler: ErrorHandler = (error, isFatal) => {
  const errorMessage = error?.message || error?.toString() || 'An unknown error occurred';

  if (__DEV__) {
    console.error('Unhandled Error:', { error, isFatal });
  }

  Alert.alert(
    'Error',
    `${errorMessage}\n\nPlease try again or restart the app if the problem persists.`,
    [{ text: 'OK' }]
  );
};

/**
 * Sets up global error handlers for both regular errors and promise rejections
 */
export const setupGlobalErrorHandlers = (): void => {
  // Handle regular errors
  if (typeof ErrorUtils !== 'undefined') {
    const currentHandler = ErrorUtils.getGlobalHandler();

    ErrorUtils.setGlobalHandler((error: any, isFatal?: boolean) => {
      // Let the current handler process the error first
      currentHandler(error, isFatal);
      // Then process with our handler
      defaultErrorHandler(error, isFatal);
    });
  }

  // Handle promise rejections
  const handlePromiseRejection = (event: any) => {
    const error = event?.reason || event;
    defaultErrorHandler(error, false);
  };

  // Set up promise rejection handlers for both Hermes and non-Hermes environments
  const hermesInternal = (global as any).HermesInternal;
  if (hermesInternal && typeof hermesInternal.handleError === 'function') {
    const originalHandler = hermesInternal.handleError;
    hermesInternal.handleError = (error: any) => {
      defaultErrorHandler(error, true);
      originalHandler(error);
    };
  }

  // Add event listeners for unhandled promise rejections
  if (typeof global !== 'undefined') {
    // @ts-ignore
    if (global.addEventListener) {
      // @ts-ignore
      global.addEventListener('unhandledrejection', handlePromiseRejection);
    }
  }
};

/**
 * Wraps async functions to ensure errors are caught and handled
 */
export const withErrorHandling = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  customErrorHandler?: (error: any) => void
): T => {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      if (customErrorHandler) {
        customErrorHandler(error);
      } else {
        defaultErrorHandler(error, false);
      }
      // Don't throw the error again since we've handled it
      return undefined as any;
    }
  }) as T;
};