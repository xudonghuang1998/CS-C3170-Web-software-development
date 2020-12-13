import { Application } from "https://deno.land/x/oak@v6.3.2/mod.ts";

const app = new Application();

const happy = async(context, next) => {
  await next();
  context.response.body = context.response.body + ':D';
}

const hello = ({response}) => {
  response.body = 'Hello world!';
}

app.use(happy);
app.use(hello);

if (!Deno.env.get('TEST_ENVIRONMENT')) {
  app.listen({ port: 7777 });
}

export default app;
