import path from 'path'

export default {
  client: 'sqlite3',
  connection: {
    filename: path.resolve(__dirname, '..', 'src', 'Database', 'DB', 'tmp', 'tmpDeliratrixDatabase.sqlite')
  },
  migrations: {
    directory: path.resolve(__dirname, '..', 'src', 'Database', 'migrations', 'tmp')
  },
  useNullAsDefault: true
}