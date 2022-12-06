import type { Entity } from "@ponder/core";
import { FieldKind } from "@ponder/core";
import {
  GraphQLFieldConfig,
  GraphQLFieldResolver,
  GraphQLInputObjectType,
  GraphQLInputType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

import type { Context, Source } from "./buildGqlSchema";

type WhereInputArg = {
  [key: string]: number | string;
};
type PluralArgs = {
  where?: WhereInputArg;
  first?: number;
  skip?: number;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
};
type PluralResolver = GraphQLFieldResolver<Source, Context, PluralArgs>;

const operators = {
  universal: ["", "not"],
  singular: ["in", "not_in"],
  plural: [
    "contains",
    "contains_nocase",
    "not_contains",
    "not_contains_nocase",
  ],
  numeric: ["gt", "lt", "gte", "lte"],
  string: [
    "contains",
    "contains_nocase",
    "not_contains",
    "not_contains_nocase",

    "starts_with",
    "starts_with_nocase",
    "not_starts_with",
    "not_starts_with_nocase",

    "ends_with",
    "ends_with_nocase",
    "not_ends_with",
    "not_ends_with_nocase",
  ],
};

const buildPluralField = (
  entity: Entity,
  entityType: GraphQLObjectType<Source, Context>
): GraphQLFieldConfig<Source, Context> => {
  const filterFields: Record<string, { type: GraphQLInputType }> = {};

  // For each field on the entity, create a bunch of filter fields.
  entity.fields
    // For now, don't create filter fields for derived types.
    .filter((field) => field.kind !== FieldKind.DERIVED)
    .forEach((field) => {
      operators.universal.forEach((suffix) => {
        // Small hack to get the correct filter field name.
        const filterFieldName =
          suffix === "" ? `${field.name}` : `${field.name}_${suffix}`;

        filterFields[filterFieldName] = { type: field.baseGqlType };
      });

      if (field.kind !== FieldKind.LIST) {
        operators.singular.forEach((suffix) => {
          filterFields[`${field.name}_${suffix}`] = {
            type: new GraphQLList(new GraphQLNonNull(field.baseGqlType)),
          };
        });
      }

      if (field.kind === FieldKind.LIST) {
        operators.plural.forEach((suffix) => {
          filterFields[`${field.name}_${suffix}`] = { type: field.baseGqlType };
        });
      }

      if (
        field.kind === FieldKind.ID ||
        (field.kind === FieldKind.SCALAR &&
          ["Int", "Float"].includes(field.baseGqlType.name))
      ) {
        operators.numeric.forEach((suffix) => {
          filterFields[`${field.name}_${suffix}`] = { type: field.baseGqlType };
        });
      }

      if (
        field.kind === FieldKind.SCALAR &&
        field.baseGqlType.name === "String"
      ) {
        operators.string.forEach((suffix) => {
          filterFields[`${field.name}_${suffix}`] = { type: field.baseGqlType };
        });
      }
    });

  const filterType = new GraphQLInputObjectType({
    name: `${entity.name}Filter`,
    fields: filterFields,
  });

  const resolver: PluralResolver = async (_, args, context) => {
    const { store } = context;

    const filter = args;

    return await store.getEntities(entity.name, filter);
  };

  return {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(entityType))),
    args: {
      where: { type: filterType },
      first: { type: GraphQLInt },
      skip: { type: GraphQLInt },
      orderBy: { type: GraphQLString },
      orderDirection: { type: GraphQLString },
    },
    resolve: resolver,
  };
};

export { buildPluralField };
