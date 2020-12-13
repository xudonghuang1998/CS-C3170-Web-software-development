import { Application, Router } from "https://deno.land/x/oak@v6.3.2/mod.ts";
import { viewEngine, engineFactory, adapterFactory } from "https://raw.githubusercontent.com/deligenius/view-engine/master/mod.ts";

const app = new Application();
const router = new Router();

const ejsEngine = engineFactory.getEjsEngine();
const oakAdapter = adapterFactory.getOakAdapter();
app.use(viewEngine(oakAdapter, ejsEngine));

const showSum = async({request, response}) => {
  const body = request.body();
  const params = await body.value;
  const sum = Number(params.get('first')) + Number(params.get('second'));
  response.body = sum;
}

const viewForm = ({render}) => {
  render('index.ejs');
}

router.post('/', showSum);
router.get('/', viewForm);

app.use(router.routes());

if (!Deno.env.get('TEST_ENVIRONMENT')) {
  app.listen({ port: 7777 });
}

export default app;
