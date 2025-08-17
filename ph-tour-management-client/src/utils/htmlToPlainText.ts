//

export function htmlToPlainText(htmlString: string) {
  return htmlString
    .replace(/<\/?[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
