import knex from 'knex';
import path from 'path';

import { ADMINDATABASE } from '../../../Consts/DBConsts'

const adminConnection = knex({
  client: 'sqlite3',
  connection: {
    filename: path.resolve(__dirname, '..', '..', 'DB', 'admin', ADMINDATABASE)
  },
  useNullAsDefault: true,
});

export default adminConnection;