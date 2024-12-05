// UNUSED: just here as an example of extracting from JSON
// If you want to use it make sure to attach the code in index.html

class DataFetcher {
    preload(){
        this.load.json('json', 'src/Utils/scenario.json')
    }

    create(){
        const data = this.cache.json.get('json')
        console.log(data)
        console.log(data.playerx)
    }
}