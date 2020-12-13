import { serve } from "https://deno.land/std@0.65.0/http/server.ts";
import { renderFile } from 'https://raw.githubusercontent.com/syumai/dejs/master/mod.ts';

const server = serve({ port: 7777 });

const data = {
    methods: [],
};

for await (const request of server) {
    data.methods.push(request.method);
    request.respond({ body: await renderFile('index.ejs', data) });
}
