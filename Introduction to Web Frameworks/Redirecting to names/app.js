import { Application, Router } from "https://deno.land/x/oak@v6.3.2/mod.ts";

const app = new Application();
const router = new Router();

const names = ({response}) => {
  response.body = 'Hello names!';
}

const redirectToNames = ({response}) => {
  response.redirect('/names');
}

router.get('/', redirectToNames);
router.get('/names', names);
router.post('/names', redirectToNames);

app.use(router.routes());

if (!Deno.env.get('TEST_ENVIRONMENT')) {
  app.listen({ port: 7777 });
}

export default app;
