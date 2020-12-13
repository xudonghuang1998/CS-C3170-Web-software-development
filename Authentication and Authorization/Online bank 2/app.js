import { Application, Router } from "https://deno.land/x/oak@v6.3.2/mod.ts";
import { viewEngine, engineFactory, adapterFactory } from "https://raw.githubusercontent.com/deligenius/view-engine/master/mod.ts";
import { Session } from "https://deno.land/x/session@v1.0.0/mod.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";
import { Client } from "https://deno.land/x/postgres@v0.4.5/mod.ts";

const client = new Client({});

const executeQuery = async(query, ...args) => {
  try {
    await client.connect();
    return await client.query(query, ...args);
  } catch (e) {
    console.log(e);
  } finally {
    await client.end();
  }
}

const app = new Application();
const router = new Router();

app.use(async(context, next) => {
  try {
    await next();
  } catch (e) {
    console.log(e);
  }
});

const ejsEngine = engineFactory.getEjsEngine();
const oakAdapter = adapterFactory.getOakAdapter();
app.use(viewEngine(oakAdapter, ejsEngine));

const session = new Session({ framework: "oak" });
await session.init();
app.use(session.use()(session));

const limitAccessMiddleware = async(context, next) => {
  if (context.request.url.pathname.startsWith('/accounts')) {
    if (await context.session.get('authenticated')) {
      await next();
    } else {
      context.response.status = 401;
    }
  } else {
    await next();
  }
}
app.use(limitAccessMiddleware);

const showRegistrationForm = ({render}) => {
  render('register.ejs');
}

const postRegistrationForm = async({request, response}) => {
  const body = request.body();
  const params = await body.value;
  
  const email = params.get('email');
  const password = params.get('password');
  const verification = params.get('verification');

  if (password !== verification) {
    response.body = 'The entered passwords did not match';
    return;
  }

  const existingUsers = await executeQuery("SELECT * FROM users WHERE email = $1", email);
  if (existingUsers.rowCount > 0) {
    response.body = 'The email is already reserved.';
    return;
  }

  const hash = await bcrypt.hash(password);
  await executeQuery("INSERT INTO users (email, password) VALUES ($1, $2);", email, hash);
  response.body = 'Registration successful!';
};

const postLoginForm = async({request, response, session}) => {
  const body = request.body();
  const params = await body.value;

  const email = params.get('email');
  const password = params.get('password');

  // check if the email exists in the database
  const res = await executeQuery("SELECT * FROM users WHERE email = $1;", email);
  if (res.rowCount === 0) {
      response.status = 401;
      return;
  }

  // take the first row from the results
  const userObj = res.rowsOfObjects()[0];

  const hash = userObj.password;

  const passwordCorrect = await bcrypt.compare(password, hash);
  if (!passwordCorrect) {
      response.status = 401;
      return;
  }

  await session.set('authenticated', true);
  await session.set('user', {
      id: userObj.id,
      email: userObj.email
  });
  response.body = 'Authentication successful!';
}

const showLoginForm = ({render}) => {
  render('login.ejs');
}

const listAccounts = async({render, session}) => {
  const user = await session.get('user');

  const res = await executeQuery("SELECT * FROM accounts WHERE user_id = $1", user.id);

  let accounts = [];
  if (res) {
    accounts = res.rowsOfObjects();
  }

  render('accounts.ejs', {accounts: accounts});
}

const addAccount = async({request, response, session}) => {
  const body = request.body();
  const params = await body.value;

  const name = params.get('name');
  const user = await session.get('user');

  await executeQuery("INSERT INTO accounts (name, user_id) VALUES ($1, $2)", name, user.id);
  response.status = 200;
}

const deposit = async({params, request, response, session}) => {
  const body = request.body();
  const reqBody = await body.value;

  const amount = Number(reqBody.get('amount'));
  const user = await session.get('user');

  const res = await executeQuery("SELECT * FROM accounts WHERE id = $1 AND user_id = $2", params.id, user.id);
  if (!res || res.rowCount === 0) {
    response.status = 401;
  } else {
    await executeQuery("UPDATE accounts SET balance = balance + $1 WHERE id = $2 AND user_id = $3", amount, params.id, user.id);
    response.status = 200;
  }
}

const withdraw = async({params, request, response, session}) => {
  const body = request.body();
  const reqBody = await body.value;

  const amount = Number(reqBody.get('amount'));
  const user = await session.get('user');

  const res = await executeQuery("SELECT * FROM accounts WHERE id = $1 AND user_id = $2", params.id, user.id);
  if (!res || res.rowCount === 0) {
    response.status = 401;
  } else {
    await executeQuery("UPDATE accounts SET balance = balance - $1 WHERE id = $2 AND user_id = $3", amount, params.id, user.id);
    response.status = 200;
  }
}

const transfer = async({params, request, response, session}) => {
  const body = request.body();
  const reqBody = await body.value;

  const amount = Number(reqBody.get('amount'));
  const user = await session.get('user');

  const res = await executeQuery("SELECT * FROM accounts WHERE id = $1 AND user_id = $2 AND balance >= $3", params.fromId, user.id, amount);
  if (!res || res.rowCount === 0) {
    response.status = 401;
    return;
  } else {
    await executeQuery("UPDATE accounts SET balance = balance - $1 WHERE id = $2 AND user_id = $3", amount, params.fromId, user.id);
    await executeQuery("UPDATE accounts SET balance = balance + $1 WHERE id = $2", amount, params.toId);
    response.status = 200;
  }
}

router.get('/auth/register', showRegistrationForm);
router.post('/auth/register', postRegistrationForm);
router.get('/auth/login', showLoginForm);
router.post('/auth/login', postLoginForm);
router.get('/accounts', listAccounts);
router.post('/accounts', addAccount);
router.post('/accounts', addAccount);
router.post('/accounts/:id/deposit', deposit);
router.post('/accounts/:id/withdraw', withdraw);
router.post('/accounts/transfer/:fromId/:toId', transfer);

app.use(router.routes());

if (!Deno.env.get('TEST_ENVIRONMENT')) {
  app.listen({ port: 7777 });
}
  
export default app;
