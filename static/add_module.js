function submit() {
    const module_name = document.getElementById("module_name").value; 
    const repository = document.getElementById("repository").value;
    if(validate_input(module_name, repository)) {
        const split = repository.split("/");
        const name = split[0];
        const repo = split[1];

        fetch(`/add_pkg/${module_name}/${name}/${repo}`).then(response => {
            response.json().then(json => {
                if(json.status == "success") {
                    document.location.href = json.url;
                } else {
                    alert(json.reason);
                }
            });
        });
    } else {
        alert("bad input");
    }
}

function validate_input(name, repo) {
    return (
        name.trim().length > 0 &&
        repo.split("/").length == 2 &&
        !repo.startsWith("https://") &&
        !repo.endsWith(".com")
    );
}