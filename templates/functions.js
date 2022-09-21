import {
    countEmpotrado,
    countApoyoDeslizante,
    countpoyoNoDeslizante,
    blockSnapSize,
    widthStage,
    heightStage,
    allDCLelements
} from "variables.js"

function createShadowViga(x0, y0, x1, y1){
    const group = new Konva.Group({name: "shadow-viga"});
    const line = new Konva.Line({
        name: "subElementoViga",
        x: x0,
        y: y0,
        points: [0, 0, x1, y1],
        strokeWidth: 5,
        stroke: "#FF7B17",
        dash: [10, 4]
    });

    const circle1 = new Konva.Circle({
        name: "subElementoViga",
        x: x0,
        y: y0,
        radius: 5,
        fill: "#CF6412",
        draggable: true
    });

    const circle2 = circle1.clone({
        name: "subElementoViga",
        x: x0+(x1),
        y: y0+(y1)
    });

    group.add(line, circle1, circle2);
    console.log("poto:" + group.getChildren());
    return group
}


//------------------------------------------------------Viga-----------------------------------------------//
function newViga(x0, y0, x1, y1, nameViga="viga"){ //parte en el punto (x0, y0) y se desplaza x1 horizontalmente ^ y1 verticalmente ( no va al punto (x1, y1))
    let colorCircle = "red";
    if(nameViga == "initialViga"){
        colorCircle = "green";
    }
    const group = new Konva.Group({draggable: false, name: nameViga});
    const line = new Konva.Line({
        name: "subElementoVigaLinea",
        x: x0,
        y: y0,
        points: [0, 0, x1, y1],
        strokeWidth: 5,
        stroke: "black"
    });

    const circle1 = new Konva.Circle({
        name: "subElementoVigaCirculo1",
        x: x0,
        y: y0,
        radius: 5,
        fill: colorCircle,
        draggable: true
    });

    const circle2 = new Konva.Circle({
        name: "subElementoVigaCirculo2",
        x: x0 + x1,
        y: y0 + y1,
        radius: 5,
        fill: "red",
        draggable: true
    });

    group.add(line, circle1, circle2);
    return group
}

function updateViga(viga, shadow){
    const vigaList = viga.getChildren();
    const shadowList = shadow.getChildren();
    vigaList[1].on("dragstart", () => {
        shadow.show();
        shadow.moveToTop();
        viga.moveToTop();
    });

    vigaList[1].on("dragmove", () => {
        const circle1Pos = vigaList[1].getPosition();
        const circle2Pos = vigaList[2].getPosition();
        const shadowCircle1Pos = shadowList[1].getPosition();

        vigaList[0].position(circle1Pos);
        vigaList[0].points([0, 0, circle2Pos.x - circle1Pos.x, circle2Pos.y - circle1Pos.y]);

        vigaList[1].position({x: circle1Pos.x, y: circle1Pos.y});
        shadowList[1].position({
            x: Math.round(circle1Pos.x / blockSnapSize) * blockSnapSize,
            y: Math.round(circle1Pos.y / blockSnapSize) * blockSnapSize
        });

        shadowList[0].position(circle2Pos);
        shadowList[0].points([0, 0, shadowCircle1Pos.x - circle2Pos.x, shadowCircle1Pos.y - circle2Pos.y]);
    })

    vigaList[1].on("dragend", () => {
        const circle2Pos = vigaList[2].getPosition();
        const shadowCircle1Pos = shadowList[1].getPosition();

        const newX = circle2Pos.x - shadowCircle1Pos.x;
        const newY = circle2Pos.y - shadowCircle1Pos.y;

        vigaList[0].position(shadowCircle1Pos);
        vigaList[0].points([0, 0, newX, newY]);
        vigaList[1].position({
            x: shadowCircle1Pos.x,
            y: shadowCircle1Pos.y
        });

        shadowList[0].position(vigaList[0].position());
        shadow.hide();
    });

    vigaList[2].on("dragstart", () => {
        shadow.show();
        shadow.moveToTop();
        viga.moveToTop();
    });

    vigaList[2].on("dragmove", () => {
        const linePos = vigaList[0].getPosition();
        const circle2Pos = vigaList[2].getPosition();

        const newX = Math.round((circle2Pos.x - linePos.x) / blockSnapSize) * blockSnapSize
        const newY = Math.round((circle2Pos.y - linePos.y) / blockSnapSize) * blockSnapSize

        vigaList[0].points([0, 0, circle2Pos.x - linePos.x, circle2Pos.y - linePos.y])
        shadowList[0].points([0, 0, newX, newY])

        vigaList[2].position({x: circle2Pos.x, y: circle2Pos.y})
        shadowList[2].position({
            x: Math.round(circle2Pos.x / blockSnapSize) * blockSnapSize,
            y: Math.round(circle2Pos.y / blockSnapSize) * blockSnapSize
        });
    });

    vigaList[2].on("dragend", () => {
        const linePos = vigaList[0].getPosition();
        const circle2Pos = vigaList[2].getPosition();
        const shadowCircle2Pos = shadowList[2].getPosition();

        const newX = Math.round((circle2Pos.x - linePos.x) / blockSnapSize) * blockSnapSize
        const newY = Math.round((circle2Pos.y - linePos.y) / blockSnapSize) * blockSnapSize

        vigaList[0].points([0, 0, newX, newY])
        vigaList[2].position({
            x: shadowCircle2Pos.x,
            y: shadowCircle2Pos.y
        });
        shadow.hide();
    });
}


