import { Application } from "https://deno.land/x/oak@v6.3.2/mod.ts";
import { Session } from "https://deno.land/x/session@v1.0.0/mod.ts";

const app = new Application();

const session = new Session({ framework: "oak" });
await session.init();

app.use(session.use()(session));

const counter = async({session, response}) => {
  let count = await session.get('count');
  if (!count) {
    count = 1;
  } 
  await session.set('count', Number(count) + 1);

  response.body = `${count}`;
};

app.use(counter);

if (!Deno.env.get('TEST_ENVIRONMENT')) {
  app.listen({ port: 7777 });
}

export default app;
