import config from './config';
import { createServer } from './config/server';

const app = createServer();

app.listen(config.server.port, () => {
  console.log(`Server running in ${config.env} mode on ${config.server.url}`);
}).on('error', (err) => {
  console.error('Server failed to start:', err);
  process.exit(1);
});