function createViga(x0, y0, x1, y1, nameViga="viga"){
    x0 = lastVigaNodeClick.x
    y0 = lastVigaNodeClick.y

    if (nameViga == "initialViga"){
        x0 = blockSnapSize * 5;
        y0 = blockSnapSize * 3
        y1 = 0;
        x1 = blockSnapSize * 3;
    }

    const line = newViga(x0, y0, x1, y1, nameViga);
    const shadowLine = createShadowViga(x0, y0, x1, y1);

    layer.add(line);
    layer.add(shadowLine.hide());
    allDCLelements.push(line);

    updateViga(line, shadowLine);
    panel.style.visibility = "hidden";
    updateScorePanel();
    updateEquations();
    return line
}


//------------------------------------------------------Vinculos externos-----------------------------------------------//
function createEmpotrado(x0, y0){
    countEmpotrado += 1;

    x0 = lastVigaNodeClick.x;
    y0 = lastVigaNodeClick.y;
    const large = blockSnapSize;

    const group = new Konva.Group({id: "e" + countEmpotrado, name: "empotrado", x: x0, y: y0});
    const base = new Konva.Line({
        name: "subElemento Empotrado",
        x: 0,
        y: 0,
        points: [-large/2, 0, large/2, 0],
        strokeWidth: 5,
        stroke: "black"
    });

    const l1 = new Konva.Line({name: "subElemento Empotrado", x: -large/2, y: 0, points: [0, 12.5, 12.5, 0], strokeWidth: 5, stroke: "black"});
    const l2 = new Konva.Line({name: "subElemento Empotrado",x: -large/2 + 12.5, y: 0, points: [0, 12.5, 12.5, 0], strokeWidth: 5, stroke: "black"});
    const l3 = new Konva.Line({name: "subElemento Empotrado",x: -large/2 + 25, y: 0, points: [0, 12.5, 12.5, 0], strokeWidth: 5, stroke: "black"});
    //const l4 = new Konva.Line({name: "subElemento Empotrado",x: -large/2 +37.5, y: 0, points: [0, 12.5, 12.5, 0], strokeWidth: 5, stroke: "black"});

    group.add(base, l1, l2, l3);
    layer.add(group);
    allDCLelements.push(group);

    panel.style.visibility = "hidden";
    updateScorePanel();
    updateEquations();
    return group;    
}


function createApoyoDeslizante(x0, y0){
    countApoyoDeslizante += 1;

    x0 = lastVigaNodeClick.x
    y0 = lastVigaNodeClick.y
    const large = 20; //blockSnapSize / 2;

    const group = new Konva.Group({id: "ad" + countApoyoDeslizante, name: "apoyo-deslizante", x: x0, y: y0});
    const triangle = new Konva.RegularPolygon({    
        name: "subElemento ApoyoDeslizante",
        x: 0,
        y: 0 + large,
        sides: 3,
        radius: large,
        fill: "#00D2FF",
        stroke: "black",
        strokeWidth: 4,
    });

    const base = new Konva.Line({
        name: "subElemento ApoyoDeslizante",
        x: 0,
        y: 0 + 2*large ,
        points: [-large, 0, large, 0],
        strokeWidth: 5,
        stroke: "black",
    });

    group.add(triangle, base);
    layer.add(group);
    allDCLelements.push(group);

    panel.style.visibility = "hidden";
    updateScorePanel();
    updateEquations();
    return group;
}


function createApoyoNoDeslizante(x0, y0){
    countpoyoNoDeslizante += 1;
    
    x0 = lastVigaNodeClick.x
    y0 = lastVigaNodeClick.y
    const large = 20; //blockSnapSize / 2;

    const group = new Konva.Group({id: "an" + countpoyoNoDeslizante, name: "apoyo-no-deslizante", x: x0, y: y0});
    const triangle = new Konva.RegularPolygon({
        name: "subElemento ApoyoNoDeslizante",
        x: 0,
        y: 0 + large,
        sides: 3,
        radius: large,
        fill: "#00F210",
        stroke: "black",
        strokeWidth: 4,
        name: "apoyo-no-deslizante",
    });

    group.add(triangle);
    layer.add(group);
    allDCLelements.push(group);

    panel.style.visibility = "hidden";
    updateScorePanel();
    updateEquations();
    return group
}


