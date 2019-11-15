import sanitizeHtml from 'sanitize-html';
import showdown from 'showdown';

const classMap = {
  p: 'm-0',
  ul: 'm-0'
};

const bindings = Object.keys(classMap).map(key => ({
  type: 'output',
  regex: new RegExp(`<${key}(.*)>`, 'g'),
  replace: `<${key} class="${classMap[key]}" $1>`
}));

// We convert header levels one step down because we use it to not show on full page, but inside a block.
// Make configurable if needs to be shown on full page.
const showDownConverter = new showdown.Converter({
  headerLevelStart: 2,
  extensions: [...bindings],
  noHeaderId: true
});

const sanitizerConfig = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(['h2', 'p', 'ul']),
  allowedAttributes: {
    p: ['class'],
    ul: ['class']
  }
};

export function convertToSanitizedHtml(markdownContent) {
  if (typeof markdownContent !== 'string') {
    return '';
  }
  const unsanitizedHtml = showDownConverter.makeHtml(markdownContent);
  return sanitizeHtml(unsanitizedHtml, sanitizerConfig);
}
