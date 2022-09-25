//------------------------------------------------------Creacion canvas-----------------------------------------------//

const stage = new Konva.Stage({
    name: "stage",
    container: "container",
    width: widthStage,
    height: heightStage
});

let stage2 = Konva.Node.create(JSON.parse(stage.clone({name: "stage2"}).toJSON()), 'container2');

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


const divEquationsContainer = document.querySelector('#equationsContainer');
const divScoreContainer = document.querySelector('#scoreContainer');
const divKonvaContainer = document.querySelector("#container");

const equationsPanel = createEquationsPanel();
const scorePanel = createScorePanel(stage.x,stage.y);
const panel = createPanel(400, 80);
const delPanel = createDelPanel(0,0);

divEquationsContainer.appendChild(equationsPanel);
divScoreContainer.appendChild(scorePanel);
divKonvaContainer.appendChild(panel);
divKonvaContainer.appendChild(delPanel);

listenPanelMovement(panel);
listenPanelMovement(delPanel);

//------------------------------------------------------Elementos dcl-----------------------------------------------//
const lastVigaNodeClick = {x: 0, y: 0};
let lastElementClick = undefined;
const initialViga = createViga(nameViga="initialViga"); // initialViga no puede ser destruida

listenCreateElement();
listenDeleteElement();
listenHiddePanels();
replaceApoyos();
listenSave();


