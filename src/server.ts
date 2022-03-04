import dotenv from "dotenv";
import express from "express";
import { postgraphile } from "postgraphile";
import PgSimplifyInflectorPlugin from "@graphile-contrib/pg-simplify-inflector";
import PgManyToManyPlugin from "@graphile-contrib/pg-many-to-many";
import ConnectionFilterPlugin from "postgraphile-plugin-connection-filter";
import SubscriptionsLds from "@graphile/subscriptions-lds";

dotenv.config();

const DATABASE_URL = process.env.URL;

const SCHEMA_NAMES =  "todo_public";
console.log(DATABASE_URL, SCHEMA_NAMES)
const postgraphileOpt = {
  watchPg: true,
  graphiql: true,
  enhanceGraphiql: true,
  exportJsonSchemaPath: "schema.json",
  exportGqlSchemaPath: "schema.graphql",

  subscriptions: true, // start the websocket server (implicitly done when setting live: true)
  live: true, // Enable live support in PostGraphile
  ownerConnectionString: DATABASE_URL, // We need elevated privileges for logical decoding needed when live: true (live queries)

  appendPlugins: [
    PgSimplifyInflectorPlugin,
    PgManyToManyPlugin,
    ConnectionFilterPlugin,
    SubscriptionsLds
  ],
  graphileBuildOptions: {
    connectionFilterRelations: true,
  },

}

const app = express();

app.use(postgraphile(DATABASE_URL, SCHEMA_NAMES, postgraphileOpt))

app.listen(6060);
