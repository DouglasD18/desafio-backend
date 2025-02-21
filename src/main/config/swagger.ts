import swaggerConfig from '../docs/swagger-config';

import { serve, setup } from 'swagger-ui-express'
import { Express } from 'express'

export default (app: Express): void => {
  app.use('/api-docs', serve, setup(swaggerConfig))
}