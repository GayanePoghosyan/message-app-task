export const config = {
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
  },
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
    dbName: process.env.MONGODB_DB_NAME || 'message-app',
    replicaSet: process.env.MONGODB_REPLICA_SET || 'rs0',
  },
  messageService: {
    size: Number(process.env.SIZE) || 10,
    timeout: Number(process.env.TIMEOUT) || 1000,
  },
};
