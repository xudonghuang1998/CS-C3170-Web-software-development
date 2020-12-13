import { Application, Router } from "https://deno.land/x/oak@v6.3.2/mod.ts";

const app = new Application();
const router = new Router();

const helloGet = ({response}) => {
  response.body = 'Hello GET!';
}

const helloPost = ({response}) => {
  response.body = 'Hello POST!';
}

router.get('/', helloGet);
router.post('/', helloPost);

app.use(router.routes());

export { app };
