import knex from 'knex';
import path from 'path';

import { FINALCONTENTDATABASENAME } from '../../../Consts/DBConsts'

const finalContentConnection = knex({
  client: 'sqlite3',
  connection: {
    filename: path.resolve(__dirname, '..', '..', 'DB', 'finalContent', FINALCONTENTDATABASENAME)
  },
  useNullAsDefault: true,
});

export default finalContentConnection;