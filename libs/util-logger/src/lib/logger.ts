/* eslint-disable no-console */
import logger from 'debug';

const loggers: Map<string, LoggerFn> = new Map();

export type LogFn = (formatter: any, ...args: any[]) => void;
export interface LoggerFn extends LogFn {
  log: (formatter: any, ...args: any[]) => void;
  debug: (formatter: any, ...args: any[]) => void;
  warn: (formatter: any, ...args: any[]) => void;
  error: (formatter: any, ...args: any[]) => void;
  info: (formatter: any, ...args: any[]) => void;
}

export function Logger(name: string): LoggerFn {
  const previous = loggers.get(name);
  if (previous) {
    return previous;
  }

  const log = logger(`${name}:log`);
  log.log = console.log;
  const debug = logger(`${name}:debug`);
  debug.log = console.debug;
  const warn = logger(`${name}:warn`);
  warn.log = console.warn;
  const info = logger(`${name}:info`);
  info.log = console.info;
  const error = logger(`${name}:error`);
  const fn = (formatter: any, ...args: any[]) => {
    log(formatter, ...args);
  };

  fn.log = log;
  fn.debug = debug;
  fn.warn = warn;
  fn.info = info;
  fn.error = (formatter: any, ...args: any[]) => {
    if (error.enabled) {
      error(formatter, ...args);
    } else {
      console.error(formatter, ...args);
    }
  };
  loggers.set(name, fn);
  return fn;
}
