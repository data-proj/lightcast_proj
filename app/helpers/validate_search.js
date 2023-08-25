export function validateSearch(search) {
  if (!search) {
    return "Keyword search is required";
  } else if (!/^[a-zA-Z +#/.]*$/.test(search)) {
    return "Invalid search";
  }
}
