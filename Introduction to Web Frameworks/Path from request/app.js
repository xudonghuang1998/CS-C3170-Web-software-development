import { Application } from "https://deno.land/x/oak@v6.3.2/mod.ts";

const app = new Application();

const greet = ({request, response}) => {
  response.body = request.url.pathname;
};

app.use(greet);

if (!Deno.env.get('TEST_ENVIRONMENT')) {
    app.listen({ port: 7777 });
}

export default app;
