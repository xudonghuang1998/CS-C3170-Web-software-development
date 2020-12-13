const log = async({request}, next) => {
  console.log(`${request.url.pathname} - ${request.method}`);
  await next();
};

export { log };
