import { Application, Router } from "https://deno.land/x/oak@v6.3.2/mod.ts";
import { Client } from "https://deno.land/x/postgres@v0.4.5/mod.ts";

const client = new Client({
});

const app = new Application();
const router = new Router();

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

const getSongs = async({response}) => {
  const result = await executeQuery('SELECT * FROM songs');
  let res = [];
  if (result) {
    res = result.rowsOfObjects();
  }

  response.body = res;
}

const getSong = async({response, params}) => {
  const result = await executeQuery('SELECT * FROM songs WHERE id = $1', params.id);
  let res = [];
  if (result) {
    res = result.rowsOfObjects();
  }

  if (res.length > 0) {
    response.body = res[0];
  } else {
    response.body = {};
  }
}

const addSong = async({request, response}) => {
  const body = request.body({type: 'json'});  
  const document = await body.value;

  await executeQuery('INSERT INTO songs (name, rating) VALUES ($1, $2);', document.name, document.rating);

  response.body = {status: 'success'};
}

const deleteSong = async({params, response}) => {
  await executeQuery('DELETE FROM songs WHERE id = $1;', params.id);
  response.body = {status: 'success'};
}

router.get('/songs', getSongs);
router.get('/songs/:id', getSong);
router.post('/songs', addSong);
router.delete('/songs/:id', deleteSong);

app.use(router.routes());

if (!Deno.env.get('TEST_ENVIRONMENT')) {
  app.listen({ port: 7777 });
}

export default app;
