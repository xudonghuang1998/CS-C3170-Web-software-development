import { Application } from "https://deno.land/x/oak@v6.3.2/mod.ts";

const app = new Application();

const time = async({ response }, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  response.body = response.body + ` ${ms}ms`;
}

const hello = ({response}) => {
  response.body = 'Hello world!';
}

app.use(time);
app.use(hello);

if (!Deno.env.get('TEST_ENVIRONMENT')) {
  app.listen({ port: 7777 });
}

export default app;
