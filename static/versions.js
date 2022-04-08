function gen_tag(name, tag) {
    const div = document.createElement("div");
    const a = document.createElement("a");
    a.innerText = tag;
    a.href = `/pkg/${name}/${tag}`;
    div.appendChild(a);
    return div;
}

function load() {
    const split = document.location.href.split("/");
    const pkg_name = split[split.length - 2];

    document.getElementById("module_name").innerText = pkg_name;
    document.getElementById("back").href = `/pkg/${pkg_name}`;

    fetch(`/fetch_versions/${pkg_name}`).then(response => {
        response.json().then(tags => {
            document.getElementById("versions").innerText = "";
            tags.forEach(tag => {
               document.getElementById("versions").appendChild(gen_tag(pkg_name, tag)); 
            });
        });
    });
}