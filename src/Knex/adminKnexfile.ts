import path from 'path'

export default {
  client: 'sqlite3',
  connection: {
    filename: path.resolve(__dirname, '..', 'src', 'Database', 'DB', 'admin', 'adminDeliratrixDatabase.sqlite')
  },
  migrations: {
    directory: path.resolve(__dirname, '..', 'src', 'Database', 'migrations', 'admin')
  },
  seeds: {
    directory: path.resolve(__dirname, '..', 'src', 'Database', 'Seeds', 'Admin')
  },
  useNullAsDefault: true
}