
    });
}

const handlePostSong = async(request) => {
    const body = decode(await Deno.readAll(request.body));
    let name;
    let rating;

    try {
        const obj = JSON.parse(body);
        name = obj.name;
        rating = obj.rating;
    } catch (e) {
        console.log(e);
    }

    if (name) {
        executeQuery("INSERT INTO songs (name, rating) VALUES ($1, $2);", name, rating);
    }

    request.respond({
        status: 200
    });
}

const process = async(request) => {
    console.log(`${request.method} to ${request.url}`);
    if (request.method === 'GET' && request.url === '/songs') {
        handleGetSongs(request);
    } else if (request.method === 'POST' && request.url === '/songs') {
        handlePostSong(request);
    }
}

for await (const request of server) {
    process(request);
}
