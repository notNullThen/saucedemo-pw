import assert from "assert";
import getPriceValue from "./getPriceValue";

/**
 * Calculates the 8% tax amount and total price including tax based on the input price.
 * @param price The input price as a number, string, or null. If it's a string, it should include a dollar sign.
 * @returns An object containing number values of the tax amount and the total price including tax.
 *
 * @example
 * const { taxPrice, priceWithTax } = calculatePrices(100)
 *
 * taxPrice = 8
 * priceWithTax = 108
 */
export default function (price: number | string | null) {
  assert(price, `calculatePrices method got empty 'price' variable`);
  let priceNum: number;
  // Extract the numeric value of the price
  if (typeof price === "string") priceNum = getPriceValue(price);
  else priceNum = price;
  // Calculate values
  const taxPrice = priceNum * 0.08;
  const priceWithTax = priceNum + taxPrice;
  return { taxPrice, priceWithTax };
}
