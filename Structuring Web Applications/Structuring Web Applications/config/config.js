let config = {};

if (Deno.env.get('TEST_ENVIRONMENT')) {
  config.database = {};
} else {
  config.database = {
    hostname: "XXX.elephantsql.com",
    database: "XXX",
    user: "XXX",
    password: "XXX",
    port: 5432
  };
}

export { config }; 
