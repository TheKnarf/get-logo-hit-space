/*
 *	shave
 *		Shaves of some numbers
 *	input:
 *		an hex or an object with a 'hex' property
 *		an int of how much to shave
 *
 *	TODO: do something with the remainder
 */
export const shave = (toShaveOf, num) => {
  const bitsToShave = Math.ceil(Math.log(num) / Math.log(2));
  const hexesToShave = Math.ceil(bitsToShave / 4); // 4 bits per hex

  if (typeof toShaveOf == "string") {
    toShaveOf = {
      hex: toShaveOf,
    };
  }

  if (toShaveOf.hex.length < hexesToShave) {
    console.log("Not enough to shave");
    return null;
  }

  // Shave of hex
  const shavedHexes = toShaveOf.hex.substr(0, hexesToShave);
  toShaveOf.hex = toShaveOf.hex.substr(hexesToShave);

  var binary = "";
  for (var i = 0; i < hexesToShave; i++) {
    binary += ("0000" + parseInt(shavedHexes[i], 16).toString(2)).substr(-4);
  }

  //toShaveOf.shavedHexes = shavedHexes; // Uncomment to make testing easier
  //toShaveOf.binary = binary; // Uncomment to make testing easier
  //toShaveOf.bitsToShave = bitsToShave; // Uncomment to make testing easier
  toShaveOf.result = parseInt(binary.substr(0, bitsToShave), 2) % num;
  toShaveOf.normalized = toShaveOf.result / num;

  return toShaveOf;
};

window.shave = shave; // Uncomment to make testing easier
