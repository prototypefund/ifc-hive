/*
 * Logger instance
 *
 * We create the logger instance in a module, so we can import the same instance
 * everywhere with this singleton pattern. 
 */
import Logger from '@lib/logger.js'

const logger = new Logger()

export default logger
