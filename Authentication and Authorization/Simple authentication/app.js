import { Application, Router } from "https://deno.land/x/oak@v6.3.2/mod.ts";
import { Session } from "https://deno.land/x/session@v1.0.0/mod.ts";

const app = new Application();
const router = new Router();

const session = new Session({ framework: "oak" });
await session.init();

app.use(session.use()(session));


const showStatus = async({response, session}) => {
  if (await session.get('authenticated')) {
    response.body = 'Authenticated';
  } else {
    response.body = 'Not authenticated';
  }
}

const authenticate = async({request, response, session}) => {
  const body = request.body();
  const params = await body.value;

  const username = params.get('username');
  const password = params.get('password');

  if (username === 'Minuteman' && password === '00000000') {
    await session.set('authenticated', true);
    response.status = 200;
  } else {
    response.status = 401;
  }
}

router.get('/', showStatus);
router.post('/', authenticate);

app.use(router.routes());

if (!Deno.env.get('TEST_ENVIRONMENT')) {
  app.listen({ port: 7777 });
}
  
export default app;
