// Configure environment variables.
import dotenv from 'dotenv';
dotenv.config();
import config from 'config';

import createServer from './server/createServer';

const port = process.env.PORT || config.get<number>('port');
const app = createServer();

// Start the server.
app.listen(port, async () => {
  console.info(`Server is running on port: ${port}`);
});
