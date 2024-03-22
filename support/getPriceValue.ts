export default function (price: string | null) {
  return Number(price?.toString().replace("$", ""));
}
