import { LoggerFn } from '@nx-workspace/util-logger';
import * as functions from 'firebase-functions';
import { extend } from 'lodash';

export const log: LoggerFn = extend(
  (...args) => functions.logger.log(...args),
  {
    debug: (...args) => functions.logger.debug(...args),
    log: (...args) => functions.logger.log(...args),
    warn: (...args) => functions.logger.warn(...args),
    error: (...args) => functions.logger.error(...args),
    info: (...args) => functions.logger.info(...args),
  }
);

export default log;