//------------------------------------------------------Vinculos internos-----------------------------------------------//
function createRotula(x0, y0){
    x0 = lastVigaNodeClick.x
    y0 = lastVigaNodeClick.y

    const group = new Konva.Group({name: "rotula", x: x0, y: y0});
    const circle = new Konva.Circle({
        x: 0,
        y: 0,
        radius: 8,
        fill: "yellow",
        stroke: "black",
        strokeWidth: 4,
        name: "subElement Rotula"
    });

    group.add(circle);
    layer.add(group);
    allDCLelements.push(group);

    panel.style.visibility = "hidden";
    updateScorePanel();
    updateEquations();
    return group;
}


function createBiela(x0, y0){
    x0 = lastVigaNodeClick.x
    y0 = lastVigaNodeClick.y

    const group = new Konva.Group({name: "biela", x: x0, y: y0});
    const large = blockSnapSize;
    const line = new Konva.Line({
        name: "subElemento Biela",
        x: 0,
        y: 0,
        points: [0, 0, large, 0],
        strokeWidth: 5,
        stroke: "black"
    });
    const circle1 = new Konva.Circle({
        name: "subElemento Biela",
        x: 0,
        y: 0,
        radius: 7,
        fill: "yellow",
        stroke: "black",
        strokeWidth: 4,
    });
    const circle2 = circle1.clone({
        // name: "cricle2",
        x: 0+large,
        y: 0
    });

    group.add(line, circle1, circle2);
    layer.add(group);
    allDCLelements.push(group);

    panel.style.visibility = "hidden";
    updateScorePanel();
    updateEquations();
    return group
}


//------------------------------------------------------Fuerzas y momentos-----------------------------------------------//
function createFuerza(x0, y0, valMagnitud, valAngle=0){
    x0 = lastVigaNodeClick.x
    y0 = lastVigaNodeClick.y

    const magnitud = valMagnitud.value;
    const angle = valAngle.value;
    const large = blockSnapSize * 2;
    const lx = large * Math.cos(angle * Math.PI / 180)
    const ly = large * Math.sin(angle * Math.PI / 180)

    if(magnitud == "" || magnitud == null || magnitud == NaN || magnitud == undefined || magnitud == 0 ){
        return
    }
  
    const group = new Konva.Group({tension: [magnitud, angle], name: "fuerza", x: x0, y: y0});
    const arrow = new Konva.Arrow({
        x: 0,
        y: 0,
        points: [-lx, -ly, 0, 0],
        pointerLength: 15,
        pointerWidth: 15,
        fill: "black",
        stroke: "black",
        strokeWidth: 4,
        name: "fuerza",
    });


    const magnitudValue = new Konva.Text({
        x: 0+10,
        y: 0-blockSnapSize,
        text: magnitud + " N" + ", " + angle + " °",
        fontSize: 15,
        fontFamily: "Impact"
    });


    group.add(arrow, magnitudValue);
    layer.add(group);
    allDCLelements.push(group);

    panel.style.visibility = "hidden";
    updateScorePanel();
    updateEquations();
    return group;
}


