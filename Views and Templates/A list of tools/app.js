import { serve } from "https://deno.land/std@0.65.0/http/server.ts";
import { renderFile } from 'https://raw.githubusercontent.com/syumai/dejs/master/mod.ts';

const server = serve({ port: 7777 });

const data = {
    todos: [{
        name: 'Write a TODO app',
        done: false
    }, {
        name: 'Show a list of TODOs',
        done: true
    }, {
        name: 'Move TODOs to a database',
        done: false
    }, {
        name: 'Allow marking TODOs done',
        done: false
    }]
};

for await (const request of server) {
    request.respond({ body: await renderFile('index.ejs', data) });
}
