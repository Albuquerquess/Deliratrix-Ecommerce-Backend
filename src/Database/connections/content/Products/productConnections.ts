import knex from 'knex';
import path from 'path';

import { PRODUCSTDATABASENAME } from '../../../../Consts/DBConsts'

const productConnection = knex({
  client: 'sqlite3',
  connection: {
    filename: path.resolve(__dirname, '..', '..', '..', 'DB', 'Content', PRODUCSTDATABASENAME)
  },
  useNullAsDefault: true,
});

export default productConnection;