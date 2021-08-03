import knex from 'knex';
import path from 'path';

import { TMPDATABASENAME } from '../../../Consts/DBConsts'

const tmpConnection = knex({
  client: 'sqlite3',
  connection: {
    filename: path.resolve(__dirname, '..', '..', 'DB', 'tmp', TMPDATABASENAME)
  },
  useNullAsDefault: true,
});

export default tmpConnection