function createMomentoPositivo(x0, y0, val){
    x0 = lastVigaNodeClick.x
    y0 = lastVigaNodeClick.y

    var magnitud = val.value;

    if(magnitud == "" || magnitud == null || magnitud === NaN || magnitud == undefined || magnitud == 0 ){
        return
    }

    const group = new Konva.Group({name: "momento-positivo", tension: magnitud, x: x0, y: y0});
    const arrow = new Konva.Arrow({
        x: 0,
        y: 0,
        points: [17.68, 17.68, 18.63, 16.67, 19.53, 15.61, 20.36, 14.5, 21.14, 13.35, 21.85, 12.15, 22.49, 10.92, 23.06, 9.66, 23.56, 8.36, 23.99, 7.04, 24.34, 5.7, 24.62, 4.34, 24.82, 2.97, 24.95, 1.59, 25.0, 0.2, 24.97, -1.19, 24.87, -2.57, 24.69, -3.95, 24.43, -5.31, 24.1, -6.66, 23.69, -7.99, 23.21, -9.29, 22.66, -10.57, 22.04, -11.81, 21.35, -13.01, 20.59, -14.18, 19.77, -15.3, 18.89, -16.37, 17.96, -17.39, 16.96, -18.36, 15.92, -19.28, 14.82, -20.13, 13.68, -20.92, 12.5, -21.65, 11.28, -22.31, 10.02, -22.9, 8.74, -23.42, 7.42, -23.87, 6.09, -24.25, 4.73, -24.55, 3.36, -24.77, 1.98, -24.92, 0.59, -24.99, -0.79, -24.99, -2.18, -24.9, -3.56, -24.75, -4.93, -24.51, -6.28, -24.2, -7.61, -23.81, -8.92, -23.35, -10.2, -22.82, -11.46, -22.22, -12.67, -21.55, -13.85, -20.81, -14.98, -20.01, -16.07, -19.15, -17.11, -18.23, -18.09, -17.25, -19.02, -16.22, -19.89, -15.14, -20.7, -14.01, -21.45, -12.84, -22.13, -11.63, -22.74, -10.39, -23.28, -9.11, -23.75, -7.8, -24.15, -6.47, -24.47, -5.12, -24.72, -3.75, -24.89, -2.38, -24.98, -0.99, -25.0, 0.4, -24.94, 1.78, -24.8, 3.16, -24.58, 4.54, -24.3, 5.89, -23.93, 7.23, -23.49, 8.55, -22.98, 9.84, -22.4, 11.1, -21.75, 12.33, -21.03, 13.52, -20.25, 14.66, -19.4, 15.76, -18.5, 16.82, -17.54, 17.82, -16.52, 18.76, -15.45, 19.65, -14.34, 20.48, -13.18, 21.24, -11.98, 21.94, -10.74, 22.57, -9.48, 23.13, -8.18, 23.63, -6.85, 24.04, -5.51, 24.39, -4.15, 24.65, -2.77, 24.85, -1.39, 24.96, -0.0, 25.0],
        pointerLength: 10,
        pointerWidth: 10,
        fill: "black",
        stroke: "black",
        strokeWidth: 4,
        name: "subElemento MomentoPositivo",
    });

    const magnitudValue = new Konva.Text({
        x: 0 - blockSnapSize,
        y: 0 - blockSnapSize,
        text: magnitud + " Nm",
        fontSize: 15,
        fontFamily: "Impact"
    });

    group.add(arrow, magnitudValue)
    layer.add(group);
    allDCLelements.push(group);

    panel.style.visibility = "hidden";
    updateScorePanel();
    updateEquations();
    return group;
}


function createMomentoNegativo(x0, y0, val){
    x0 = lastVigaNodeClick.x
    y0 = lastVigaNodeClick.y
    
    var magnitud = val.value;

    if(magnitud == "" || magnitud == null || magnitud == NaN || magnitud == undefined || magnitud == 0 ){
        return
    }

    const group = new Konva.Group({name: "momento-negativo", tension: magnitud, x: x0, y: y0});
    const arrow = new Konva.Arrow({
        x: 0,
        y: 0,
        points: [-17.68, 17.68, -18.63, 16.67, -19.53, 15.61, -20.36, 14.5, -21.14, 13.35, -21.85, 12.15, -22.49, 10.92, -23.06, 9.66, -23.56, 8.36, -23.99, 7.04, -24.34, 5.7, -24.62, 4.34, -24.82, 2.97, -24.95, 1.59, -25.0, 0.2, -24.97, -1.19, -24.87, -2.57, -24.69, -3.95, -24.43, -5.31, -24.1, -6.66, -23.69, -7.99, -23.21, -9.29, -22.66, -10.57, -22.04, -11.81, -21.35, -13.01, -20.59, -14.18, -19.77, -15.3, -18.89, -16.37, -17.96, -17.39, -16.96, -18.36, -15.92, -19.28, -14.82, -20.13, -13.68, -20.92, -12.5, -21.65, -11.28, -22.31, -10.02, -22.9, -8.74, -23.42, -7.42, -23.87, -6.09, -24.25, -4.73, -24.55, -3.36, -24.77, -1.98, -24.92, -0.59, -24.99, 0.79, -24.99, 2.18, -24.9, 3.56, -24.75, 4.93, -24.51, 6.28, -24.2, 7.61, -23.81, 8.92, -23.35, 10.2, -22.82, 11.46, -22.22, 12.67, -21.55, 13.85, -20.81, 14.98, -20.01, 16.07, -19.15, 17.11, -18.23, 18.09, -17.25, 19.02, -16.22, 19.89, -15.14, 20.7, -14.01, 21.45, -12.84, 22.13, -11.63, 22.74, -10.39, 23.28, -9.11, 23.75, -7.8, 24.15, -6.47, 24.47, -5.12, 24.72, -3.75, 24.89, -2.38, 24.98, -0.99, 25.0, 0.4, 24.94, 1.78, 24.8, 3.16, 24.58, 4.54, 24.3, 5.89, 23.93, 7.23, 23.49, 8.55, 22.98, 9.84, 22.4, 11.1, 21.75, 12.33, 21.03, 13.52, 20.25, 14.66, 19.4, 15.76, 18.5, 16.82, 17.54, 17.82, 16.52, 18.76, 15.45, 19.65, 14.34, 20.48, 13.18, 21.24, 11.98, 21.94, 10.74, 22.57, 9.48, 23.13, 8.18, 23.63, 6.85, 24.04, 5.51, 24.39, 4.15, 24.65, 2.77, 24.85, 1.39, 24.96, 0.0, 25.0],
        pointerLength: 10,
        pointerWidth: 10,
        fill: "black",
        stroke: "black",
        strokeWidth: 4,
        name: "subElemento MomentoNegativo",
    });

    const magnitudValue = new Konva.Text({
        x: 0 - blockSnapSize,
        y: 0 - blockSnapSize,
        text: magnitud + " Nm",
        fontSize: 15,
        fontFamily: "Impact"
    });

    group.add(arrow, magnitudValue)
    layer.add(group);
    allDCLelements.push(group);

    panel.style.visibility = "hidden";
    updateScorePanel();
    updateEquations();
    return group;
}


