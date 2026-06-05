import { IncomingMessage, ServerResponse } from 'http';
import { buildApp } from '../apps/api/src/app';

const app = buildApp();

export default async function (req: IncomingMessage, res: ServerResponse) {
  await app.ready();
  app.server.emit('request', req, res);
}
