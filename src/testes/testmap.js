// const zes = 2;

// const mil = 2;

// const max = zes + mil;

// console.log(max);

const materialMap = new Map();

materialMap.set("Mandorle", 1);
materialMap.set("mandorle", 2); // sensitive case
materialMap.set("Mandorle ", 3); // backticks sensitive

console.log(materialMap);
console.log(materialMap.size);
console.log(materialMap.get("Mandorle "));