//------------------------------------------------------Funcionalidades-----------------------------------------------//
function getOffset(element) {
    const rect = element.getBoundingClientRect();
    return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY
    };
}


//------------------------------------------------------Panel Herramientas-----------------------------------------------//
function createButton(widthPanel, heightPanel, idNameText, btnText, execFunction, valMagnitud=0, valAngle=0, x0=160, y0=160, x1=80, y1=0){
    const btn = document.createElement("button");
    btn.type = "button";
    btn.style.backgroundColor = "yellow";
    btn.style.width = widthPanel + "px";
    btn.style.height = heightPanel  + "px";
    btn.id = idNameText;
    btn.innerText = btnText;
    btn.addEventListener("dblclick", () => {

        if (idNameText == "vigaBtn"){
            execFunction(x0, y0, x1, y1);
        } else if (idNameText == "fuerzaBtn"){
            execFunction(x0, y0, valMagnitud, valAngle);
        } else if (idNameText == "momentoPositivoBtn" || idNameText == "momentoNegativoBtn"){
            execFunction(x0, y0, valMagnitud);
        } else {
            execFunction(x0, y0);
        }
    });
    return btn;
}


function createInputMagnitud(idParam, widthPanel, heightPanel){
    const input = document.createElement("input");
    input.type = "number";
    input.setAttribute("id", idParam);
    input.min = "1";
    input.value = "1"
    input.style.width = widthPanel / 4 + "px";
    input.style.height = heightPanel  +"px";

    return input;
}


function createInputAngle(idParam, widthPanel, heightPanel){
    const input = document.createElement("input");
    input.type = "number";
    input.setAttribute("id", idParam);
    input.min = "0";
    input.max = "359";
    input.value = "90"
    input.style.width = widthPanel / 4 + "px";
    input.style.height = heightPanel  +"px";

    return input;
}


function createContainer(list){
    const container= document.createElement("div");
    container.style.display = "flex";
    list.forEach(element => {
        container.appendChild(element);
    });

    return container;
}

