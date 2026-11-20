#!/usr/bin/env node
import { sites } from "../sites.mjs";
import { startPreviewServer } from "./preview-server.mjs";

const basePort = Number(process.env.BASE_PORT ?? 5100);
const servers = [];

for (let i = 0; i < sites.length; i++) {
  const port = basePort + i;
  const server = await startPreviewServer(sites[i].folder, port);
  servers.push(server);
  console.log(`preview ${sites[i].folder} http://127.0.0.1:${port}`);
}

console.log("READY");

const shutdown = () => {
  Promise.all(servers.map((s) => new Promise((r) => s.close(r)))).then(() =>
    process.exit(0)
  );
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
