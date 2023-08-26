import { FastifyInstance } from 'fastify';
import {
  getUsersHandler,
  loginHandler,
  registerUserHandler,
} from './user.controller';
import { $ref } from './user.schema';

async function userRoutes(server: FastifyInstance) {
  server.post(
    '/',
    {
      schema: {
        body: $ref('createUserSchema'),
        response: {
          201: $ref('createUserResponseSchema'),
        },
        tags: ['user'],
      },
    },
    registerUserHandler
  );

  server.post(
    '/login',
    {
      schema: {
        body: $ref('loginSchema'),
        response: {
          200: $ref('loginResponseSchema'),
        },
        tags: ['user'],
      },
    },
    loginHandler
  );

  server.get(
    '/',
    {
      onRequest: [server.authenticate],
      schema: {
        response: {
          200: $ref('findUsersResponseSchema'),
        },
        tags: ['user'],
      },
    },
    getUsersHandler
  );
}

export default userRoutes;
