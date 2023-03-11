/*
 * Use bitwise operations to manage permissions
 *
 * Read also: 
 *  - https://medium.com/@rahul.raviprasad/the-little-known-bitwise-operations-and-their-performance-in-javascript-c281d512c757#.a2jz9ic1f
 *  - https://medium.com/@venuebook_j/using-bitfields-in-javascript-for-simple-permission-systems-fce3b35aee58
 */

/*
 * convert integer to binary
 * param {type} integer 
 */
export function int2bin(dec) {
  return (dec >>> 0).toString(2)
}

/*
 * pad number with leading zeros 
 * @param {number} num
 * @param {size} size
 */
export function padNumber(num, size) {
    num = num.toString()
    while (num.length < size) num = "0" + num
    return num
}

/*
 * pad number with leading zeros 
 * @param {string} string
 * @param {size} size
 */
export function binaryStringToArray(string, size) {
  const fullString  = string.padStart(size, '0')
  // @TODO reverse array and turn every element into number
}
