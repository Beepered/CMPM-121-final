class PlantDefinition {
    name(){}
    growsWhen(){}
}

const allPlantDefinition = [
    function pink(type){ // type is PlantDefinition
        type.name("pink");
        type.growsWhen((cell)=>{
            const enoughNutrients = cell.sun >= 2 && cell.water >= 4;

            return enoughNutrients
        });
    },
    function red(type){
        type.name("red");
        type.growsWhen(()=>{
            const enoughNutrients = cell.sun >= 6 && cell.water >= 6;

            return enoughNutrients
        });
    },
]