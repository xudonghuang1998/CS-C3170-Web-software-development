import { Application, Router } from "https://deno.land/x/oak@v6.3.2/mod.ts";

const app = new Application();
const router = new Router();

const mirrorRequest = async({request, response}) => {
  const body = request.body({type: 'json'});
  response.body = await body.value;
}

router.post('/', mirrorRequest);

app.use(router.routes());

if (!Deno.env.get('TEST_ENVIRONMENT')) {
  app.listen({ port: 7777 });
}

export default app;
