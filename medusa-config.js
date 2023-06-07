const dotenv = require("dotenv");

let ENV_FILE_NAME = "";
switch (process.env.NODE_ENV) {
  case "production":
    ENV_FILE_NAME = ".env.production";
    break;
  case "staging":
    ENV_FILE_NAME = ".env.staging";
    break;
  case "test":
    ENV_FILE_NAME = ".env.test";
    break;
  case "development":
  default:
    ENV_FILE_NAME = ".env";
    break;
}

try {
  dotenv.config({ path: process.cwd() + "/" + ENV_FILE_NAME });
} catch (e) { }

// CORS when consuming Medusa from admin
const ADMIN_CORS =
  process.env.ADMIN_CORS || "http://192.168.1.183:8100,http://192.168.1.183:8101,http://localhost:7000,http://localhost:7001";

// CORS to avoid issues when consuming Medusa from a client
const STORE_CORS = process.env.STORE_CORS || '193.34.76.44:443,https://6263-2a00-23c7-dc8c-301-29ff-cb9c-79f-82ec.ngrok-free.app,http://localhost:8100,http://localhost:8101,capacitor://localhost';

const DATABASE_TYPE = process.env.DATABASE_TYPE || 'postgres';
const DATABASE_URL = process.env.DATABASE_URL || 'postgres://ricardobento:0000@localhost:5436/postgres';
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const plugins = [
  `medusa-fulfillment-manual`,
  `medusa-payment-manual`,
  // To enable the admin plugin, uncomment the following lines and run `yarn add @medusajs/admin`
  {
    resolve: "@medusajs/admin",
    /** @type {import('@medusajs/admin').PluginOptions} */
    options: {
      autoRebuild: true,
    },
  },
  {
    resolve: `medusa-payment-stripe`,
    options: {
      api_key: process.env.STRIPE_API_KEY,
      webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
    },
  },
  {
    resolve: `medusa-file-cloudinary`,
    options: {
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_KEY,
      api_secret: process.env.CLOUDINARY_SECRET,
      secure: true,
    },
  },
];

const modules = {
  // eventBus: {
  //   resolve: "@medusajs/event-bus-redis",
  //   options: {
  //     redisUrl: REDIS_URL
  //   }
  // },
  // cacheService: {
  //   resolve: "@medusajs/cache-redis",
  //   options: {
  //     redisUrl: REDIS_URL
  //   }
  // },
}

/** @type {import('@medusajs/medusa').ConfigModule["projectConfig"]} */
const projectConfig = {
  jwtSecret: process.env.JWT_SECRET,
  cookieSecret: process.env.COOKIE_SECRET,
  database_database: "./medusa-db.sql",
  database_type: DATABASE_TYPE,
  store_cors: STORE_CORS,
  admin_cors: ADMIN_CORS,
  // redis_url: REDIS_URL
}

if (DATABASE_URL && DATABASE_TYPE === "postgres") {
  projectConfig.database_url = DATABASE_URL;
  delete projectConfig["database_database"];
}


/** @type {import('@medusajs/medusa').ConfigModule} */
module.exports = {
  projectConfig,
  plugins,
  modules,
};
