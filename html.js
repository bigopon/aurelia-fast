// Much thanks to LitHTML for working this out!
const lastAttributeNameRegex =
    // eslint-disable-next-line no-control-regex
    /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;


export function html(strings, ...values) {
  const builtStrings = [];
  const directives = [];
  let html = "";
  let syntheticAttrIdx = 0;

  for (let i = 0, ii = strings.length - 1; i < ii; ++i) {
      const currentString = strings[i];

      const match = lastAttributeNameRegex.exec(currentString);
      if (match === null) {
        currentString += `a__${syntheticAttrIdx++}=`;
      }

      builtStrings[builtStrings.length] = currentString;
  }

  return new ViewTemplate(html, directives);
}
