import { Application, Router } from "https://deno.land/x/oak@v6.3.2/mod.ts";

const app = new Application();
const router = new Router();

const hello = ({response}) => {
  response.body = 'Hello world!';
};

const confirmation = ({response}) => {
  response.body = 'Yes, it works!';
};

router.get('/', hello);
router.get('/test', confirmation);

app.use(router.routes());

if (!Deno.env.get('TEST_ENVIRONMENT')) {
    app.listen({ port: 7777 });
}

export default app;
