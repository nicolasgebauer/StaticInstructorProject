const lastVigaNodeClick = {x: 0, y: 0};

//------------------------------------------------------Recuperacion canvas-----------------------------------------------//
const drawJSON = JSON.parse(document.querySelector("#drawJSON").textContent);
const stage = Konva.Node.create(drawJSON, 'container');
const layer = stage.find(element => {
    return element.name() == "layer";
})[0];

const defaultVigas = stage.find( (element) =>{
    return element.name() == "viga" || element.name() == "initialViga"
})
const defaultShadowVigas = stage.find( (element) =>{
    return element.name() == "shadow-viga" || element.name() == "shadow-initialViga"
})

stage.find( (element) => { 
    if (element.name() == "viga"                ||
        element.name() == "initialViga"         ||
        element.name() == "empotrado"           ||
        element.name() == "apoyo-deslizante"    ||
        element.name() == "apoyo-no-deslizante" ||
        element.name() == "rotula"              ||
        element.name() == "biela"               ||
        element.name() == "fuerza"              ||
        element.name() == "momento-positivo"    ||
        element.name() == "momento-negativo" 
            ){
            allDCLelements.push(element);
    }
});


for(let i=0; i<defaultVigas.length; i++){
    updateViga(defaultVigas[i], defaultShadowVigas[i]); // por favor       
}

updateCounts();

//------------------------------------------------------Creacion paneles-----------------------------------------------//
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

let stage2 = Konva.Node.create(JSON.parse(stage.clone({name: "stage2"}).toJSON()), 'container2');
replaceApoyos();

//------------------------------------------------------Recuperacion puntajes-----------------------------------------------//
updateScorePanel();
updateEquations();

//------------------------------------------------------Elementos dcl-----------------------------------------------//

listenCreateElement();
listenDeleteElement();
listenSave();

