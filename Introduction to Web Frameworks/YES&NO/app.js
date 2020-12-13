import { Application, Router } from "https://deno.land/x/oak@v6.3.2/mod.ts";

const app = new Application();
const router = new Router();

let message = 'Yes';

const msg = ({response}) => {
  response.body = message;

  if (message === 'Yes') {
    message = 'No';
  } else {
    message = 'Yes';
  }
}

router.get('/', msg);

app.use(router.routes());

if (!Deno.env.get('TEST_ENVIRONMENT')) {
  app.listen({ port: 7777 });
}

export default app;
