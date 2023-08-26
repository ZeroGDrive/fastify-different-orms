import { buildJsonSchemas } from 'fastify-zod';
import { z } from 'zod';
import { createUserResponseSchema } from '../user/user.schema';

const productInput = {
  title: z.string(),
  price: z.number(),
  content: z.string().optional(),
};

const productGenerated = {
  id: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  ownerId: z.number(),
};

const createProductSchema = z.object({
  ...productInput,
});

const productResponseSchema = z.object({
  ...productInput,
  ...productGenerated,
  owner: createUserResponseSchema.optional(),
});

const productsResponseSchema = z.array(productResponseSchema);

export type CreateProductInput = z.infer<typeof createProductSchema>;

export const { schemas: productSchemas, $ref } = buildJsonSchemas(
  {
    createProductSchema,
    productResponseSchema,
    productsResponseSchema,
  },
  { $id: 'product' }
);
