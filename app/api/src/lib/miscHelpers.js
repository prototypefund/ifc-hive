import { customAlphabet } from 'nanoid'
// const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 16)


/*
 * randomId genertor
 *
 * @param {number} length - required length for the output
 * @return {object} - nanoid instance
 * @example
 * randomId(12) => 'gdh6326GDJh0'
 * 
 * Use it for socket-id's, token-id's, reset-tokens etc. Everywhere wehere we
 * want ao unique, random string which doesn't have to be UUID.
 */
const customCyperAlphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

export function randomIdGenerator (length = 16) {
  return customAlphabet(customCyperAlphabet, length )
}
