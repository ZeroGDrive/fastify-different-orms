import fjwt from '@fastify/jwt';
import swagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import { withRefResolver } from 'fastify-zod';
import productRoutes from './modules/product/product.route';
import { productSchemas } from './modules/product/product.schema';
import userRoutes from './modules/user/user.route';
import { userSchemas } from './modules/user/user.schema';

export const server = Fastify();

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: any;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      id: number;
    };
  }
}

server.register(fjwt, {
  secret: 'anything',
});

server.decorate(
  'authenticate',
  async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      await request.jwtVerify();
    } catch (e) {
      return reply.send(e);
    }
  }
);

server.get('/healthcheck', async function () {
  return { status: 'ok' };
});

async function main() {
  for (const schema of [...userSchemas, ...productSchemas]) {
    server.addSchema(schema);
  }

  server.register(
    swagger,
    withRefResolver({
      openapi: {
        info: {
          title: 'Fastify API',
          description: 'API for some products',
          version: '0.1.0',
        },
      },
    })
  );
  server.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    staticCSP: true,
  });

  server.register(userRoutes, { prefix: '/api/users' });
  server.register(productRoutes, { prefix: '/api/products' });

  try {
    await server.listen({
      port: 3000,
      host: '0.0.0.0',
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();
