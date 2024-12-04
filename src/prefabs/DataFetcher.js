class DataFetcher {
    constructor(){
        var data = fetch("src/Utils/scenario.json")
            .then(response => response.json())
            .then(value => beef(value))
            .catch(error => console.error("error fetching JSON"))
    }
}