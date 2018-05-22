import { schema } from 'normalizr';

const item = new schema.Entity('items');

const helptext = new schema.Entity('helptexts', {
  id: item,
  moreg: [item]
});

export { item, helptext };
