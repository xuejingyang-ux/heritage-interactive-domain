import app from './app.mjs';
import { config } from './config.mjs';

app.listen(config.apiPort, () => {
  console.log(`Backend listening on http://localhost:${config.apiPort}`);
});
