export const convertToSlug = (str: string) => {
  return str
    .toLowerCase()
    .replace(/ /g, '-') // Replace spaces with dashes
    .replace(/[^\w-]+/g, '') // Remove non-word characters
}
