import knex from 'knex';
import path from 'path';

import { CONTENTDATABASENAME } from '../../../Consts/DBConsts'

const contentConnection = knex({
  client: 'sqlite3',
  connection: {
    filename: path.resolve(__dirname, '..', '..', 'DB', 'content', CONTENTDATABASENAME)
  },
  useNullAsDefault: true,
});

export default contentConnection;