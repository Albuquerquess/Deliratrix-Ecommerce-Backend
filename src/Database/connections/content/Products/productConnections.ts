import knex from 'knex';
import path from 'path';

import { PRODUCSTDATABASENAME } from '../../../../Consts/DBConsts'

const productsConnection = knex({
  client: 'sqlite3',
  connection: {
    filename: path.resolve(__dirname, '..', '..', '..', 'DB', 'Payment', PRODUCSTDATABASENAME)
  },
  useNullAsDefault: true,
});

export default productsConnection;