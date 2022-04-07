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
            document.getElementById("card").dataset.github = `${data.name}/${data.repo}`;
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/github-cards/latest/widget.js";
            document.getElementsByTagName("head")[0].appendChild(script);
        });
    });

    if (!version) {
        fetch(`/fetch_versions/${pkg_name}`).then(response => {
            response.json().then(tags => {
                if (tags[0]) {
                    document.getElementById("version").innerText = tags[0];
                    document.getElementById("versions").href = `/pkg/${pkg_name}/versions`;
                } else {
                    document.getElementById("versions").display = "none";
                }
            });
        });
    } else {
        document.getElementById("version").innerText = version;
        document.getElementById("versions").href = `/pkg/${pkg_name}/versions`;
    }
}