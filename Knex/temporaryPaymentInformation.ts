import path from 'path'

console.log(__dirname)

export default {
  client: 'sqlite3',
  connection: {
    filename: path.resolve(__dirname, '..', 'src', 'Database', 'DB', 'TmpPaymentInfosDeliratrixDatabase.sqlite')
  },
  migrations: {
    directory: path.resolve(__dirname, '..', 'src', 'Database', 'migrations', 'payment' )
  },
  useNullAsDefault: true
}