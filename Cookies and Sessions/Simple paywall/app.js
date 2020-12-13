import { Application } from "https://deno.land/x/oak@v6.3.2/mod.ts";
import { Session } from "https://deno.land/x/session@v1.0.0/mod.ts";

const app = new Application();

const session = new Session({ framework: "oak" });
await session.init();

app.use(session.use()(session));

const paywall = async({session, response}) => {
  let visits = await session.get('visit-count');
  if (!visits) {
    visits = 1;
  }

  await session.set('visit-count', Number(visits) + 1);

  if (visits > 3) {
    response.body = 'No more free truths. Payment required.';
  } else {
    response.body = 'Welcome! Here are the truths that you are seeking for!';
  }
};

app.use(paywall);

if (!Deno.env.get('TEST_ENVIRONMENT')) {
  app.listen({ port: 7777 });
}

export default app;
