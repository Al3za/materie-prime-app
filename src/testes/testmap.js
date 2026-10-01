const materialMap = new Map();

materialMap.set("Mandorle", 1);
materialMap.set("mandorle", 2); // sensitive case
materialMap.set("Mandorle ", 3); // backticks sensitive

console.log(materialMap);
console.log(materialMap.size);
console.log(materialMap.get("Mandorle "));

const z1 = "0";

const z1ToNumber = Number(zeus);
console.log("z1ToNumber", z1ToNumber);
