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

    if (params.has('page') && params.has('count')) {
        request.respond({ body: `page: ${params.get('page')}, count: ${params.get('count')}` });
    } else if (params.has('page')) {
        request.respond({ body: `page: ${params.get('page')}` });
    } else if (params.has('count')) {
        request.respond({ body: `count: ${params.get('count')}` });
    } else {
        request.respond({ body: '-' });
    }

}
