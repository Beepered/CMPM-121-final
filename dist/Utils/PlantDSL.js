"use strict";
// Global PlantDSL Namespace
const PlantDSL = {
    registry: new Map(),
    addPlantType(name, texture, growthRule) {
        const newPlantType = {
            name,
            texture,
            growthRule,
        };
        this.registry.set(name, newPlantType);
    },
    getPlantType(name) {
        return this.registry.get(name);
    },
};
// Define Plant Types
PlantDSL.addPlantType("sunflower", "pink", (cell, { sun, water, neighbors }) => {
    // Requires at least 3 sunlight and 2 water, plus no neighbors
    return sun >= 3 && water >= 2 && neighbors.length <= 1;
});
PlantDSL.addPlantType("rose", "red", (cell, { sun, water, neighbors }) => {
    // Grows only if near another "rose" and soil moisture > 4
    const rosesNearby = neighbors.filter((n) => { var _a; return ((_a = n.plant) === null || _a === void 0 ? void 0 : _a.typeName) === "rose"; }).length;
    return water > 4 && rosesNearby >= 1;
});
PlantDSL.addPlantType("lavender", "purple", (cell, { sun, water }) => {
    // Requires high sunlight and low water
    return sun >= 5 && water >= 7;
});
