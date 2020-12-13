import { serve } from "https://deno.land/std@0.65.0/http/server.ts";

const server = serve({ port: 7777 });

const requestParams = (url) => {
    let queryParams = '';
    if (url.includes('?')) {
        queryParams = url.slice(url.indexOf('?'));
    }

    return new URLSearchParams(queryParams);
}

for await (const request of server) {
    const params = requestParams(request.url);

    let title = 'princess';
    if (params.has('title')) {
        title = params.get('title');
    }

    let name = 'Tove';
    if (params.has('name')) {
        name = params.get('name');
    }

    request.respond({ body: `Once upon a time, there was a ${title} called ${name}.` });
}
