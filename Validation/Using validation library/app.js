import { Application, Router } from "https://deno.land/x/oak@v6.3.2/mod.ts";
import { viewEngine, engineFactory, adapterFactory } from "https://raw.githubusercontent.com/deligenius/view-engine/master/mod.ts";
import { validate, isNumber, required, numberBetween, minLength } from "https://deno.land/x/validasaur@v0.15.0/mod.ts";

const app = new Application();
const router = new Router();

const ejsEngine = engineFactory.getEjsEngine();
const oakAdapter = adapterFactory.getOakAdapter();

app.use(viewEngine(oakAdapter, ejsEngine));

const getData = async (request) => {
  const data = {
    name: "",
    yearOfBirth: "",
    errors: null // or errors: {}
  };

  if (request) {
    const body = request.body();
    const params = await body.value;
    data.name = params.get("name");
    data.yearOfBirth = parseInt(params.get("yearOfBirth"));
  }

  return data;
};

const validationRules = {
  name: [required, minLength(4)],
  yearOfBirth: [required, isNumber, numberBetween(1900,2000)]
};

const showForm = ({render}) => {
  render('index.ejs', { errors: [], name: '', yearOfBirth: '' });
}

const submitForm = async({request, render}) => {
  const data = await getData(request);
  const [passes, errors] = await validate(data, validationRules);

  if (!passes) {
    data.errors = errors;
    render("index.ejs", data);
  } else {
    // data was ok, add it
    render("index.ejs", await getData());
  }
}

router.get('/', showForm);
router.post('/', submitForm);

app.use(router.routes());

if (!Deno.env.get('TEST_ENVIRONMENT')) {
  app.listen({ port: 7777 });
}
  
export default app;
