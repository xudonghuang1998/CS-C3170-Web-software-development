import { Application, Router } from "https://deno.land/x/oak@v6.3.2/mod.ts";

const app = new Application();
const router = new Router();

let message = 'Hello'

const helloGet = ({response}) => {
  response.body = message;
}

const helloPost = async({request, response}) => {
  const body = request.body();
  const params = await body.value;

  if (params.has('message')) {
    message = params.get('message');
    response.body = 'Done!';
  } else {
    response.body = 'We are not sure what you planned!';
  }
}

router.get('/', helloGet);
router.post('/', helloPost);

app.use(router.routes());

export { app };
