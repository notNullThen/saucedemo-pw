export default function (price: number | string) {
  const taxPrice = +price * 0.08;
  const taxPriceFormatted = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(taxPrice);
  const priceWithTax = +price + taxPrice;
  const priceWithTaxFormatted = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(priceWithTax);
  return { taxPriceFormatted, priceWithTaxFormatted };
}
