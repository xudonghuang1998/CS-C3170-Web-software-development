import { Application, Router } from "https://deno.land/x/oak@v6.3.2/mod.ts";
import { Session } from "https://deno.land/x/session@v1.0.0/mod.ts";

const app = new Application();

const session = new Session({ framework: "oak" });
await session.init();

app.use(session.use()(session));

const router = new Router();

const helloName = async({session, response}) => {
  let name = await session.get('name');
  if (!name) {
    name = 'anonymous';
  }

  response.body = `Hello ${name}!`;
}

const setName = async({request, session, response}) => {
  const body = request.body();
  const params = await body.value;
  await session.set('name', params.get('name'));

  response.body = 'OK';
}

router.get('/', helloName);
router.post('/', setName);

app.use(router.routes());

if (!Deno.env.get('TEST_ENVIRONMENT')) {
  app.listen({ port: 7777 });
}

export default app;
