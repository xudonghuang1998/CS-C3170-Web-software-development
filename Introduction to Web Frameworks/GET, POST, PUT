import { Application, Router } from "https://deno.land/x/oak@v6.3.2/mod.ts";

const app = new Application();
const router = new Router();

const getMsg = ({response}) => {
  response.body = 'GET request';
}

const postMsg = ({response}) => {
  response.body = 'POST request';
}

const putMsg = ({response}) => {
  response.body = 'PUT request';
}

router.get('/', getMsg);
router.post('/', postMsg);
router.put('/', putMsg);

app.use(router.routes());

if (!Deno.env.get('TEST_ENVIRONMENT')) {
    app.listen({ port: 7777 });
}

export default app;
