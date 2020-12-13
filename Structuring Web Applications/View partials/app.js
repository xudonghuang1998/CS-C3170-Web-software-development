import { Application } from "https://deno.land/x/oak@v6.3.2/mod.ts";
import { viewEngine, engineFactory, adapterFactory } from "https://raw.githubusercontent.com/deligenius/view-engine/master/mod.ts";

const app = new Application();

const ejsEngine = engineFactory.getEjsEngine();
const oakAdapter = adapterFactory.getOakAdapter();
app.use(viewEngine(oakAdapter, ejsEngine));

app.use(({render}) => {
  render('index.ejs');
});

if (!Deno.env.get('TEST_ENVIRONMENT')) {
  app.listen({ port: 7777 });
}
    
export default app;
