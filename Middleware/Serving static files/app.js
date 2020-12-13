import { Application, send } from "https://deno.land/x/oak@v6.3.2/mod.ts";

const app = new Application();

const serveStaticFiles = async (context, next) => {
  if (context.request.url.pathname.startsWith('/static')) {
    const path = context.request.url.pathname.substring(7);

    await send(context, path, {
      root: `${Deno.cwd()}/static`
    });

  } else {
    await next();
  }
}

const hello = ({response}) => {
  response.body = 'Hello world!';
}

app.use(serveStaticFiles);
app.use(hello);

if (!Deno.env.get('TEST_ENVIRONMENT')) {
  app.listen({ port: 7777 });
}

export default app;
