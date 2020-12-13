import { Application } from "https://deno.land/x/oak@v6.3.2/mod.ts";

const app = new Application();

const first = async(context, next) => {
  console.log('Hello');
  await next();
}

const second = async(context, next) => {
  console.log('world');
  await next();
}

const hello = ({response}) => {
  response.body = 'Hello world!';
}

app.use(first);
app.use(second);
app.use(hello);

if (!Deno.env.get('TEST_ENVIRONMENT')) {
  app.listen({ port: 7777 });
}

export default app;