function createPanel(x0, y0){
    const widthPanel = 200;
    const heightPanel = 350;
    const colorPanel = "#DDDDDD"

    const heightPanelElement = heightPanel / 9;

    const panel = document.createElement("div");
    panel.style.position = "absolute";
    panel.style.left = divKonvaContainer.getBoundingClientRect().left + x0 + "px";
    panel.style.top = divKonvaContainer.getBoundingClientRect().left + y0 +"px";
    panel.style.width = widthPanel + "px";
    panel.style.height = heightPanel +"px";
    panel.style.backgroundColor = colorPanel;
    panel.style.borderColor = "black";
    panel.style.border = "40px";
    panel.style.visibility = "hidden";
    // panel.style.visibility = "visible";

    const inputCreateFuerzaMagnitud = createInputMagnitud("input-create-fuerza", widthPanel, heightPanelElement);
    const inputCreateMomentoPositivoMagnitud = createInputMagnitud("input-create-momento-positivo", widthPanel, heightPanelElement);
    const inputCreateMomentoNegativoMagnitud = createInputMagnitud("input-create-momento-negativo", widthPanel, heightPanelElement);

    const inputCreateFuerzaAngle = createInputAngle("input-create-fuerza-angle", widthPanel, heightPanelElement);

    const btnViga = createButton(widthPanel, heightPanelElement, "vigaBtn", "Viga", createViga, null); //x0, y0
    const btnApoyoDeslizante = createButton(widthPanel, heightPanelElement, "apoyoDeslizanteBtn", "Apoyo deslizante", createApoyoDeslizante); //x0, y0
    const btnApoyoNoDeslizante = createButton(widthPanel, heightPanelElement, "apoyoNoDeslizanteBtn", "Apoyo no deslizante", createApoyoNoDeslizante); //x0, y0
    const btnEmpotrado = createButton(widthPanel, heightPanelElement, "empotradoBtn", "Empotrado", createEmpotrado); //x0, y0
    const btnRotula = createButton(widthPanel, heightPanelElement, "rotulaBtn", "Rotula", createRotula); //x0, y0
    const btnBiela = createButton(widthPanel, heightPanelElement, "bielaBtn", "Biela", createBiela); //x0, y0
    const btnFuerza = createButton(widthPanel, heightPanelElement, "fuerzaBtn", "Fuerza", createFuerza, inputCreateFuerzaMagnitud, inputCreateFuerzaAngle); //x0, y0
    const btnMomentoPositivo = createButton(widthPanel, heightPanelElement, "momentoPositivoBtn", "Momento (+)", createMomentoPositivo, inputCreateMomentoPositivoMagnitud); //x0, y0
    const btnMomentoNegativo = createButton(widthPanel, heightPanelElement, "momentoNegativoBtn", "Momento (-)", createMomentoNegativo, inputCreateMomentoNegativoMagnitud); //x0, y0

    const containerFuerza = createContainer([btnFuerza, inputCreateFuerzaMagnitud, inputCreateFuerzaAngle]);
    const containerCreateMomentoPositivo = createContainer([btnMomentoPositivo, inputCreateMomentoPositivoMagnitud]);
    const containerCreateMomentoNegativo = createContainer([btnMomentoNegativo, inputCreateMomentoNegativoMagnitud]);

    const topOfPanel = document.createElement("div");
    topOfPanel.style.width = widthPanel;
    topOfPanel.style.height = heightPanelElement;
    topOfPanel.style.backgroundColor = colorPanel;
    topOfPanel.style.border = "2px";
    topOfPanel.style.borderBlockColor = "black";
    topOfPanel.innerText = "Panel ";
    topOfPanel.align = "center";

    panel.appendChild(topOfPanel)
    panel.appendChild(btnViga);
    panel.appendChild(btnApoyoDeslizante);
    panel.appendChild(btnApoyoNoDeslizante)
    panel.appendChild(btnEmpotrado);
    panel.appendChild(btnRotula);
    panel.appendChild(btnBiela)
    panel.appendChild(containerFuerza);
    panel.appendChild(containerCreateMomentoPositivo);
    panel.appendChild(containerCreateMomentoNegativo);

    return panel;
}


function listenPanelMovement(panel){
    var mousePosition;
    var isDown = false;
    var offset = [0, 0];

    panel.addEventListener("mousedown", (e) => {
        isDown = true;
        offset = [
            panel.offsetLeft - e.clientX,
            panel.offsetTop - e.clientY
        ];
    });

    document.addEventListener("mouseup", function() {
        isDown = false;
    });

    document.addEventListener("mousemove", (e) => {
        e.preventDefault();
        if (isDown) {
            mousePosition = {
                x : e.clientX,
                y : e.clientY
            };
            panel.style.left = (mousePosition.x + offset[0]) + "px";
            panel.style.top  = (mousePosition.y + offset[1]) + "px";
        }
    });

    return mousePosition;
}


function movePanelTo(panel, x, y){
    
    panel.style.left = getOffset(divKonvaContainer).left + x + "px";
    panel.style.top  = getOffset(divKonvaContainer).top + y + "px";

}


function getXY(){
    const mouseXY = stage.getPointerPosition();
    if (mouseXY){
        // console.log("En mouseXY: " + mouseXY.x + ", " + mouseXY.y);
        return {x: mouseXY.x, y: mouseXY.y};
    } else {
        console.log("Fallo en ");
        return {x: 800, y:800};
    }
}


function roundXY(mouseXY){
    var {x, y} = mouseXY;
    X = Math.round(x / blockSnapSize) * blockSnapSize
    Y = Math.round(y / blockSnapSize) * blockSnapSize
    return {x: X, y: Y}
}


