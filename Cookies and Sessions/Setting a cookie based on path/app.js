import { Application } from "https://deno.land/x/oak@v6.3.2/mod.ts";

const app = new Application();

const hello = ({cookies, response, request}) => {
  if (request.url.pathname.includes('admin')) {
    cookies.set('admin', 'true');
  } else {
    cookies.set('admin', 'false');
  }
  
  response.body = 'Hello world!';
}

app.use(hello);

if (!Deno.env.get('TEST_ENVIRONMENT')) {
  app.listen({ port: 7777 });
}

export default app;
