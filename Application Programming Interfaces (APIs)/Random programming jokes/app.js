import { serve } from "https://deno.land/std@0.65.0/http/server.ts";
import { renderFile } from 'https://raw.githubusercontent.com/syumai/dejs/master/mod.ts';

const server = serve({ port: 7777 });

const getJoke = async() => {
    const res = await fetch('https://official-joke-api.appspot.com/jokes/programming/random');
    return JSON.parse(await res.text())[0];
}
for await (const request of server) {
    const joke = await getJoke();
    const data = {
        setup: joke.setup,
        punchline: joke.punchline
    };

    request.respond({ body: await renderFile('index.ejs', data) });
}