//------------------------------------------------------Puntaje-----------------------------------------------//
function createScorePanel(x0, y0){
    const widthPanel = 240;
    const heightPanel = 40;
    const colorPanel = "#DDDDDD";

    const panel = document.createElement("div");
    panel.style.position = "absolute";
    // panel.style.left = x0 + "px";
    // panel.style.top = y0 +"px";
    panel.style.width = widthPanel + "px";
    panel.style.height = heightPanel +"px";
    panel.style.backgroundColor = colorPanel;
    panel.style.borderColor = "black";
    panel.style.border = "40px";
    panel.style.visibility = "visible"; // hidden or visible
    panel.style.display = "flex";

    const categoryText = document.createElement("h4")
    categoryText.id = "categoryText";
    categoryText.innerText = "Categoria: ";

    const valueCategory = document.createElement("h4");
    valueCategory.id = "valueCategory"
    valueCategory.innerText = "1"

    const containerCategory = document.createElement("div");
    containerCategory.style.display = "flex";
    containerCategory.appendChild(categoryText);
    containerCategory.appendChild(valueCategory);
    
    const scoreText = document.createElement("h4");
    scoreText.id = "scoreText";
    scoreText.innerText = "Puntaje: ";

    const valueScore = document.createElement("h4");
    valueScore.id = "valueScore";
    valueScore.innerText = "0";

    const containerScore = document.createElement("div");
    containerScore.style.display = "flex";
   
    containerScore.appendChild(scoreText);
    containerScore.appendChild(valueScore);
    
    panel.appendChild(containerCategory);
    panel.appendChild(containerScore);

    return panel
}


function calculateScore(){
    var result = 0;
    allDCLelements.some((element) =>{
        //console.log(element.name())
        if (element.name() == "rotula"){
            result += 9;
        } else if (element.name() == "biela"){
            result += 4;
        } else if (element.name() == "empotrado"){
            result += 4;
        } else if (element.name() == "apoyo-no-deslizante"){
            result += 3;
        } else if (element.name() == "apoyo-deslizante"){
            result += 1;
        } else if (element.name() == "fuerza-distribuida"){
            result += 3;
        } else if (element.name() == "fuerza-en-angulo"){
            result += 4;
        } else if (element.name() == "fuerza-ortogonal"){
            result += 2;
        } else if (element.name() == "momento-positivo"){
            result += 1;
        } else if (element.name() == "momento-negativo"){
            result += 1;
        } else if (element.name() == "fuerza"){
            result += 2;
        }

    });

    return result;
}


function calcuateCategory(){
    //console.log("Estoy en calculate category ... imprimiento los name() ")
    var result = 1;
    allDCLelements.some((element) =>{
        //console.log(element.name());
        if (element.name() == "rotula" || element.name() == "biela"){
            result = 4;
        } else if (element.name() == "rotula" || element.name() == "biela"){
        result = 4;
        
        } else if (result < 4 && (element.name() == "fuerza-distribuida")){
            result = 3;
        } else if (result < 3 && (element.name() == "fuerza")){
            result =2
        }
    });
    return result;
}


function updateScorePanel(){
    var category = calcuateCategory();
    var score = calculateScore();
    scorePanel.querySelector("#valueCategory").innerText = category
    scorePanel.querySelector("#valueScore").innerHTML = score
}


//------------------------------------------------------Ecuaciones-----------------------------------------------//
function createEquationsPanel(){
    const panel = document.createElement("div");

    const equationFxDiv = document.createElement("div");
    equationFxDiv.id = "fx"
    const contentFx = document.createElement("h4");
    contentFx.innerText = "ΣFx:" + " = 0";
    equationFxDiv.appendChild(contentFx);

    const equationFyDiv = document.createElement("div");
    equationFyDiv.id = "fy"
    const contentFy = document.createElement("h4");
    contentFy.innerText = "ΣFy:" + " = 0";
    equationFyDiv.appendChild(contentFy);

    const equationMoDiv = document.createElement("div");
    equationMoDiv.id = "mo"
    const contentMo = document.createElement("h4");
    contentMo.innerText = "ΣMo:" + " = 0";
    equationMoDiv.appendChild(contentMo);

    panel.appendChild(equationFxDiv);
    panel.appendChild(equationFyDiv);
    panel.appendChild(equationMoDiv);

    return panel;
}

