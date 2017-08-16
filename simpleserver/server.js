const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

const mimeTypes ={
    'html':'text/html',
    'jpeg':'image/jpeg',
    'jpg' :'image/jpg',
    'png' :'image/png',
    'js'  :'text/javascript',
    'css' :'text/css'
}

http.createServer((req, res)=>{
    var uri = url.parse(req.url).pathname;
    var filename = path.join(process.cwd(), unescape(uri))
    console.log(`loading ${uri}`)
    var stats;
    try{
        stats = fs.lstatSync(filename);
    }catch(err){
        console.log(err);
        res.writeHead(404, {'Content-Type': 'text/plain'})
        res.write('404 Not Found')
        res.end();
        return;
    }
    if(stats.isFile()){
        console.dir({filename, ext: path.extname(filename).split(".")})
        var mimeType = mimeTypes[path.extname(filename).split(".").reverse()[0]];
        console.log(`Content-Type: ${mimeType}`)

        res.writeHead(200, {'Content-Type':mimeType});

        var fileStream = fs.createReadStream(filename);

        fileStream.pipe(res);
    } else if(stats.isDirectory()){
        res.writeHead(302, {'Location': 'index.html'});
        res.end()
    } else {
        res.writeHead(500, {'Content-Type': 'text/plain'})
        res.write('500 Internal Server Error\n');
        res.end()
    }
}).listen(3000);