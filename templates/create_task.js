import {createEquationsPanel} from "/functions.js"

//------------------------------------------------------Variables-----------------------------------------------//

const stage = new Konva.Stage({
    name: "stage",
    container: "container",
    width: widthStage,
    height: heightStage
});


const divEquationsContainer = document.querySelector('#equationsContainer');
const divScoreContainer = document.querySelector('#scoreContainer');
const divKonvaContainer = document.querySelector("#container");

const equationsPanel = createEquationsPanel();
const scorePanel = createScorePanel(stage.x,stage.y);
const panel = createPanel(400, 80);

divEquationsContainer.appendChild(equationsPanel);
divScoreContainer.appendChild(scorePanel);
divKonvaContainer.appendChild(panel);

listenPanelMovement(panel);
updateScorePanel();

const layer = new Konva.Layer({name: "layer"});


//------------------------------------------------------Grilla-----------------------------------------------//
for (var i = 0; i <= widthStage / blockSnapSize; i++) {
    layer.add(new Konva.Line({
        name: "horizontalLines",
        points: [Math.round(i * blockSnapSize) + 0.5, 0, Math.round(i * blockSnapSize) + 0.5, heightStage],
        stroke: "#777777",
        strokeWidth: 1,
    }));
}


for (var j = 0; j <= heightStage / blockSnapSize; j++) {
    layer.add(new Konva.Line({
        name: "verticalLines",
        points: [0, Math.round(j * blockSnapSize), widthStage, Math.round(j * blockSnapSize)],
        stroke: "#7777777",
        strokeWidth: 0.5,
    }));
}


//------------------------------------------------------Declaraciones-----------------------------------------------//
const lastVigaNodeClick = {x: 0, y: 0};
const initialViga = createViga(blockSnapSize*15, blockSnapSize*5 , blockSnapSize*4, 0, nameViga="initialViga"); // initialViga no puede ser destruida

stage.add(layer);

stage.on("click",  (e) => {
    console.log(allDCLelements);
    updateScorePanel();
    document.querySelector("#id_draw").value = stage.toJSON();
    document.querySelector("#id_category").value = document.querySelector("#valueCategory").innerText;
    document.querySelector("#id_level_points").value = document.querySelector("#valueScore").innerText;
    panel.style.visibility = "hidden";


    if (e.target != stage && e.target) {
        var mouseXY = stage.getPointerPosition();

        if (e.target.getParent().name() != "layer"){
            document.addEventListener("keydown", (kd) => {
                const key = kd.key;

                if(key == "Delete" && e.target.getParent() && e.target.getParent().name() != "initialViga"){
                    idx = allDCLelements.indexOf(e.target.getParent());;
                    allDCLelements.splice(idx, 1);
                    e.target.getParent().destroy();
                    updateScorePanel();
                    updateEquations();
                }
            });
        }
    }
});

stage.on("dblclick", (e) => {
    if (e.target != stage && e.target) {
        const mouseXY = roundXY(getXY());
        lastVigaNodeClick.x = mouseXY.x
        lastVigaNodeClick.y = mouseXY.y
        // console.log("mous pos: "+mouseXY.x+", "+mouseXY.y)
        if (e.target.name() == "subElementoVigaCirculo1" || e.target.name() == "subElementoVigaCirculo2"){
            panel.style.visibility = "visible"
            movePanelTo(panel, mouseXY.x, mouseXY.y)
        }
    }
});

stage.on("mouseout", (e) => {
    document.querySelector("#id_draw").value = stage.toJSON();
});
