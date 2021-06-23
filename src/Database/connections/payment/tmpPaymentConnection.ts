import knex from 'knex';
import path from 'path';

import { TMPPAYMENTDATABASENAME } from '../../../Consts/DBConsts'

const TmpPaymentConnection = knex({
  client: 'sqlite3',
  connection: {
    filename: path.resolve(__dirname, '..', '..', 'DB', 'Payment', TMPPAYMENTDATABASENAME)
  },
  useNullAsDefault: true,
});

export default TmpPaymentConnection;