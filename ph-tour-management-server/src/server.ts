import app from "./app";
import { connect_db } from "./database/connect_db";
import { d_config } from "./config";

(async () => {
  await connect_db();
  app.listen(d_config.port, () => {
    console.log(`Server running on port ${d_config.port}`);
  });
})();
