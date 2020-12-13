import { Application, Router } from "https://deno.land/x/oak@v6.3.2/mod.ts";
import { viewEngine, engineFactory, adapterFactory } from "https://raw.githubusercontent.com/deligenius/view-engine/master/mod.ts";
import { Client } from "https://deno.land/x/postgres@v0.4.5/mod.ts";

const client = new Client({
});

const app = new Application();
const router = new Router();

const ejsEngine = engineFactory.getEjsEngine();
const oakAdapter = adapterFactory.getOakAdapter();
app.use(viewEngine(oakAdapter, ejsEngine));

const executeQuery = async(query, ...args) => {
  try {
      await client.connect();
      return await client.query(query, ...args);
  } catch (e) {
      console.log(e);
  } finally {
      await client.end();
  }
}

const listTickets = async({render}) => {
  const res = await executeQuery('SELECT * FROM tickets');
  let rows = [];
  if (res) {
    rows = res.rowsOfObjects();
  }

  const data = {
    tickets: rows
  };
  
  render('index.ejs', data);
}

const addTicket = async({request, render}) => {
  const body = request.body();
  const params = await body.value;
  const content = params.get('content');

  await executeQuery('INSERT INTO tickets (content, reported_on) VALUES ($1, NOW());', content);
  await listTickets({render: render});
}

router.get('/tickets', listTickets);
router.post('/tickets', addTicket);

app.use(router.routes());

if (!Deno.env.get('TEST_ENVIRONMENT')) {
  app.listen({ port: 7777 });
}

export default app;
