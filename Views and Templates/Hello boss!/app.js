import { serve } from "https://deno.land/std@0.65.0/http/server.ts";
import { renderFile } from 'https://raw.githubusercontent.com/syumai/dejs/master/mod.ts';

const server = serve({ port: 7777 });

const requestParams = (url) => {
    let queryParams = '';
    if (url.includes('?')) {
        queryParams = url.slice(url.indexOf('?'));
    }

    return new URLSearchParams(queryParams);
}

const data = {
    name: 'John Doe'
};

for await (const request of server) {
    const params = requestParams(request.url);

    if (params.has('name')) {
        data.name = params.get('name');
    }

    request.respond({ body: await renderFile('index.ejs', data) });
}
