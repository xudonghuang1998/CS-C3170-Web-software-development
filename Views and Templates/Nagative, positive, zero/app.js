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
    object: 'gravity',
    value: 0
};

for await (const request of server) {
    const params = requestParams(request.url);

    if (params.has('object')) {
        data.object = params.get('object');
    }

    if (params.has('value')) {
        data.value = Number(params.get('value'));
    }

    request.respond({ body: await renderFile('index.ejs', data) });
}
