import { Application, Router } from "https://deno.land/x/oak@v6.3.2/mod.ts";
import { viewEngine, engineFactory, adapterFactory } from "https://raw.githubusercontent.com/deligenius/view-engine/master/mod.ts";

const app = new Application();
const router = new Router();

const ejsEngine = engineFactory.getEjsEngine();
const oakAdapter = adapterFactory.getOakAdapter();
app.use(viewEngine(oakAdapter, ejsEngine));

const showForm = ({render}) => {
  render('index.ejs');
};

const processUpload = async({request, response}) => {
  const body = request.body({type: 'form-data'});
  const reader = await body.value;
  const data = await reader.read();
  const fileDetails = data.files[0];
  response.body = fileDetails.contentType;
};

router.get('/', showForm);
router.post('/', processUpload);

app.use(router.routes());

if (!Deno.env.get('TEST_ENVIRONMENT')) {
    app.listen({ port: 7777 });
}
export default app;
