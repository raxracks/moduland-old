function add_file(name, repo, tag, path) {
    const div = document.createElement("div");
    div.classList.add("file");
    const a = document.createElement("a");
    a.href = `https://github.com/${name}/${repo}/blob/${tag}/${path}`;
    a.innerText = path;
    a.target = "_blank";
    div.appendChild(a);
    document.getElementById("files").appendChild(div);
}

function load_files(name, repo, tag) {
    fetch(`https://api.github.com/repos/${name}/${repo}/git/trees/${tag}?recursive=1`).then(response => {
        document.getElementById("files").innerText = "";
    
        response.json().then(files => {
            files.tree.forEach(file => {
                add_file(name, repo, tag, file.path);
            });
        });
    });
}

function load() {
    const split = document.location.pathname.split("/");
    let pkg_name;
    let version = undefined;
    if (split.length == 4) {
        pkg_name = split[split.length - 2];
        version = split[split.length - 1];
    } else {
        pkg_name = split[split.length - 1];
    }


    fetch(`/pkg_info/${pkg_name}`).then(response => {
        response.json().then(data => {
            document.getElementById("module_name").innerText = pkg_name;
            document.getElementById("install_command").innerText = `pcjr install ${pkg_name}${version ? ` ${version}` : ""}`;
            // document.getElementById("card").dataset.github = `${data.name}/${data.repo}`;
            document.getElementById("view").href = `https://github.com/${data.name}/${data.repo}`;

            if(!version) {
                fetch(`/fetch_versions/${pkg_name}`).then(response => {
                    response.json().then(tags => {
                        if (tags.length > 0) {
                            load_files(data.name, data.repo, tags[0]);
                            document.getElementById("version").innerText = tags[0];
                            document.getElementById("versions").href = `/pkg/${pkg_name}/versions`;
                        } else {
                            document.getElementById("versions").style.display = "none";
                            document.getElementById("files").innerText = "this package can still be installed, however no releases of the github repo are available.";
                        }
                    });
                });
            } else {
                load_files(data.name, data.repo, version);
            }
        });
    });

    if (!!version) {
        document.getElementById("version").innerText = version;
        document.getElementById("versions").href = `/pkg/${pkg_name}/versions`;
    }
}