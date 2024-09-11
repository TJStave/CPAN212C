const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;
const pagesDir = path.join(__dirname, 'pages');

const loadPage = (page, res) => {
    fs.readFile(path.join(pagesDir, page), (err, data) => {
        if (err){
            res.writeHead(404, {"Content-Type": "text/plain"});
            res.write("File not found");
        } else {
            res.writeHead(200, {"Content-Type": "text/html"});
            res.write(data);
        }
        res.end();
    });
}

const server = http.createServer((req, res) => {
    if(req.url === "/"){
        loadPage("home.html", res);
    }
    else if(req.url === "/store"){
        loadPage("products.html", res);
    }
    else if(req.url === "/about"){
        loadPage("about.html", res);
    }
    else if(req.url === "/contact"){
        loadPage("contact.html", res);
    }
    else if(req.url === "/login"){
        if(req.method === "POST"){
            res.end("Logged in???");
        }
        else{
            loadPage("login.html", res);
        }
    }
    else if(req.url === "/bonus"){
        loadPage("bonus.html", res);
    }
    else{
        fs.readFile(path.join(pagesDir, "404.html"), (err, data) => {
            if (err){
                res.writeHead(404, {"Content-Type": "text/plain"});
                res.write("File not found");
            } else {
                res.writeHead(404, {"Content-Type": "text/html"});
                res.write(data);
            }
            res.end();
        });
    }
});
server.listen(PORT);