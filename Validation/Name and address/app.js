import { Application, Router } from "https://deno.land/x/oak@v6.3.2/mod.ts";
import { viewEngine, engineFactory, adapterFactory } from "https://raw.githubusercontent.com/deligenius/view-engine/master/mod.ts";

const app = new Application();
const router = new Router();

const ejsEngine = engineFactory.getEjsEngine();
const oakAdapter = adapterFactory.getOakAdapter();

app.use(viewEngine(oakAdapter, ejsEngine));

const showForm = ({render}) => {
  render('index.ejs');
}

const submitForm = async({request, response}) => {
  const body = request.body();
  const params = await body.value;

  if (!params.has('name') || params.get('name').length < 4) {
    response.body = 'Invalid name';
    return;
  } 

  if (!params.has('address') || params.get('address').length < 6) {
    response.body = 'Invalid address';
    return;
  } 

  response.body = 'Ok!'
}

router.get('/', showForm);
router.post('/', submitForm);

app.use(router.routes());

if (!Deno.env.get('TEST_ENVIRONMENT')) {
  app.listen({ port: 7777 });
}
  
export default app;
