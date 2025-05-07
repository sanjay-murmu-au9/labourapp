/// <reference types="react-native" />

declare global {
  var ErrorUtils: {
    getGlobalHandler(): (error: any, isFatal?: boolean) => void;
    setGlobalHandler(callback: (error: any, isFatal?: boolean) => void): void;
  }
}

export {};