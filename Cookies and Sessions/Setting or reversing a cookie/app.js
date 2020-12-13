import { Application } from "https://deno.land/x/oak@v6.3.2/mod.ts";

const app = new Application();

const hello = ({cookies, response}) => {
  let value = 'saippuakauppias';
  if (cookies.get('reverse')) {
    value = cookies.get('reverse').split("").reverse().join("");
  }

  cookies.set('reverse', value);
  
  response.body = 'Hello world!';
}

app.use(hello);

if (!Deno.env.get('TEST_ENVIRONMENT')) {
  app.listen({ port: 7777 });
}

export default app;
