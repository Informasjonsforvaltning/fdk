import { compose } from 'recompose';

import { SearchPublisherPure } from './search-publisher-pure.component';
import { searchPublisherResolver } from './search-publisher-resolver';

const enhance = compose(searchPublisherResolver);
export const SearchPublisher = enhance(SearchPublisherPure);
