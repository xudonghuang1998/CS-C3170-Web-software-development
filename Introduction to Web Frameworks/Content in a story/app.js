import { Application, Router } from "https://deno.land/x/oak@v6.3.2/mod.ts";
import { viewEngine, engineFactory, adapterFactory } from "https://raw.githubusercontent.com/deligenius/view-engine/master/mod.ts";

const app = new Application();
const router = new Router();

const ejsEngine = engineFactory.getEjsEngine();
const oakAdapter = adapterFactory.getOakAdapter();
app.use(viewEngine(oakAdapter, ejsEngine));

const getData = async(request) => {
  let params = new URLSearchParams();
  if (request) {
    const body = request.body();
    params = await body.value;
  }

  let name = 'Batman';
  if (params.has('name')) {
    name = params.get('name');
  }

  let emotion = 'tired';
  if (params.has('emotion')) {
    emotion = params.get('emotion');
  }

  return {
    name: name,
    emotion: emotion
  }
}

const submitForm = async({request, render}) => {
  const data = await getData(request);
  render('index.ejs', data);
}

const viewForm = async({render}) => {
  const data = await getData();
  render('index.ejs', data);
}

router.post('/', submitForm);
router.get('/', viewForm);

app.use(router.routes());

if (!Deno.env.get('TEST_ENVIRONMENT')) {
  app.listen({ port: 7777 });
}

export default app;
