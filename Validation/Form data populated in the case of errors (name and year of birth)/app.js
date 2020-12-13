import { Application, Router } from "https://deno.land/x/oak@v6.3.2/mod.ts";
import { viewEngine, engineFactory, adapterFactory } from "https://raw.githubusercontent.com/deligenius/view-engine/master/mod.ts";

const app = new Application();
const router = new Router();

const ejsEngine = engineFactory.getEjsEngine();
const oakAdapter = adapterFactory.getOakAdapter();

app.use(viewEngine(oakAdapter, ejsEngine));

const showForm = ({render}) => {
  render('index.ejs', { errors: [], name: '', yearOfBirth: '' });
}

const submitForm = async({request, render}) => {
  const body = request.body();
  const params = await body.value;

  const errors = [];

  let name = params.has('name') ? params.get('name') : '';
  let yearOfBirth = params.has('yearOfBirth') ? params.get('yearOfBirth') : '';

  if (!params.has('name') || params.get('name').length < 4) {
    errors.push('Invalid name');
  } 

  if (!params.has('yearOfBirth') || Number(params.get('yearOfBirth')).toString() !== params.get('yearOfBirth')) {
    errors.push('Invalid year of birth');
  } 

  if (Number(params.get('yearOfBirth')) < 1900 || Number(params.get('yearOfBirth')) > 2000) {
    errors.push('Year of birth should be between 1900 and 2000');
  }

  if (errors.length === 0) {
    name = '';
    yearOfBirth = '';
  }

  render('index.ejs', { errors: errors, name: name, yearOfBirth: yearOfBirth });
}

router.get('/', showForm);
router.post('/', submitForm);

app.use(router.routes());

if (!Deno.env.get('TEST_ENVIRONMENT')) {
  app.listen({ port: 7777 });
}
  
export default app;
