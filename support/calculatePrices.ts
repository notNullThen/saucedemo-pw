/**
 * Calculates the 8% tax amount and total price including tax based on the input price.
 * @param price The input price as a number, string, or null. If it's a string, it should include a dollar sign.
 * @returns An object containing formatted strings of the tax amount and the total price including tax.
 *
 * @example
 * const { taxPriceFormatted, priceWithTaxFormatted } = calculatePrices(100)
 *
 * taxPriceFormatted = "$8.00"
 * priceWithTaxFormatted = "$108.00"
 */
export default function (price: number | string | null) {
  let priceNum: number;
  if (typeof price === "string")
    priceNum = Number(price?.toString().replace("$", ""));
  else if (typeof price === "number") priceNum = price;
  else
    throw new Error(
      `calculatePrices method got 'price' variable which has "null" type`
    );

  const taxPrice = priceNum * 0.08;
  const taxPriceFormatted = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(taxPrice);
  const priceWithTax = priceNum + taxPrice;
  const priceWithTaxFormatted = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(priceWithTax);
  return { taxPriceFormatted, priceWithTaxFormatted };
}