function updateEquations(){
    console.log("uptade equations: ")

    var textFx = "ΣFx:";
    var textFy = "ΣFy:";
    var textMo = "ΣMo:";

    const origin = allDCLelements[0].getChildren((child) => { return child.name() == "subElementoVigaCirculo1"})[0];
    console.log(origin)
    const originXY = {x: origin.getAttr("x"), y: origin.getAttr("y")};
    console.log(originXY);

    allDCLelements.forEach((element) => {
        const posXY = {x: element.getAttr("x"), y: element.getAttr("y")};
        const diff = {x: posXY.x - originXY.x, y: posXY.y - originXY.y}

        if(element.name() == "fuerza"){
            const tension = element.getAttr("tension");
            const magnitud = parseInt(tension[0]);
            const angle = parseInt(tension[1]);

            if(0 <= angle && angle < 90){ // sen - cos +
                if(angle == 0){
                    textFx += `+ ${magnitud}N `;
                } else {
                    textFx += `+ ${magnitud}cos(${angle})N `;
                    textFy += `- ${magnitud}sin(${angle})N `;
                }
            } else if(90 <= angle && angle < 180){ // sen cos 
                if(angle == 90){
                    textFy += `- ${magnitud}N `;
                } else {
                    textFx += `- ${magnitud}cos(${180 - angle})N `;
                    textFy += `- ${magnitud}sin(${180 - angle})N `;
                }
            } else if(180 <= angle && angle < 270){ // sen cos
                if(angle == 180){
                    textFx += `- ${magnitud}N `;
                } else {
                    textFx += `- ${magnitud}cos(${angle - 180})N `;
                    textFy += `+ ${magnitud}sin(${angle - 180})N `;
                }
            } else if(270 <= angle && angle < 360){ // sen cos
                if(angle == 270){
                    textFy += `+ ${magnitud}N `;
                } else {
                    textFx += `+ ${magnitud}cos(${360 - angle})N `;
                    textFy += `+ ${magnitud}sin(${360 - angle})N `;
                }
            }
        } else if (element.name() == "empotrado" ){
            textFx +=  `+ F${element.getAttr("id")}_x`;
            textFy +=  `+ F${element.getAttr("id")}_y`;

            if (diff.x > 0){
                textMo +=  `+ ${Math.abs(diff.x)/blockSnapSize}m*F${element.getAttr("id")}_y`;
            } else if (diff.x < 0){
                textMo +=  `- ${Math.abs(diff.x)/blockSnapSize}m*F${element.getAttr("id")}_y`;
            }

            if (diff.y > 0){
                textMo +=  `+ ${Math.abs(diff.x)/blockSnapSize}m*F${element.getAttr("id")}_x`;
            } else if (diff.y < 0){
                textMo +=  `- ${Math.abs(diff.x)/blockSnapSize}m*F${element.getAttr("id")}_x`;
            }
            textMo +=  `+ M${element.getAttr("id")}`;

        } else if (element.name() == "apoyo-deslizante" ){
            textFy +=  `+ F${element.getAttr("id")}_y`;

            if (diff.x > 0){
                textMo +=  `+ ${Math.abs(diff.x)/blockSnapSize}m*F${element.getAttr("id")}_y`;
            } else if (diff.x < 0){
                textMo +=  `- ${Math.abs(diff.x)/blockSnapSize}m*F${element.getAttr("id")}_y`;
            }


        } else if (element.name() == "apoyo-no-deslizante" ){
            textFx +=  `+ F${element.getAttr("id")}_x`;
            textFy +=  `+ F${element.getAttr("id")}_y`;

            if (diff.x > 0){
                textMo +=  `+ ${Math.abs(diff.x)/blockSnapSize}m*F${element.getAttr("id")}_y`;
            } else if (diff.x < 0){
                textMo +=  `- ${Math.abs(diff.x)/blockSnapSize}m*F${element.getAttr("id")}_y`;
            }

            if (diff.y > 0){
                textMo +=  `+ ${Math.abs(diff.x)/blockSnapSize}m*F${element.getAttr("id")}_x`;
            } else if (diff.y < 0){
                textMo +=  `- ${Math.abs(diff.x)/blockSnapSize}m*F${element.getAttr("id")}_x`;
            }


        } else if (element.name() == "momento-positivo"){
            const tension = element.getAttr("tension");
            textMo += `+ ${tension}Nm`

        } else if (element.name() == "momento-negativo"){
            const tension = element.getAttr("tension");
            textMo += `- ${tension}Nm`
        }
    });
    textFx += "= 0";
    textFy += "= 0";
    textMo += "= 0";
    const fx = document.querySelector("#fx");
    const fy = document.querySelector("#fy");
    const mo = document.querySelector("#mo");
    fx.innerText = textFx;
    fy.innerText = textFy;
    mo.innerText = textMo;
}

export default {
    createShadowViga,
    newViga,
    updateViga,
    updateViga,
    createViga,
    createEmpotrado,
    createApoyoDeslizante,
    createApoyoNoDeslizante,
    createRotula,
    createBiela,
    createFuerza,
    createMomentoPositivo,
    createMomentoNegativo,
    getOffset,
    createButton,
    createInputMagnitud,
    createInputAngle,
    createContainer,
    listenPanelMovement,
    movePanelTo,
    getXY,
    roundXY,
    createScorePanel,
    calculateScore,
    calcuateCategory,
    updateScorePanel,
    createEquationsPanel,
    updateEquations
}