import { Application, Router } from "https://deno.land/x/oak@v6.3.2/mod.ts";
import { viewEngine, engineFactory, adapterFactory } from "https://raw.githubusercontent.com/deligenius/view-engine/master/mod.ts";
import { Session } from "https://deno.land/x/session@v1.0.0/mod.ts";

const app = new Application();

const session = new Session({ framework: "oak" });
await session.init();

app.use(session.use()(session));

const ejsEngine = engineFactory.getEjsEngine();
const oakAdapter = adapterFactory.getOakAdapter();
app.use(viewEngine(oakAdapter, ejsEngine));

const router = new Router();

const postForm = async({request, response, session}) => {
  const body = request.body();
  const params = await body.value;

  const password = params.get('password');

  if (password === 'hippopotamus') {
    await session.set('authenticated', true);
    response.body = 'Authentication successful.';
  } else {
    response.body = 'Wrong password.';
  }
}

const showMain = async({render, session}) => {
  const authenticated = await session.get('authenticated');

  if (authenticated) {
    render('secret.ejs');
  } else {
    render('index.ejs');  
  }
}

router.get('/', showMain);
router.post('/', postForm);

app.use(router.routes());

if (!Deno.env.get('TEST_ENVIRONMENT')) {
  app.listen({ port: 7777 });
}

export default app;
