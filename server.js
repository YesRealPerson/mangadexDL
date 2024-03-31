const express = require('express');
const axios = require('axios');
const http = require('http');
const fs = require('fs');
const request = require("request");
const url = "https://api.mangadex.org";

const app = express();
app.use(express.static('./', { extensions: ['html'] }));
const server = http.createServer(app);

function clean(str) {
    str = str.replaceAll("/", "");
    str = str.replaceAll(">", "");
    str = str.replaceAll("<", "");
    str = str.replaceAll(":", "");
    str = str.replaceAll("\"", "");
    str = str.replaceAll("\\", "");
    str = str.replaceAll("|", "");
    str = str.replaceAll("?", "");
    str = str.replaceAll("*", "");
    return str;
}

app.get("/search", async (req, res) => {
    let title = req.query.title;
    if (title == undefined) {
        res.status(400).send("No title query?");
    } else {
        try {
            var config = {
                method: "get",
                url: url + "/manga?limit=15&hasAvailableChapters=1&includes[]=cover_art&title=" + title
            }
            axios(config).then(async response => {
                res.status(200).send(response.data);
            })
        }
        catch (err) {
            res.status(500).send(err);
        }
    }
});

app.get("/manga", async (req, res) => {
    let id = req.query.id;
    if (id == undefined) {
        res.status(400).send("No id query?");
    } else {
        try {
            var config = {
                method: "get",
                url: url + "/manga/" + id + "/feed?translatedLanguage[]=en&includeExternalUrl=0&limit=250"
            }
            axios(config).then(async response => {
                res.status(200).send(response.data);
            })
        }
        catch (err) {
            res.status(500).send(err);
        }
    }
});

app.get("/group", async (req, res) => {
    let id = req.query.id;
    if (id == undefined) {
        res.status(400).send("No id query?");
    } else {
        try {
            var config = {
                method: "get",
                url: url + "/group/" + id
            }
            axios(config).then(async response => {
                res.status(200).send(response.data);
            })
        }
        catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    }
});

app.get("/download", async (req, res) => {
    let query = req.query;
    let data = [query.id, query.title, query.num, query.group, query.chapterTitle];
    let invalid = false;

    for (let i = 0; i < data.length; i++) {
        if (data[i] == undefined) {
            invalid = true;
            break;
        }
    }

    if (!invalid) {
        data[1] = clean(data[1])
        data[2] = clean(data[2])
        data[3] = clean(data[3])
        data[4] = clean(data[4])
        if (!fs.existsSync("./outputs")) {
            fs.mkdirSync("./outputs");
        }
        let dir = `./outputs/${data[1]}/${data[2]}.${data[4]}.${data[3]}`;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            try {
                var config = {
                    method: "get",
                    url: url + "/at-home/server/" + data[0]
                }
                axios(config).then(async response => {
                    let pages = response.data;
                    let base = pages.baseUrl;
                    let hash = pages.chapter.hash;
                    pages = pages.chapter.data;
                    let failures = [];
                    let broken = false;
                    for (let j = 0; j < pages.length; j++) {
                        page = pages[j];
                        if(broken) {
                            break;
                        };
                        try{
                        request
                            .get(`${base}/data/${hash}/${page}`,{headers: {"User-Agent": 'YesRealPerson/mangadexDL NodeJS Request Library'}})
                            .on('error', (err) => { 
                                console.log(err);
                                res.status(500).send(err);
                                broken = true;
                             })
                            .pipe(fs.createWriteStream(dir + "/" + j + "." + page.split(".")[1]))
                        }catch(err){
                            console.log(err);
                        }
                        await new Promise(r => setTimeout(r, 100));
                    }
                    res.status(200).send({[data[2]]:failures});
                })
            }
            catch (err) {
                res.status(500).send(err);
            }
        }else{
            res.status(400).send("You already have this chapter downloaded!");
        }
        res.status(200);
    }else{
        res.status(401);
    }
});

server.listen(8080);

import("open").then(module => {
    module.default("http://localhost:8080")
})