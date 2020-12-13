import { Application } from "https://deno.land/x/oak@v6.3.2/mod.ts";

const app = new Application();

const hello = ({cookies, response}) => {
  let secret = 'undefined';
  if (cookies.get('secret')) {
    secret = cookies.get('secret');
  }
  
  response.body = `The secret is ${secret}`;
}

app.use(hello);

if (!Deno.env.get('TEST_ENVIRONMENT')) {
  app.listen({ port: 7777 });
}

export default app;
