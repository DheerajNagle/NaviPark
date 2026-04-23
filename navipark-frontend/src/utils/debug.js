// Debug utility for development and production
const isDev = import.meta.env.DEV;
const isDebug = import.meta.env.VITE_ENABLE_DEBUG === 'true';

const debug = {
  log: (...args) => {
    if (isDev && isDebug) {
      console.log('[DEBUG]', ...args);
    }
  },
  
  error: (...args) => {
    if (isDev) {
      console.error('[ERROR]', ...args);
    }
  },
  
  warn: (...args) => {
    if (isDev) {
      console.warn('[WARN]', ...args);
    }
  },
  
  info: (...args) => {
    if (isDev) {
      console.info('[INFO]', ...args);
    }
  },
  
  group: (label) => {
    if (isDev && isDebug) {
      console.group(label);
    }
  },
  
  groupEnd: () => {
    if (isDev && isDebug) {
      console.groupEnd();
    }
  },
  
  time: (label) => {
    if (isDev && isDebug) {
      console.time(label);
    }
  },
  
  timeEnd: (label) => {
    if (isDev && isDebug) {
      console.timeEnd(label);
    }
  }
};

export default debug;
