import { Application, Router } from "https://deno.land/x/oak@v6.3.2/mod.ts";
import { viewEngine, engineFactory, adapterFactory } from "https://raw.githubusercontent.com/deligenius/view-engine/master/mod.ts";
import { Client } from "https://deno.land/x/postgres@v0.4.5/mod.ts";

// set your database credentials here (clear them for submission though)
let client = new Client({
  hostname: "hostname-possibly-at-elephantsql.com",
  database: "database-name",
  user: "user-name-typically-same-as-database-name",
  password: "password",
  port: 5432
});

// but do not change this
if (Deno.env.get('TEST_ENVIRONMENT')) {
  client = new Client({});
}

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

const app = new Application();
const router = new Router();

const ejsEngine = engineFactory.getEjsEngine();
const oakAdapter = adapterFactory.getOakAdapter();

app.use(viewEngine(oakAdapter, ejsEngine));

const getSongs = async() => {
  const songs = await executeQuery("SELECT * FROM songs");
  if (!songs) {
    return [];
  }
  return songs.rowsOfObjects();
}

const getData = async (request) => {
  const data = {
    name: "",
    rating: "",
    errors: [],
  };

  if (request) {
    const body = request.body();
    const params = await body.value;
    data.name = params.get("name");
    data.rating = params.get("rating");
  }

  return data;
};

const validate = (data) => {
  const errors = [];

  if (!data.name || data.name.length < 5 || data.name.length > 20) {
    errors.push('Song name must be between 5 and 20 characters long');
  }
  
  if (!data.rating || 
      Number(data.rating).toString() !== data.rating  || 
      Number(data.rating) < 1 || 
      Number(data.rating) > 10) {
    errors.push('Rating must be a number between 1 and 10');
  }
  
  return errors;
};


const showForm = async({render}) => {
  const data = await getData();
  data.songs = await getSongs();

  render('index.ejs', data);
}

const submitForm = async({request, render}) => {
  const data = await getData(request);
  data.errors = validate(data);

  if (data.errors.length > 0) {
    
    data.songs = await getSongs();
    render("index.ejs", data);

  } else {
    await executeQuery('INSERT INTO songs (name, rating) VALUES ($1, $2);', data.name, data.rating);

    let d = await getData();
    d.songs = await getSongs();

    render("index.ejs", d);
  }
};

router.get('/', showForm);
router.post('/', submitForm);

app.use(router.routes());

if (!Deno.env.get('TEST_ENVIRONMENT')) {
  app.listen({ port: 7777 });
}
  
export default app;
