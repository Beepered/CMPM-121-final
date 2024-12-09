// explains how to make a new plant type

class PlantDefinition {
    name(){}
    texture(){}
    growsWhen(){}
}

class GrowthContext {
    plant;
    cell;
    neighbors;
}

const allPlantDefinition = [
    function pink(type){ // type is PlantDefinition
        type.name("pink");
        type.texture("pink");
        type.growsWhen((cell, neighbors)=>{
            const enoughNutrients = cell.sun >= 2 && cell.water >= 4;
            const enoughNeighbors = neighbors.length >= 2;
            return enoughNutrients && enoughNeighbors
        });
    },
    function red(type){
        type.name("red");
        type.texture("red")
        type.growsWhen((cell, neighbors)=>{
            const enoughNutrients = cell.sun >= 6 && cell.water >= 6;
            const nearbyPlants = 1;
            neighbors.forEach(_cell => {
                if(_cell.plant){
                    nearbyPlants--;
                }
            });
            const enoughNeighbors = (p <= 0);
            return enoughNutrients && enoughNeighbors
        });
    },
]