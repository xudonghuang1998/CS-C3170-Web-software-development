import { Application, Router } from "https://deno.land/x/oak@v6.3.2/mod.ts";
import { viewEngine, engineFactory, adapterFactory } from "https://raw.githubusercontent.com/deligenius/view-engine/master/mod.ts";
import { Session } from "https://deno.land/x/session@v1.0.0/mod.ts";

const app = new Application();

const session = new Session({ framework: "oak" });
await session.init();

app.use(session.use()(session));

const ejsEngine = engineFactory.getEjsEngine();
const oakAdapter = adapterFactory.getOakAdapter();
app.use(viewEngine(oakAdapter, ejsEngine));

const router = new Router();

const getTasksFromSession = async(session) => {
  let tasks = await session.get('tasks');
  if (!tasks) {
    tasks = [];
  }

  return tasks;
}

const setTasksToSession = async(session, tasks) => {
  await session.set('tasks', tasks);
}

const addTaskToSession = async(session, task) => {
  const tasks = await getTasksFromSession(session);
  tasks.push(task);
  await setTasksToSession(session, tasks);
}

const listTasks = async({render, session}) => {
  render('index.ejs', { tasks : await getTasksFromSession(session) });
}

const addTask = async({request, session, render}) => {
  const body = request.body();
  const params = await body.value;

  const task = {
    name: params.get('name'),
    completed: false
  };

  await addTaskToSession(session, task);

  render('index.ejs', { tasks : await getTasksFromSession(session) });
}

const completeTask = async({request, session, render}) => {
  const body = request.body();
  const params = await body.value;

  const taskNameToComplete = params.get('name');

  let tasks = await getTasksFromSession(session);
  tasks.filter((t) => t.name === taskNameToComplete).forEach((t) => {
    t.completed = true;
  });
  await setTasksToSession(session, tasks);

  render('index.ejs', { tasks : await getTasksFromSession(session) });
}

router.get('/', listTasks);
router.post('/', addTask);
router.post('/complete', completeTask);

app.use(router.routes());

if (!Deno.env.get('TEST_ENVIRONMENT')) {
  app.listen({ port: 7777 });
}

export default app;
