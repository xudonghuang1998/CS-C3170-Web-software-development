import { Application, Router } from "https://deno.land/x/oak@v6.3.2/mod.ts";

const app = new Application();
const router = new Router();

const filterRequest = async({request, response}) => {
  const body = request.body({type: 'json'});
  const reqDocument = await body.value;

  const respDocument = {};

  if (reqDocument.hasOwnProperty('name')) {
    respDocument.name = reqDocument.name;
  }

  if (reqDocument.hasOwnProperty('address')) {
    respDocument.address = reqDocument.address;
  }

  response.body = respDocument;
}

router.post('/', filterRequest);

app.use(router.routes());

if (!Deno.env.get('TEST_ENVIRONMENT')) {
  app.listen({ port: 7777 });
}

export default app;
