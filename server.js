const { log } = require("console")
const {createServer} = require("http")

let db = [
    {
        "id": 1,
        "title": "what did the mic, tell the user? Stop spitting on me",
        "comedian": "Mc- miti",
        "year": 2010,
    }, 

    {
        "id": 2,
        "title": "why is it called friend rice when it is not friend with the pan",
        "comedian": "I go die",
        "year": 2011,
    },
    
    {
        "id": 3,
        "title": "mr investor with the vibes",
        "comedian": "Mr funny",
        "year": 2012,
    }
]



const server = createServer((req, res) => {
    //console.log(req.url)
    if (req.url === "/" && req.method === "GET") {
        getJokes(req, res)
    } else if (req.url === "/jokes" && req.method === "DELETE") {
        deleteJokes(req, res)
    }else if (req.url === "/" && req.method === "POST") {
        addJokesDB (req, res)
    }else if (req.url === "/jokes/1" && req.method === "PATCH") {
        updateJoke(req, res);
    }else {
        res.writeHead(404)
        res.end(JSON.stringify({"error": true, "message": "Not found"}))
    }
})

function deleteJokes (req, res) {
    const id = req.url.split("/")[2];
    
    let updateJokes = db.findIndex(items => items.id === id)
    if (updateJokes !== -1){
    const deletedJoke = db.splice(index, 1)[0];
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(deletedJoke));
    }
}

function addJokesDB (req, res) {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString()
    });
    req.on('end', () => {
        const newUser = JSON.parse(body)
        db.push(newUser)
        res.statusCode = 201;
        res.writeHead(200, {"Content-Type": "application/json"})
        res.end(JSON.stringify(db))
    })
}


function getJokes (req, res) {
    res.writeHead(200)
        res.end(JSON.stringify({data: db, "message": "Data fetched successfully"}))
}

function updateJoke(req, res) {
    const body = []
    const id = req.url.split("/")[2];

    req.on("data", (chunk) => {
        body.push(chunk)
    })

    req.on("end", () =>  {
        const convertedBuffer = Buffer.concat(body).toString()
        const jsonRes = JSON.parse(convertedBuffer)

        const updatedDB = db.map(item => {
            if (item.id === id) {
               return  {
                    ...item,
                    ...jsonRes,
                };
            } else return item
        })

        db = updatedDB;

        console.log(updatedDB)
    })
    
    res.end(JSON.stringify({db}))
}

server.listen(5500, "localhost",  () => {
    console.log("server running")
});