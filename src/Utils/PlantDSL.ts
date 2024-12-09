// Define types for plant properties
interface PlantType {
  name: string
  texture: string
  growthRule: (cell: Cell, conditions: GrowthConditions) => boolean
}

interface Cell {
  x: number
  y: number
  plant?: PlantInstance
}

interface PlantInstance {
  typeName: string
}

interface GrowthConditions {
  sun: number
  water: number
  neighbors: Cell[]
}

// Global PlantDSL Namespace
const PlantDSL = {
  registry: new Map<string, PlantType>(),

  addPlantType(
    name: string,
    texture: string,
    growthRule: (cell: Cell, conditions: GrowthConditions) => boolean
  ): void {
    const newPlantType: PlantType = {
      name,
      texture,
      growthRule,
    }
    this.registry.set(name, newPlantType)
  },

  getPlantType(name: string): PlantType | undefined {
    return this.registry.get(name)
  },
}

// Extend the global window object to include PlantDSL
declare global {
  interface Window {
    PlantDSL: typeof PlantDSL
  }
}

// Attach PlantDSL to the window object
window.PlantDSL = PlantDSL

// Define Plant Types
PlantDSL.addPlantType(
  "sunflower",
  "pink",
  (cell, { sun, water, neighbors }) => {
    // Requires at least 3 sunlight and 2 water, plus no neighbors
    return sun >= 3 && water >= 2 && neighbors.length <= 1
  }
)

PlantDSL.addPlantType(
  "rose",
  "red",
  (cell, { sun, water, neighbors }) => {
    // Grows only if near another "rose" and soil moisture > 4
    const rosesNearby = neighbors.filter(
      (n) => n.plant?.typeName === "rose"
    ).length
    return water > 4 && rosesNearby >= 1
  }
)

PlantDSL.addPlantType(
  "lavender",
  "purple",
  (cell, { sun, water }) => {
    // Requires high sunlight and low water
    return sun >= 5 && water >= 7
  }
)

export default PlantDSL