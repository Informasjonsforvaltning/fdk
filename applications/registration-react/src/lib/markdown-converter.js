import sanitizeHtml from 'sanitize-html';
import showdown from 'showdown';

// We convert header levels one step down because we use it to not show on full page, but inside a block.
// Make configurable if needs to be shown on full page.
const showDownConverter = new showdown.Converter({ headerLevelStart: 2 });

const sanitizerConfig = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(['h2'])
};

export function convertToSanitizedHtml(markdownContent) {
  if (typeof markdownContent !== 'string') {
    return '';
  }
  const unsanitizedHtml = showDownConverter.makeHtml(markdownContent);
  return sanitizeHtml(unsanitizedHtml, sanitizerConfig);
}
