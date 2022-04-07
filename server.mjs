import fetch from 'node-fetch';
import express from 'express';
import jsonfile from 'jsonfile';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static("static"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
});

app.get("/add_module", (req, res) => {
    res.sendFile(__dirname + "/views/add_module.html");
});

app.get("/pkg/:pkg_name", (req, res) => {
    res.sendFile(__dirname + "/views/pkg.html");
});

app.get("/pkg/:pkg_name/versions", (req, res) => {
    res.sendFile(__dirname + "/views/versions.html");
});

app.get("/pkg/:pkg_name/:version", (req, res) => {
    res.sendFile(__dirname + "/views/pkg.html");
});

app.get("/add_pkg/:pkg_name/:name/:repo", (req, res) => {
    jsonfile.readFile("database/packages.json", (read_error, packages) => {
        if(read_error) return res.send({"status": "failed", "reason": "db_read_error"});
        
        if(!packages[req.params.pkg_name]) {
            packages[req.params.pkg_name] = {"name": req.params.name, "repo": req.params.repo};

            jsonfile.writeFile("database/packages.json", packages, (write_error) => {
                if(!write_error) return res.send({"url": `/pkg/${req.params.pkg_name}`, "status": "success"});
                return res.send({"status": "failed", "reason": "db_write_error"});
            });
        } else {
            return res.send({"status": "failed", "reason": "already_exists"});
        }
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

app.get("/pkg_info/:pkg_name", (req, res) => {
    jsonfile.readFile("database/packages.json", (read_error, packages) => {
        if(!packages[req.params.pkg_name]) return res.send("not found");
        res.send(packages[req.params.pkg_name]);
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

app.get("/fetch_modules", (req, res) => {
    jsonfile.readFile("database/packages.json", (error, packages) => {
        res.send(packages);
    });
});

app.listen(3000, () => {
    console.log("Moduland up and running on port 3000!");
});