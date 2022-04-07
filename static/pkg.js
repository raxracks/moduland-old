function load() {
    const split = document.location.href.split("/");
    fetch(`/pkg_info/${split[split.length - 1]}`).then(response => {
        response.json().then(data => {
            document.getElementById("module_name").innerText = data.repo;
            document.getElementById("install_command").innerText = `pcjr install ${data.repo}`;
            document.getElementById("card").dataset.github = `${data.name}/${data.repo}`;
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/github-cards/latest/widget.js";
            document.getElementsByTagName("head")[0].appendChild(script);
        });
    });
}