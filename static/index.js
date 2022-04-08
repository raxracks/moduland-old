function gen_module(module_name) {
    const div = document.createElement("div");
    const url = document.createElement("a");
    url.href = `/pkg/${module_name}`;
    url.innerText = module_name;
    div.appendChild(url);

    return div;
}

function load_modules() {
    fetch("/fetch_modules").then(response => {
        response.json().then(modules => {
            document.getElementById("modules").innerText = "";
            Object.keys(modules).forEach(module => {
                document.getElementById("modules").appendChild(gen_module(module));
            });
        });
    });
}