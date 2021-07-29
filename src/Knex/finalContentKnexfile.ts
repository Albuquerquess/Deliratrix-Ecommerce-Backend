import path from 'path'

export default {
  client: 'sqlite3',
  connection: {
    filename: path.resolve(__dirname, '..', 'src', 'Database', 'DB', 'finalContent', 'finalContentDeliratrixDatabase.sqlite')
  },
  migrations: {
    directory: path.resolve(__dirname, '..', 'src', 'Database', 'migrations', 'finalContent')
  },
  useNullAsDefault: true
}