import { Application } from "https://deno.land/x/oak@v6.3.2/mod.ts";
import { Session } from "https://deno.land/x/session@v1.0.0/mod.ts";

const app = new Application();

const session = new Session({ framework: "oak" });
await session.init();

app.use(session.use()(session));

const greeting = async({session, response}) => {
  let knownUser = await session.get('known-user');
  if (!knownUser) {
    response.body = 'Welcome stranger!';
  }  else {
    response.body = 'Hi again!';
  }

  await session.set('known-user', true);
};

app.use(greeting);

if (!Deno.env.get('TEST_ENVIRONMENT')) {
  app.listen({ port: 7777 });
}

export default app;
