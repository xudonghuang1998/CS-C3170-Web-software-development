import { Application, Router } from "https://deno.land/x/oak@v6.3.2/mod.ts";
import { viewEngine, engineFactory, adapterFactory } from "https://raw.githubusercontent.com/deligenius/view-engine/master/mod.ts";

const app = new Application();
const router = new Router();

const ejsEngine = engineFactory.getEjsEngine();
const oakAdapter = adapterFactory.getOakAdapter();

app.use(viewEngine(oakAdapter, ejsEngine));

const showForm = ({render}) => {
  render('index.ejs', data);
}

const submitForm = async({request, response}) => {
  const body = request.body();
  const params = await body.value;

  if (!params.has('name') || params.get('name').length < 4) {
    response.body = 'Invalid name';
    return;
  } 

  if (!params.has('yearOfBirth') || Number(params.get('yearOfBirth')).toString() !== params.get('yearOfBirth')) {
    response.body = 'Invalid year of birth';
    return;
  } 

  if (Number(params.get('yearOfBirth')) < 1900 || Number(params.get('yearOfBirth')) > 2000) {
    response.body = 'Year of birth should be between 1900 and 2000';
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
