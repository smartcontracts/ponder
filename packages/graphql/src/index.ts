import type { PonderPlugin } from "@ponder/ponder";

import { generateSchema } from "./codegen/generateSchema";
import { generateSchemaTypes } from "./codegen/generateSchemaTypes";
import { readSchema } from "./readSchema";
import { buildPonderSchema } from "./schema/buildPonderSchema";
import { GraphqlServer } from "./server";
import { buildGqlSchema } from "./server/buildGqlSchema";
import { buildEntityStore } from "./store/entityStore";

export type PonderGraphqlPluginOptions = {
  port?: number;
  schemaFilePath?: string;
};

// Handler context types
export type EntityInstance = { [key: string]: string | number | null };
export type EntityModel = {
  get: (id: string) => Promise<EntityInstance | null>;
  insert: (obj: EntityInstance) => Promise<EntityInstance>;
  update: (
    obj: {
      id: string;
    } & Partial<EntityInstance>
  ) => Promise<EntityInstance>;
  delete: (id: string) => Promise<void>;
};

let server: GraphqlServer;

export const graphqlPlugin: PonderPlugin<PonderGraphqlPluginOptions> = ({
  port = 42069,
  schemaFilePath = "schema.graphql",
} = {}) => {
  return {
    name: "graphql",
    setup: async (ponder) => {
      const userSchema = readSchema(schemaFilePath);
      const ponderSchema = buildPonderSchema(userSchema);
      const gqlSchema = buildGqlSchema(ponderSchema);

      // Create the Entity store
      const entityStore = buildEntityStore(ponder.database);
      await entityStore.migrate(ponderSchema);

      // Build Express GraphQL server
      if (!server) {
        server = new GraphqlServer(port, entityStore, ponder.logger);
      }
      server.start(gqlSchema, port);

      // Build handler context entity models
      const entityModels: Record<string, EntityModel> = {};
      ponderSchema.entities.forEach((entity) => {
        const entityName = entity.name;
        const entityModel: EntityModel = {
          get: async (id) => entityStore.getEntity(entityName, id),
          insert: async (obj) => entityStore.insertEntity(entityName, obj),
          update: async (obj) => entityStore.updateEntity(entityName, obj),
          delete: async (id) => entityStore.deleteEntity(entityName, id),
        };

        entityModels[entityName] = entityModel;
      });

      await generateSchemaTypes(gqlSchema, ponder.options);
      ponder.logger.info(`\x1b[36m${"Generated schema types"}\x1b[0m`); // cyan

      generateSchema(gqlSchema, ponder.options);
      ponder.logger.debug(`Generated schema.graphql file`);

      ponder.addToHandlerContext({
        entities: entityModels,
      });

      ponder.addWatchFile(schemaFilePath);
    },
  };
};
