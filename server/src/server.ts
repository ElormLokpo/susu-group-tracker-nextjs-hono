import "dotenv/config";

import { createApp } from "./app";
import { env } from "./config";

const app = createApp();

console.log(`Server running on PORT:${env.PORT}`);

export default {
  fetch: app.fetch,
  port: env.PORT,
  hostname: "0.0.0.0",
};
