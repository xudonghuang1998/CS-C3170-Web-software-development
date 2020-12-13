import { Application, Router } from "https://deno.land/x/oak@v6.3.2/mod.ts";
import { viewEngine, engineFactory, adapterFactory } from "https://raw.githubusercontent.com/deligenius/view-engine/master/mod.ts";

const app = new Application();
const router = new Router();

const ejsEngine = engineFactory.getEjsEngine();
const oakAdapter = adapterFactory.getOakAdapter();
app.use(viewEngine(oakAdapter, ejsEngine));

const getData = (params) => {
  let name = 'Batman';
  if (params && params.name) {
    name = params.name;
  }

  let emotion = 'tired';
  if (params && params.emotion) {
    emotion = params.emotion;
  }

  return {
    name: name,
    emotion: emotion
  }
}

const viewStoryWithContent = ({params, render}) => {
  render('index.ejs', getData(params));
}

const viewStory = ({render}) => {
  render('index.ejs', getData());
}

router.get('/name/:name/emotion/:emotion', viewStoryWithContent);
router.get('/', viewStory);

app.use(router.routes());

if (!Deno.env.get('TEST_ENVIRONMENT')) {
  app.listen({ port: 7777 });
}

export default app;
