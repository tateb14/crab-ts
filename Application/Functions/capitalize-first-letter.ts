export default function capitalizeFirstLetter(str: String) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}