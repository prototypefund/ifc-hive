/*
 * stringToColour
 * @param { string } string, a string which you magically want to have transformed into a hex code
 * @return { string } a hexcode
 *
 * make a hex color code from a string
 */
const stringToColour = function (string = 'abcdef') {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let colour = "#";
  for (let i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xff;
    colour += ("00" + value.toString(16)).substr(-2);
  }
  return colour;
}

export {
  stringToColour,
}
