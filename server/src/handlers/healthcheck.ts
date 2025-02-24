import Logger from 'src/utils/logger';

import { Request, Response } from 'express';

export const healthCheck = async (_req: Request, res: Response) => {
  Logger.info('Server is starting');
  res.send('Server is working');
};
