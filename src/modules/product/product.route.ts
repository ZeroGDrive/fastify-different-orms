import { FastifyInstance } from 'fastify';
import { createProductHandler, getProductsHandler } from './product.controller';
import { $ref } from './product.schema';

async function productRoutes(server: FastifyInstance) {
  server.post(
    '/',
    {
      onRequest: [server.authenticate],
      schema: {
        body: $ref('createProductSchema'),
        response: {
          201: $ref('productResponseSchema'),
        },
        tags: ['product'],
      },
    },
    createProductHandler
  );

  server.get(
    '/',
    {
      schema: {
        response: {
          200: $ref('productsResponseSchema'),
        },
        tags: ['product'],
      },
    },
    getProductsHandler
  );
}

export default productRoutes;
