import knex from 'knex';
import path from 'path';

import { SERVICESTDATABASENAME } from '../../../../Consts/DBConsts'

const servicesConnection = knex({
  client: 'sqlite3',
  connection: {
    filename: path.resolve(__dirname, '..', '..', '..', 'DB', 'Content', SERVICESTDATABASENAME)
  },
  useNullAsDefault: true,
});

export default servicesConnection;