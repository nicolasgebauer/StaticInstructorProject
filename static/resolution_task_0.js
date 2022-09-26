const lastVigaNodeClick = {x: 0, y: 0};
let lastElementClick = undefined;
const resolvingTask = true;
let taskResolvedSuccefully = false;

//------------------------------------------------------Recuperacion canvas-----------------------------------------------//
const solutionJSON = JSON.parse(document.querySelector("#solutionJSON").textContent);
console.log(solutionJSON);
const stageSolution = Konva.Node.create(solutionJSON, 'container2Solution0');

//------------------------------------------------------Creacion canvas-----------------------------------------------//

const stage = new Konva.Stage({
    name: "stage",
    container: "containerSolution0",
    width: widthStage,
    height: heightStage
});

const layer = new Konva.Layer({name: "layer"});
stage.add(layer);

//------------------------------------------------------Creacion grilla-----------------------------------------------//
for (let i = 0; i <= widthStage / blockSnapSize; i++) {
    layer.add(new Konva.Line({
        name: "horizontalLines",
        points: [Math.round(i * blockSnapSize) + 0.5, 0, Math.round(i * blockSnapSize) + 0.5, heightStage],
        stroke: "#777777",
        strokeWidth: 1,
    }));
}


for (let j = 0; j <= heightStage / blockSnapSize; j++) {
    layer.add(new Konva.Line({
        name: "verticalLines",
        points: [0, Math.round(j * blockSnapSize), widthStage, Math.round(j * blockSnapSize)],
        stroke: "#7777777",
        strokeWidth: 0.5,
    }));
}
//------------------------------------------------------Creacion paneles-----------------------------------------------//

const divKonvaContainer = document.querySelector("#containerSolution0");

const panel = createPanel(400, 80);
const delPanel = createDelPanel(0,0);

divKonvaContainer.appendChild(panel);
divKonvaContainer.appendChild(delPanel);

listenPanelMovement(panel);
listenPanelMovement(delPanel);

//------------------------------------------------------Elementos dcl-----------------------------------------------//
const initialViga = createViga(nameViga="initialViga"); // initialViga no puede ser destruida

listenCreateElement();
listenDeleteElement();
listenHiddePanels();
replaceApoyos();
listenSaveStudent();

