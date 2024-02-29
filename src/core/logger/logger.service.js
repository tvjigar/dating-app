import { createWinstonLogger } from './configs/winston.js';

/**
 * Logger Service
 */
export default class LoggerService {

    /**
     * Winston logger instance.
     *
     * @type {Logger}
     */
    static logger = createWinstonLogger();

}
