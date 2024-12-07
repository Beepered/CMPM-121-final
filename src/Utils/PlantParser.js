class InternalPlantType{
    fullName = "";
    texture = "";
    nextLevel(){};
}

function plantTypeParser(program){
    const internalPlantType = new InternalPlantType();
    const dsl = {
        name(name){
            internalPlantType.fullName = name
        },
        texture(texture){
            internalPlantType.texture = texture
        },
        growsWhen(growsWhen){
            internalPlantType.nextLevel = (ctx) => {
                return ctx.plant.level + (growsWhen(ctx) ? 1 : 0);
            }
        }
    }
    program(dsl);
    return internalPlantType;
}

const allInternalPlantTypes = allPlantDefinition.map(plantTypeParser);
