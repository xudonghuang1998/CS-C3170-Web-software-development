import { Application, Router } from "https://deno.land/x/oak@v6.3.2/mod.ts";
import { viewEngine, engineFactory, adapterFactory } from "https://raw.githubusercontent.com/deligenius/view-engine/master/mod.ts";

const app = new Application();
const router = new Router();

const ejsEngine = engineFactory.getEjsEngine();
const oakAdapter = adapterFactory.getOakAdapter();

app.use(viewEngine(oakAdapter, ejsEngine));

const showForm = ({render}) => {
  render('index.ejs', { errors: [] });
}

const submitForm = async({request, render}) => {
  const body = request.body();
  const params = await body.value;

  const errors = [];

  if (!params.has('name') || params.get('name').length < 4) {
    errors.push('Invalid name');
  } 

  if (!params.has('address') || params.get('address').length < 6) {
    errors.push('Invalid address');
  } 

  render('index.ejs', {errors: errors});
}

router.get('/', showForm);
router.post('/', submitForm);

app.use(router.routes());

if (!Deno.env.get('TEST_ENVIRONMENT')) {
  app.listen({ port: 7777 });
}
  
export default app;
