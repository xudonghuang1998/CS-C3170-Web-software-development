import { Application } from "https://deno.land/x/oak@v6.3.2/mod.ts";

const app = new Application();

const log = async(context, next) => {
  console.log('Hello!');
  await next();
}

const hello = ({response}) => {
  response.body = 'Hello world!';
}

app.use(log);
app.use(hello);

if (!Deno.env.get('TEST_ENVIRONMENT')) {
  app.listen({ port: 7777 });
}

export default app;
