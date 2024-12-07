class PlantDefinition {
    name(){}
    growsWhen(){}
}

const allPlantDefinition = [
    function pink(type){ // type is PlantDefinition
        type.name("pink");
        type.growsWhen(()=>{
            console.log("pink")
        });
    },
    function red(type){
        type.name("red");
        type.growsWhen(()=>{
            console.log("red")
        });
    },
]