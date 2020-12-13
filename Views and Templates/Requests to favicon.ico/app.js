import { serve } from "https://deno.land/std@0.65.0/http/server.ts";
import { renderFile } from 'https://raw.githubusercontent.com/syumai/dejs/master/mod.ts';

const server = serve({ port: 7777 });

let visitCount = 0;

for await (const request of server) {
    if (request.url === '/favicon.ico') {

        visitCount++;
        request.respond({ status: 404 });

    } else {
        const data = {
            count: visitCount
        };

        request.respond({ body: await renderFile('index.ejs', data) });
    }
}
