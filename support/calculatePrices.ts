export default function (price: number | string | null) {
  const priceString = price?.toString().split("$")[1] as string;
  const taxPrice = +priceString * 0.08;
  const taxPriceFormatted = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(taxPrice);
  const priceWithTax = +priceString + taxPrice;
  const priceWithTaxFormatted = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(priceWithTax);
  return { taxPriceFormatted, priceWithTaxFormatted };
}
