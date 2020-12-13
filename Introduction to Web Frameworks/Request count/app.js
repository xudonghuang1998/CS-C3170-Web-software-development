import { Application, Router } from "https://deno.land/x/oak@v6.3.2/mod.ts";

const app = new Application();
const router = new Router();

let count = 0;

const getCount = ({response}) => {
  count++;

  response.body = {
    count: count
  };
}

router.get('/', getCount);

app.use(router.routes());

if (!Deno.env.get('TEST_ENVIRONMENT')) {
  app.listen({ port: 7777 });
}

export default app;
