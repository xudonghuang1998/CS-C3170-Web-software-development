import { Application, Router } from "https://deno.land/x/oak@v6.3.2/mod.ts";
import { viewEngine, engineFactory, adapterFactory } from "https://raw.githubusercontent.com/deligenius/view-engine/master/mod.ts";
import { Client } from "https://deno.land/x/postgres@v0.4.5/mod.ts";
import * as base64 from "https://deno.land/x/base64@v0.2.1/mod.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";


const app = new Application();
const router = new Router();

const ejsEngine = engineFactory.getEjsEngine();
const oakAdapter = adapterFactory.getOakAdapter();
app.use(viewEngine(oakAdapter, ejsEngine));

const client = new Client({
  // hostname: "hattie.db.elephantsql.com",
  // database: "xlguwxko",
  // user: "xlguwxko",
  // password: "vOIJb7Qy3ubq_a1ovqH_uk7O3k1DBb2T",
  // port: 5432
});

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

const form = ({render}) => {
  render('index.ejs');
};

const upload = async({request, response}) => {
  const body = request.body();
  const reader = await body.value;
  const data = await reader.read();
  const fileDetails = data.files[0];
  const pw = `${Math.floor(100000 * Math.random())}`;
  const hash = await bcrypt.hash(pw);
  // reading file contents
  const fileContents = await Deno.readAll(await Deno.open(fileDetails.filename));
  await executeQuery("INSERT INTO stored_files (name, type, password, length, data) VALUES ($1, $2, $3, $4, $5);",
      fileDetails.originalName,
      fileDetails.contentType,
      hash,
      fileContents.length,
      base64.fromUint8Array(fileContents)
  );
  response.body = pw;
};

const download = async({request, response}) => {
  const body = request.body();
  const params = await body.value;
  const id = params.get('id');
  const password = params.get('password');
  const res = await executeQuery("SELECT * FROM stored_files WHERE id = $1;", id);
  if (res.rowCount === 0) {
    response.status = 401;
    return;
  }
  const obj = res.rowsOfObjects()[0];
  const hash = obj.password;
  const passwordCorrect = await bcrypt.compare(password, hash);
  if (!passwordCorrect) {
    response.status = 401;
    return;
  }
  response.headers.set('Content-Type', obj.type);
  const arr = base64.toUint8Array(obj.data);
  response.headers.set('Content-Length', arr.length);
  response.body = arr;
};

router.get('/', form);
router.post('/', upload);
router.post('/files', download)

app.use(router.routes());

if (!Deno.env.get('TEST_ENVIRONMENT')) {
  app.listen({ port: 7777 });
}
export default app;
