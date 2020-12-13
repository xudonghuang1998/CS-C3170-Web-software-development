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

const getItemsFromSession = async(session) => {
  let items = await session.get('items');
  if (!items) {
    items = [];
  }

  return items;
}

const addItemToSession = async(session, item) => {
  const items = await getItemsFromSession(session);
  items.push(item);
  await session.set('items', items);
}

const listItems = async({session, render}) => {
  render('index.ejs', {items: await getItemsFromSession(session)});
}

const addItem = async({request, session, render}) => {
  const body = request.body();
  const params = await body.value;
  await addItemToSession(session, params.get('item'));
  render('index.ejs', {items: await getItemsFromSession(session)});
}

router.get('/', listItems);
router.post('/', addItem);

app.use(router.routes());

if (!Deno.env.get('TEST_ENVIRONMENT')) {
  app.listen({ port: 7777 });
}

export default app;
