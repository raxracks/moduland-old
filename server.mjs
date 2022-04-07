import fetch from 'node-fetch';
import express from 'express';
import jsonfile from 'jsonfile';
const app = express();

app.get("/", (req, res) => {
    res.send("Under construction");
});

app.get("/pkg/:pkg_name", (req, res) => {
    jsonfile.readFile("database/packages.json", (read_error, packages) => {
        if(!packages[req.params.pkg_name]) return res.send("not found");
        res.send(packages[req.params.pkg_name]);
    });
});

app.get("/add_pkg/:pkg_name/:name/:repo", (req, res) => {
    jsonfile.readFile("database/packages.json", (read_error, packages) => {
        packages[req.params.pkg_name] = {"name": req.params.name, "repo": req.params.repo};

        jsonfile.writeFile("database/packages.json", packages, (write_error) => {

        });
    });
});

app.get("/fetch_versions/:name", (req, res) => {
    const name = req.params.name;
    
    jsonfile.readFile("database/packages.json", (error, packages) => {
        if(packages[name]) {
            fetch(`https://api.github.com/repos/${packages[name].name}/${packages[name].repo}/tags`).then(response => {
                response.json().then(tags => {
                    let tag_names = [];
                    tags.forEach(tag => {
                        tag_names.push(tag.name);
                    });

                    res.send(tag_names);
                });
            });
        }
        else res.send({"status": "failed", "reason": "not_found"});
    });
});

app.get("/fetch_pkg/:name", (req, res) => {
    const name = req.params.name;

    jsonfile.readFile("database/packages.json", (error, packages) => {
        if(packages[name])
            res.send({"url": `https://github.com/${packages[name].name}/${packages[name].repo}`, "status": "success"});
        else
            res.send({"status": "failed", "reason": "not_found"});
    });
});

app.listen(3000);