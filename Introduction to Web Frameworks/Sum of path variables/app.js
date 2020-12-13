import { Application, Router } from "https://deno.land/x/oak@v6.3.2/mod.ts";

const app = new Application();
const router = new Router();

const sum = ({params, response}) => {
  response.body = `${Number(params.first) + Number(params.second)}`;
}

router.get('/sum/:first/:second', sum);

app.use(router.routes());

if (!Deno.env.get('TEST_ENVIRONMENT')) {
  app.listen({ port: 7777 });
}

export default app;
