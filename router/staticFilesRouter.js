const url = require('url');
const fs = require('fs');
const getContentType = require('./staticFilesChecker.js');

module.exports = (req, res) => {
    const pathname = url.parse(req.url).pathname;

    if (pathname.startsWith('/content') && req.method === 'GET') {
            if (pathname.endsWith('png')
                || pathname.endsWith('jpg')
                || pathname.endsWith('jpeg')
                || pathname.endsWith('ico')
                && req.method === 'GET') {
                fs.readFile(`.${pathname}`, (err, content) => {
                    if (err) {
                        console.log(err);
                        res.writeHead(404, {
                            'Content-Type': 'text/plain'
                        });
                        res.write('Page Not Found!')
                        res.end();
                        return;
                    }
                    let a = getContentType(pathname)
                    res.writeHead(200, {
                        'Content-Type': getContentType(pathname)
                    });
                    res.write(content);
                    res.end();
                    return;
                });
            } else {
                fs.readFile(`./${pathname}`, 'utf-8', (err, content) => {
                    if (err) {
                        console.log(err);
                        res.writeHead(404, {
                            'Content-Type': 'text/plain'
                        });
                        res.write('Page Not Found!')
                        res.end();
                        return;
                    }
                    let a = getContentType(pathname);
                    res.writeHead(200, {
                        'Content-Type': getContentType(pathname)
                    });
                    res.write(content);
                    res.end();
                    return;
                });
            }
    } else {
        return true;
    }
}