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
    request.respond({ body: `${params.get('page')} ${params.get('count')}` });
}
