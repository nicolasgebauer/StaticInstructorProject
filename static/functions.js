function createShadowViga(x0, y0, x1, y1, nameShadow="shadow-viga"){
    const group = new Konva.Group({name: nameShadow});
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
    return group
}


//------------------------------------------------------Viga-----------------------------------------------//
function newViga(x0, y0, x1, y1, nameViga="viga"){ //parte en el punto (x0, y0) y se desplaza x1 horizontalmente ^ y1 verticalmente ( no va al punto (x1, y1))
    let colorCircle = "red";
    let dragg = true;
    if(nameViga == "initialViga"){
        colorCircle = "green";
        dragg = false;
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
        draggable: dragg
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
        updateAll();
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
        updateAll();
    });
}


function createViga(nameViga="viga"){
    let x0 = lastVigaNodeClick.x
    let y0 = lastVigaNodeClick.y
    const y1 = 0;
    const x1 = blockSnapSize * 3;

    let nameShadow = "shadow-viga";
    if (nameViga == "initialViga"){
        x0 = blockSnapSize * 8;
        y0 = blockSnapSize * 8;
        nameShadow = "shadow-initialViga"
    }

    const line = newViga(x0, y0, x1, y1, nameViga);
    const shadowLine = createShadowViga(x0, y0, x1, y1, nameShadow);
    shadowLine.hide();

    layer.add(line, shadowLine);
   
    allDCLelements.push(line);

    updateViga(line, shadowLine);
    panel.style.visibility = "hidden";
    delPanel.style.visibility = "hidden";
    // updateAll();
    moveVigasToTop();
  
    return line
}


//------------------------------------------------------Vinculos externos-----------------------------------------------//
function createEmpotrado(){
    countEmpotrado += 1;

    const x0 = lastVigaNodeClick.x;
    const y0 = lastVigaNodeClick.y;
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
    delPanel.style.visibility = "hidden";
    // updateAll();
    moveVigasToTop();
    return group;    
}


function createApoyoDeslizante(){
    countApoyoDeslizante += 1;

    const x0 = lastVigaNodeClick.x
    const y0 = lastVigaNodeClick.y
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
    delPanel.style.visibility = "hidden";
    // updateAll();
    moveVigasToTop();
    return group;
}


function createApoyoNoDeslizante(){
    countpoyoNoDeslizante += 1;
    
    const x0 = lastVigaNodeClick.x
    const y0 = lastVigaNodeClick.y
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
    });

    group.add(triangle);
    layer.add(group);
    allDCLelements.push(group);

    panel.style.visibility = "hidden";
    delPanel.style.visibility = "hidden";
    // updateAll();
    moveVigasToTop();
    
}


//------------------------------------------------------Vinculos internos-----------------------------------------------//
function createRotula(){
    const x0 = lastVigaNodeClick.x
    const y0 = lastVigaNodeClick.y

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
    delPanel.style.visibility = "hidden";
    // updateAll();
    moveVigasToTop();
    return group;
}


function createBiela(){
    const x0 = lastVigaNodeClick.x
    const y0 = lastVigaNodeClick.y

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
    delPanel.style.visibility = "hidden";
    // updateAll();
    moveVigasToTop();
    return group
}


//------------------------------------------------------Fuerzas y momentos-----------------------------------------------//
function createFuerza(valMagnitud, valAngle, color="black", x0=0, y0=0, layerForPaint=layer, aux="aux"){
    let x0lastPos = lastVigaNodeClick.x
    let y0lasPos = lastVigaNodeClick.y
    
    let magnitud = valMagnitud;
    let angle = valAngle;
    let txt = magnitud + " N" + ", " + angle + " °";

    const large = blockSnapSize * 2;
    const lx = large * Math.cos(angle * Math.PI / 180)
    const ly = large * Math.sin(angle * Math.PI / 180)

    if (color != "black"){
        x0lastPos = x0;
        y0lasPos = y0;
        txt = valMagnitud
    }
  
    const group = new Konva.Group({tension: [magnitud, angle], name: "fuerza", x: x0lastPos, y: y0lasPos});
    const arrow = new Konva.Arrow({
        x: 0,
        y: 0,
        points: [lx, -ly, 0, 0],
        pointerLength: 15,
        pointerWidth: 15,
        fill: color,
        stroke: color,
        strokeWidth: 4
    });

    const magnitudValue = new Konva.Text({
        x: lx+4,
        y: -ly,
        text: txt,
        fontSize: 15,
        fontFamily: "Impact",
        fill: color
    });


    group.add(arrow, magnitudValue);
    layer.add(group);
    layerForPaint.add(group);
    if (color == "black"){
        allDCLelements.push(group);
    }
    
    panel.style.visibility = "hidden";
    delPanel.style.visibility = "hidden";
    updateEquations();
    updateScorePanel();
    moveVigasToTop();
    return group;
}


function createMomentoPositivo(val, color="black", x0=0, y0=0, layerForPaint=layer){
    let x0lastPos = lastVigaNodeClick.x
    let y0lastPos = lastVigaNodeClick.y

    let magnitud = val;
    let txt = magnitud + " Nm";

    if (color != "black"){
        x0lastPos = x0;
        y0lastPos = y0;
        txt = val;
    }

    const group = new Konva.Group({name: "momento-positivo", tension: magnitud, x: x0lastPos, y: y0lastPos});
    const arrow = new Konva.Arrow({
        x: 0,
        y: 0,
        points: [17.68, 17.68, 18.63, 16.67, 19.53, 15.61, 20.36, 14.5, 21.14, 13.35, 21.85, 12.15, 22.49, 10.92, 23.06, 9.66, 23.56, 8.36, 23.99, 7.04, 24.34, 5.7, 24.62, 4.34, 24.82, 2.97, 24.95, 1.59, 25.0, 0.2, 24.97, -1.19, 24.87, -2.57, 24.69, -3.95, 24.43, -5.31, 24.1, -6.66, 23.69, -7.99, 23.21, -9.29, 22.66, -10.57, 22.04, -11.81, 21.35, -13.01, 20.59, -14.18, 19.77, -15.3, 18.89, -16.37, 17.96, -17.39, 16.96, -18.36, 15.92, -19.28, 14.82, -20.13, 13.68, -20.92, 12.5, -21.65, 11.28, -22.31, 10.02, -22.9, 8.74, -23.42, 7.42, -23.87, 6.09, -24.25, 4.73, -24.55, 3.36, -24.77, 1.98, -24.92, 0.59, -24.99, -0.79, -24.99, -2.18, -24.9, -3.56, -24.75, -4.93, -24.51, -6.28, -24.2, -7.61, -23.81, -8.92, -23.35, -10.2, -22.82, -11.46, -22.22, -12.67, -21.55, -13.85, -20.81, -14.98, -20.01, -16.07, -19.15, -17.11, -18.23, -18.09, -17.25, -19.02, -16.22, -19.89, -15.14, -20.7, -14.01, -21.45, -12.84, -22.13, -11.63, -22.74, -10.39, -23.28, -9.11, -23.75, -7.8, -24.15, -6.47, -24.47, -5.12, -24.72, -3.75, -24.89, -2.38, -24.98, -0.99, -25.0, 0.4, -24.94, 1.78, -24.8, 3.16, -24.58, 4.54, -24.3, 5.89, -23.93, 7.23, -23.49, 8.55, -22.98, 9.84, -22.4, 11.1, -21.75, 12.33, -21.03, 13.52, -20.25, 14.66, -19.4, 15.76, -18.5, 16.82, -17.54, 17.82, -16.52, 18.76, -15.45, 19.65, -14.34, 20.48, -13.18, 21.24, -11.98, 21.94, -10.74, 22.57, -9.48, 23.13, -8.18, 23.63, -6.85, 24.04, -5.51, 24.39, -4.15, 24.65, -2.77, 24.85, -1.39, 24.96, -0.0, 25.0],
        pointerLength: 10,
        pointerWidth: 10,
        fill: color,
        stroke: color,
        strokeWidth: 4,
        name: "subElemento MomentoPositivo",
    });

    const magnitudValue = new Konva.Text({
        x: 0 - blockSnapSize,
        y: 0 - blockSnapSize,
        text: txt,
        fontSize: 15,
        fontFamily: "Impact",
        fill: color,
    });

    group.add(arrow, magnitudValue)
    layerForPaint.add(group);
    if (color == "black"){
        allDCLelements.push(group);
    }

    panel.style.visibility = "hidden";
    delPanel.style.visibility = "hidden";
    updateEquations();
    updateScorePanel();
    return group;
}


function createMomentoNegativo(val, color="black", x0=0, y0=0, layerForPaint=layer){
    let x0lastPos = lastVigaNodeClick.x
    let y0lastPos = lastVigaNodeClick.y

    let magnitud = val;
    let txt = magnitud + " Nm";

    if (color != "black"){
        x0lastPos = x0;
        y0lastPos = y0;
        txt = val;
    }

    const group = new Konva.Group({name: "momento-negativo", tension: magnitud, x: x0lastPos, y: y0lastPos});
    const arrow = new Konva.Arrow({
        x: 0,
        y: 0,
        points: [-17.68, 17.68, -18.63, 16.67, -19.53, 15.61, -20.36, 14.5, -21.14, 13.35, -21.85, 12.15, -22.49, 10.92, -23.06, 9.66, -23.56, 8.36, -23.99, 7.04, -24.34, 5.7, -24.62, 4.34, -24.82, 2.97, -24.95, 1.59, -25.0, 0.2, -24.97, -1.19, -24.87, -2.57, -24.69, -3.95, -24.43, -5.31, -24.1, -6.66, -23.69, -7.99, -23.21, -9.29, -22.66, -10.57, -22.04, -11.81, -21.35, -13.01, -20.59, -14.18, -19.77, -15.3, -18.89, -16.37, -17.96, -17.39, -16.96, -18.36, -15.92, -19.28, -14.82, -20.13, -13.68, -20.92, -12.5, -21.65, -11.28, -22.31, -10.02, -22.9, -8.74, -23.42, -7.42, -23.87, -6.09, -24.25, -4.73, -24.55, -3.36, -24.77, -1.98, -24.92, -0.59, -24.99, 0.79, -24.99, 2.18, -24.9, 3.56, -24.75, 4.93, -24.51, 6.28, -24.2, 7.61, -23.81, 8.92, -23.35, 10.2, -22.82, 11.46, -22.22, 12.67, -21.55, 13.85, -20.81, 14.98, -20.01, 16.07, -19.15, 17.11, -18.23, 18.09, -17.25, 19.02, -16.22, 19.89, -15.14, 20.7, -14.01, 21.45, -12.84, 22.13, -11.63, 22.74, -10.39, 23.28, -9.11, 23.75, -7.8, 24.15, -6.47, 24.47, -5.12, 24.72, -3.75, 24.89, -2.38, 24.98, -0.99, 25.0, 0.4, 24.94, 1.78, 24.8, 3.16, 24.58, 4.54, 24.3, 5.89, 23.93, 7.23, 23.49, 8.55, 22.98, 9.84, 22.4, 11.1, 21.75, 12.33, 21.03, 13.52, 20.25, 14.66, 19.4, 15.76, 18.5, 16.82, 17.54, 17.82, 16.52, 18.76, 15.45, 19.65, 14.34, 20.48, 13.18, 21.24, 11.98, 21.94, 10.74, 22.57, 9.48, 23.13, 8.18, 23.63, 6.85, 24.04, 5.51, 24.39, 4.15, 24.65, 2.77, 24.85, 1.39, 24.96, 0.0, 25.0],
        pointerLength: 10,
        pointerWidth: 10,
        fill: color,
        stroke: color,
        strokeWidth: 4,
        name: "subElemento MomentoNegativo",
    });

    const magnitudValue = new Konva.Text({
        x: 0 - blockSnapSize,
        y: 0 - blockSnapSize,
        text: txt,
        fontSize: 15,
        fontFamily: "Impact",
        fill: color,
    });

    group.add(arrow, magnitudValue)
    layerForPaint.add(group);
    if (color == "black"){
        allDCLelements.push(group);
    }

    panel.style.visibility = "hidden";
    delPanel.style.visibility = "hidden";
    updateEquations();
    updateScorePanel();
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
function createButton(widthPanel, heightPanel, idNameText, btnText, execFunction, valMagnitud=0, valAngle=0, element=0){
    const btn = document.createElement("button");
    btn.type = "button";
    btn.style.backgroundColor = "yellow";
    btn.style.width = widthPanel + "px";
    btn.style.height = heightPanel  + "px";
    btn.id = idNameText;
    btn.innerText = btnText;
    btn.addEventListener("dblclick", () => {

        if (idNameText == "vigaBtn"){
            execFunction();
        } else if (idNameText == "fuerzaBtn"){
            execFunction(valMagnitud.value, valAngle.value);
        } else if (idNameText == "momentoPositivoBtn" || idNameText == "momentoNegativoBtn"){
            execFunction(valMagnitud.value);
        } else if(idNameText == "deleteElementBtn"){
            execFunction(element);
        } else {
            execFunction();
        }
        updateAll();
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
    const colorPanel = "#DDDDDD";

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
    panel.style.zIndex = "1000";
    // panel.style.visibility = "visible";

    const inputCreateFuerzaMagnitud = createInputMagnitud("input-create-fuerza", widthPanel, heightPanelElement);
    const inputCreateMomentoPositivoMagnitud = createInputMagnitud("input-create-momento-positivo", widthPanel, heightPanelElement);
    const inputCreateMomentoNegativoMagnitud = createInputMagnitud("input-create-momento-negativo", widthPanel, heightPanelElement);

    const inputCreateFuerzaAngle = createInputAngle("input-create-fuerza-angle", widthPanel, heightPanelElement);

    const btnViga = createButton(widthPanel, heightPanelElement, "vigaBtn", "Viga", createViga, null);
    const btnApoyoDeslizante = createButton(widthPanel, heightPanelElement, "apoyoDeslizanteBtn", "Apoyo deslizante", createApoyoDeslizante); 
    const btnApoyoNoDeslizante = createButton(widthPanel, heightPanelElement, "apoyoNoDeslizanteBtn", "Apoyo no deslizante", createApoyoNoDeslizante); 
    const btnEmpotrado = createButton(widthPanel, heightPanelElement, "empotradoBtn", "Empotrado", createEmpotrado); 
    const btnRotula = createButton(widthPanel, heightPanelElement, "rotulaBtn", "Rotula", createRotula);
    const btnBiela = createButton(widthPanel, heightPanelElement, "bielaBtn", "Biela", createBiela); 
    const btnFuerza = createButton(widthPanel, heightPanelElement, "fuerzaBtn", "Fuerza", createFuerza, inputCreateFuerzaMagnitud, inputCreateFuerzaAngle); 
    const btnMomentoPositivo = createButton(widthPanel, heightPanelElement, "momentoPositivoBtn", "Momento (+)", createMomentoPositivo, inputCreateMomentoPositivoMagnitud); 
    const btnMomentoNegativo = createButton(widthPanel, heightPanelElement, "momentoNegativoBtn", "Momento (-)", createMomentoNegativo, inputCreateMomentoNegativoMagnitud); 

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

    panel.appendChild(topOfPanel);
    panel.appendChild(btnViga);
    panel.appendChild(btnApoyoDeslizante);
    panel.appendChild(btnApoyoNoDeslizante)
    panel.appendChild(btnEmpotrado);
    panel.appendChild(btnRotula);
    panel.appendChild(btnBiela);
    panel.appendChild(containerFuerza);
    panel.appendChild(containerCreateMomentoPositivo);
    panel.appendChild(containerCreateMomentoNegativo);

    return panel;
}


function listenPanelMovement(panel){
    let mousePosition;
    let isDown = false;
    let offset = [0, 0];

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


function movePanelTo(panelParam, x, y){
    if (panelParam == panel){
        panelParam.style.left = getOffset(divKonvaContainer).left + x + "px";
        panelParam.style.top  = getOffset(divKonvaContainer).top + y + "px";
    } else if (panelParam == delPanel){
        panelParam.style.left = getOffset(divKonvaContainer).left + x - panelParam.offsetWidth + "px";
        panelParam.style.top  = getOffset(divKonvaContainer).top + y + "px";
    }

}


function getXY(){
    const mouseXY = stage.getPointerPosition();
    if (mouseXY){
        return {x: mouseXY.x, y: mouseXY.y};
    } else {
        console.log("Fallo en getXY()");
        return {x: 800, y:800};
    }
}


function roundXY(mouseXY){
    const {x, y} = mouseXY;
    const X = Math.round(x / blockSnapSize) * blockSnapSize;
    const Y = Math.round(y / blockSnapSize) * blockSnapSize;
    return {x: X, y: Y};
}


//------------------------------------------------------Puntaje-----------------------------------------------//
function createScorePanel(x0, y0){
    const widthPanel = 240;
    const heightPanel = 40;
    const colorPanel = "#DDDDDD";

    const panel = document.createElement("div");
    panel.style.position = "absolute";
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
    valueCategory.id = "valueCategory";
    valueCategory.innerText = "1";

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

    return panel;
}


function calculateScore(){
    let result = 0;
    allDCLelements.some((element) =>{
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
    console.log("en calculateCategory")
    let result = 0;
    allDCLelements.some((element) =>{
        if (element.name() == "rotula" || element.name() == "biela"){
            result = 4; 
            return;

        } else if (result < 4 && (element.name() == "fuerza-distribuida")){
            result = 3;
            return;

        } else if (result < 3 && (element.name() == "fuerza")){
            const magnitud = element.getAttr("tension")[1];
            
            if (magnitud != "0" && magnitud != "90" && magnitud != "180" && magnitud != "270"){
                result = 2

            } else {
                result = 1;
            }
            return;
        }
    });
    return result;
}


function updateScorePanel(){
    if(!resolvingTask){
        let category = calcuateCategory();
        let score = calculateScore();
        scorePanel.querySelector("#valueCategory").innerText = category;
        scorePanel.querySelector("#valueScore").innerHTML = score;
    }
}


//------------------------------------------------------Ecuaciones-----------------------------------------------//
function createEquationsPanel(){
    const panel = document.createElement("div");

    const equationFxDiv = document.createElement("div");
    equationFxDiv.id = "fx";
    const contentFx = document.createElement("h4");
    contentFx.innerText = "ΣFx:" + " = 0";
    equationFxDiv.appendChild(contentFx);

    const equationFyDiv = document.createElement("div");
    equationFyDiv.id = "fy";
    const contentFy = document.createElement("h4");
    contentFy.innerText = "ΣFy:" + " = 0";
    equationFyDiv.appendChild(contentFy);

    const equationMoDiv = document.createElement("div");
    equationMoDiv.id = "mo";
    const contentMo = document.createElement("h4");
    contentMo.innerText = "ΣMo:" + " = 0";
    equationMoDiv.appendChild(contentMo);

    panel.appendChild(equationFxDiv);
    panel.appendChild(equationFyDiv);
    panel.appendChild(equationMoDiv);

    return panel;
}


function degToRad(deg){
    return deg * Math.PI / 180;
}


function updateEquations(){
    if (!resolvingTask){
        let textFx = "ΣFx: ";
        let textFy = "ΣFy: ";
        let textMo = "ΣMo: ";
    
        const inital = stage.find(element => {return element.name() == "initialViga"})[0];
        const origin = inital.getChildren((child) => { return child.name() == "subElementoVigaCirculo1"})[0];
        const originXY = {x: origin.getAttr("x"), y: origin.getAttr("y")};
    
        allDCLelements.forEach((element) => {
            const posXY = {x: element.getAttr("x"), y: element.getAttr("y")};
            const diff = {x: posXY.x - originXY.x, y: posXY.y - originXY.y};
    
            if(element.name() == "fuerza"){
                const tension = element.getAttr("tension");
                const magnitud = parseInt(tension[0]);
                const angle = parseInt(tension[1]);
    
                if(0 == angle){
                    textFx += `- ${magnitud}N`;
                    if (diff.y > 0){
                        textMo +=  `- ${Math.abs(diff.y)/blockSnapSize}m*${magnitud}N`;
                    } else if (diff.y < 0){
                        textMo +=  `+ ${Math.abs(diff.y)/blockSnapSize}m*${magnitud}N`;
                    }
                } else if (0 < angle && angle < 90){
                    textFx += `- ${magnitud}*cos(${angle})N`;
                    textFy += `- ${magnitud}*sin(${angle})N`;
                    if ((-diff.y/diff.x).toFixed(4) == Math.tan(degToRad(angle)).toFixed(4)){
                        console.log("fuerza y el brazo tienen la misma pendiente");
                    } else {
                        if (diff.x > 0){
                            textMo += `- ${Math.abs(diff.x)/blockSnapSize}m*${magnitud}*sin(${angle})`
                        } else if (diff.x < 0){
                            textMo += `+ ${Math.abs(diff.x)/blockSnapSize}m*${magnitud}*sin(${angle})`
                        }
                        if (diff.y > 0){
                            textMo += `- ${Math.abs(diff.y)/blockSnapSize}m*${magnitud}*cos(${angle})N`
                        } else if (diff.y < 0){
                            textMo += `+ ${Math.abs(diff.y)/blockSnapSize}m*${magnitud}*cos(${angle})N`
                        } 
                    }
            
                } else if (90 == angle){
                    textFy += `- ${magnitud}N`;
                    if (diff.x > 0){
                        textMo +=  `+ ${Math.abs(diff.x)/blockSnapSize}m*${magnitud}N`;
                    } else if (diff.x < 0){
                        textMo +=  `+ ${Math.abs(diff.x)/blockSnapSize}m*${magnitud}N`;
                    }
    
                } else if (90 < angle && angle < 180){
                    textFx += `+ ${magnitud}*cos(${180 - angle})N`;
                    textFy += `- ${magnitud}*sin(${180 - angle})N`;
                    if ((-diff.y/diff.x).toFixed(4) == Math.tan(degToRad(angle)).toFixed(4)){
                        console.log("fuerza y el brazo tienen la misma pendiente");
                    } else {
                        if (diff.x > 0){
                            textMo += `- ${Math.abs(diff.x)/blockSnapSize}m*${magnitud}*sin(${angle - 90})N`
                        } else if (diff.x < 0){
                            textMo += `+ ${Math.abs(diff.x)/blockSnapSize}m*${magnitud}*sin(${angle - 90})N`
                        }
                        if (diff.y > 0){
                            textMo += `+ ${Math.abs(diff.y)/blockSnapSize}m*${magnitud}*cos(${angle - 90})N`
                        } else if (diff.y < 0){
                            textMo += `- ${Math.abs(diff.y)/blockSnapSize}m*${magnitud}*cos(${angle - 90})N`
                        } 
                    }
                    
                } else if (180 == angle){
                    textFx += `+ ${magnitud}N`;
                    if (diff.y > 0){
                        textMo +=  `+ ${Math.abs(diff.y)/blockSnapSize}m*${magnitud}N`;
                    } else if (diff.y < 0){
                        textMo +=  `- ${Math.abs(diff.y)/blockSnapSize}m*${magnitud}N`;
                    }
                } else if (180 < angle && angle < 270){
                    textFx += `+ ${magnitud}*cos(${angle - 180})N`;
                    textFy += `+ ${magnitud}*sin(${angle - 180})N`;
                    if ((-diff.y/diff.x).toFixed(4) == Math.tan(degToRad(angle)).toFixed(4)){
                        console.log("fuerza y el brazo tienen la misma pendiente");
                    } else {
                        if (diff.x > 0){
                            textMo += `+ ${Math.abs(diff.x)/blockSnapSize}m*${magnitud}*sin(${angle - 180})N`
                        } else if (diff.x < 0){
                            textMo += `- ${Math.abs(diff.x)/blockSnapSize}m*${magnitud}*sin(${angle - 180})N`
                        }
                        if (diff.y > 0){
                            textMo += `+ ${Math.abs(diff.y)/blockSnapSize}m*${magnitud}*cos(${angle - 180})N`
                        } else if (diff.y < 0){
                            textMo += `- ${Math.abs(diff.y)/blockSnapSize}m*${magnitud}*cos(${angle - 180})N`
                        } 
                    }
                    
                } else if (270 == angle){
                    textFy += `+ ${magnitud}N`;
                    if (diff.x > 0){
                        textMo +=  `+ ${Math.abs(diff.x)/blockSnapSize}m*${magnitud}N`;
                    } else if (diff.x < 0){
                        textMo +=  `- ${Math.abs(diff.x)/blockSnapSize}m*${magnitud}N`;
                    }
                } else if (270 < angle && angle < 360){
                    textFx += `- ${magnitud}*cos(${360 - angle})N`;
                    textFy += `+ ${magnitud}*sin(${360 - angle})N`;
                    if ((-diff.y/diff.x).toFixed(4) == Math.tan(degToRad(angle)).toFixed(4)){
                        console.log("fuerza y el brazo tienen la misma pendiente");
                    } else {
                        if (diff.x > 0){
                            textMo += `+ ${Math.abs(diff.x)/blockSnapSize}m*${magnitud}*sin(${360 - angle})N`
                        } else if (diff.x < 0){
                            textMo += `- ${Math.abs(diff.x)/blockSnapSize}m*${magnitud}*sin(${360 - angle})N`
                        }
                        if (diff.y > 0){
                            textMo += `- ${Math.abs(diff.y)/blockSnapSize}m*${magnitud}*cos(${360 - angle})N`
                        } else if (diff.y < 0){
                            textMo += `+ ${Math.abs(diff.y)/blockSnapSize}m*${magnitud}*cos(${360 - angle})N`
                        } 
                    }
                    
                }
    
                // textMo += `${magnitud}*(${Math.abs(diff.y)/blockSnapSize}*cos(${angle}) - ${Math.abs(diff.x)/blockSnapSize}*sin(${angle}))`
    
            } else if (element.name() == "empotrado" ){
                textFx +=  `+ F${element.getAttr("id")}_x`;
                textFy +=  `+ F${element.getAttr("id")}_y`;
    
                if (diff.x > 0){
                    textMo +=  `+ ${Math.abs(diff.x)/blockSnapSize}m*F${element.getAttr("id")}_y`;
                } else if (diff.x < 0){
                    textMo +=  `- ${Math.abs(diff.x)/blockSnapSize}m*F${element.getAttr("id")}_y`;
                }
    
                if (diff.y > 0){
                    textMo +=  `+ ${Math.abs(diff.y)/blockSnapSize}m*F${element.getAttr("id")}_x`;
                } else if (diff.y < 0){
                    textMo +=  `- ${Math.abs(diff.y)/blockSnapSize}m*F${element.getAttr("id")}_x`;
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
                }id_draw
    
    
            } else if (element.name() == "momento-positivo"){
                const tension = element.getAttr("tension");
                textMo += `+ ${tension}Nm`;
    
            } else if (element.name() == "momento-negativo"){
                const tension = element.getAttr("tension");
                textMo += `- ${tension}Nm`;
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
}


function listenSave(){
    stage.on("mouseout", (e) => {
        document.querySelector("#id_draw").value = stage.toJSON();
        document.querySelector("#id_dcl").value = stage2.toJSON();
        document.querySelector("#id_category").value = document.querySelector("#valueCategory").innerText;
        document.querySelector("#id_level_points").value = document.querySelector("#valueScore").innerText;
  
    });
}

function listenSaveStudent(){
    stage.on("mouseout", (e) => {
        document.querySelector("#id_student_draw").value = stage.toJSON();
    });
}



function listenCreateElement(){
    stage.on("dblclick", (e) => {
        if (e.target != stage && e.target) {
            const mouseXY = roundXY(getXY());
            lastVigaNodeClick.x = mouseXY.x;
            lastVigaNodeClick.y = mouseXY.y;
            
            if (e.target.name() == "subElementoVigaCirculo1" || e.target.name() == "subElementoVigaCirculo2"){
                panel.style.visibility = "visible";
                movePanelTo(panel, mouseXY.x, mouseXY.y);
            }
        }
    });
}


function deleteElement(element){
    idx = allDCLelements.indexOf(element);;
    allDCLelements.splice(idx, 1);
    element.destroy();
    delete element;
}


function listenDeleteElement(){
    stage.on("dblclick", (e) => {
        if (e.target && e.target.getParent()){
            const element = e.target.getParent();
            const name = element.name();
            if (name == "viga"                  ||
                name == "apoyo-deslizante"      ||
                name == "apoyo-no-deslizante"   ||
                name == "empotrado"             ||
                name == "rotula"                ||
                name == "biela"                 ||
                name == "fuerza"                ||
                name == "momento-positivo"      ||
                name == "momento-negativo"){
                    const mouseXY = roundXY(getXY());
                    lastElementClick = element;
                    delPanel.style.visibility = "visible";
                    movePanelTo(delPanel, mouseXY.x, mouseXY.y);
                }
        } 
    });
}


function listenHiddePanels(){
    stage.on("click", () => {
        panel.style.visibility = "hidden";
        delPanel.style.visibility = "hidden";
        if(resolvingTask){
            compare(stage, stageSolution);
        }
    });
}


function updateAll(){
    if (!resolvingTask){
        updateEquations();
        updateScorePanel();
        replaceApoyos();
    }
}


function replaceApoyos(){
    if (!resolvingTask){
        stage2 = Konva.Node.create(JSON.parse(stage.clone({name: "stage2"}).toJSON()), 'container2');

        let layer2 = stage2.find(element => {
            return element.name() == "layer";
        })[0];
    
        const apoyosDeslizantes = layer2.find(element => {
            return element.name() == "apoyo-deslizante";
        });
        apoyosDeslizantes.forEach((item) => {
            const posXY = {x: item.getAttr("x"), y: item.getAttr("y")}
            createFuerza(`F${item.getAttr("id")}_y`, 270, color="green", x0=posXY.x, y0=posXY.y, layerForPaint=layer2);
            item.destroy();
        })
    
        const apoyosNoDeslizantes = layer2.find(element => {
            return element.name() == "apoyo-no-deslizante";
        });
        apoyosNoDeslizantes.forEach((item) => {
            const posXY = {x: item.getAttr("x"), y: item.getAttr("y")}
            createFuerza(`F${item.getAttr("id")}_y`, 270, color="green", x0=posXY.x, y0=posXY.y, layerForPaint=layer2);
            createFuerza(`F${item.getAttr("id")}_x`, 180, color="green", x0=posXY.x, y0=posXY.y, layerForPaint=layer2);
            item.destroy();
        })
    
        const empotrados = layer2.find(element => {
            return element.name() == "empotrado";
        });
        empotrados.forEach((item) => {
            const posXY = {x: item.getAttr("x"), y: item.getAttr("y")}
            createFuerza(`F${item.getAttr("id")}_y`, 270, color="green", x0=posXY.x, y0=posXY.y, layerForPaint=layer2);
            createFuerza(`F${item.getAttr("id")}_x`, 180, color="green", x0=posXY.x, y0=posXY.y, layerForPaint=layer2);
            createMomentoPositivo(`M${item.getAttr("id")}`, color="green", x0=posXY.x, y0=posXY.y, layerForPaint=layer2)
            item.destroy();
        })
    
        const fuerzas = layer2.find(element => {
            return element.name() == "fuerza";
        });
        fuerzas.forEach((item) => {
            const posXY = {x: item.getAttr("x"), y: item.getAttr("y")}
            const magnitud = item.getAttr("tension")[0];
            const angle = item.getAttr("tension")[1];
            const angleRad = angle * Math.PI / 180;
        
            if(0 == angle){ //
                createFuerza(`${magnitud}N`, 0, color="green", x0=posXY.x, y0=posXY.y, layerForPaint=layer2);
                item.destroy();
            } else if (0 < angle && angle < 90){ //
                createFuerza(`${magnitud}*cos(${angle})N`, 0, color="green", x0=posXY.x, y0=posXY.y, layerForPaint=layer2);
                createFuerza(`${magnitud}*sin(${angle})N`, 90, color="green", x0=posXY.x, y0=posXY.y, layerForPaint=layer2);
                item.destroy();
            } else if (90 == angle){ //
                createFuerza(`${magnitud}N`, 90, color="green", x0=posXY.x, y0=posXY.y, layerForPaint=layer2);
                item.destroy();
            } else if (90 < angle && angle < 180){
                createFuerza(`${magnitud}*cos(${angle - 90})N`, 180, color="green", x0=posXY.x, y0=posXY.y, layerForPaint=layer2);
                createFuerza(`${magnitud}*sin(${angle - 90})N`, 90, color="green", x0=posXY.x, y0=posXY.y, layerForPaint=layer2);
                item.destroy();
            } else if (180 == angle){ //
                createFuerza(`${magnitud}N`, 180, color="green", x0=posXY.x, y0=posXY.y, layerForPaint=layer2);
                item.destroy();
            } else if (180 < angle && angle < 270){
                createFuerza(`${magnitud}*cos(${angle - 180})N`, 180, color="green", x0=posXY.x, y0=posXY.y, layerForPaint=layer2);
                createFuerza(`${magnitud}*sin(${angle - 180})N`, 270, color="green", x0=posXY.x, y0=posXY.y, layerForPaint=layer2);
                item.destroy();
            } else if (270 == angle){ //
                createFuerza(`${magnitud}N`, 270, color="green", x0=posXY.x, y0=posXY.y, layerForPaint=layer2);
                item.destroy();
            } else if (270 < angle && angle < 360){
                createFuerza(`${magnitud}*cos(${360 - angle})N`, 0, color="green", x0=posXY.x, y0=posXY.y, layerForPaint=layer2);
                createFuerza(`${magnitud}*sin(${360 - angle})N`, 270, color="green", x0=posXY.x, y0=posXY.y, layerForPaint=layer2);
                item.destroy();
            }
        });
        const momentosPositivos = layer2.find(element => {
            return element.name() == "momento-positivo";
        });
        momentosPositivos.forEach((item) => {
            const posXY = {x: item.getAttr("x"), y: item.getAttr("y")}
            createMomentoPositivo(`${item.getAttr("tension")}Nm`, color="green", x0=posXY.x, y0=posXY.y, layerForPaint=layer2);
            item.destroy();
        });
        const momentosNegativos = layer2.find(element => {
            return element.name() == "momento-negativo";
        });
        momentosNegativos.forEach((item) => {
            const posXY = {x: item.getAttr("x"), y: item.getAttr("y")}
            createMomentoNegativo(`${item.getAttr("tension")}Nm`, color="green", x0=posXY.x, y0=posXY.y, layerForPaint=layer2);
            item.destroy();
        });
    }

}


function updateCounts(){
    stage.find( (element) => { 
       if (element.name() == "empotrado") countEmpotrado += 1;
       else if (element.name() == "apoyo-deslizante") countApoyoDeslizante += 1;
       else if (element.name() == "empotrado") countEmpotrado += 1;
    });
}


function moveVigasToTop(){
    // const vigas = layer.getChildren(element => {
    //     return element.name() == "viga";
    // });

    // const initialViga = layer.getChildren(element => {
    //     return element.name() == "initialViga";
    // })[0];
    // vigas.push(initialViga);
    // vigas.forEach(viga => {
    //     viga.moveToTop();
    // });
}

//------------------------------------------------------Delete panel-----------------------------------------------//
function delElement(){
    deleteElement(lastElementClick);
    delPanel.style.visibility = "hidden";
    panel.style.visibility = "hidden";
}


function createDelPanel(x0=0, y0=0){
    const widthPanel = 150;
    const heightPanel = 60;
    const colorPanel = "#DDDDDD";

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
    panel.style.zIndex = "1001";


    const deleteElementBtn = createButton(widthPanel, heightPanel, "delElementBtn", "eliminar", delElement);

    panel.appendChild(deleteElementBtn);


    return panel;
}


function createHashElements(stage){
    const hash = {
        initialViga: [],
        vigas: [],
        apoyosDeslizantes: [],
        apoyosNoDeslizantes: [],
        empotrados: [],
        bielas: [],
        rotulas: [],
        fuerzas: [],
        momentosPositivos: [],
        momentosNegativos: []
    }

    const layer = stage.find(element => {
        return element.name() == "layer";
    })[0];

    layer.getChildren().forEach(element => {
        if (element.name() == "initialViga"){
            hash.initialViga.push(element);

        } else if (element.name() == "viga"){
            hash.vigas.push(element);

        } else if (element.name() == "apoyo-deslizante"){
            hash.apoyosDeslizantes.push(element);

        } else if (element.name() == "apoyo-no-deslizante"){
            hash.apoyosNoDeslizantes.push(element);

        } else if (element.name() == "empotrado"){
            hash.empotrados.push(element);

        } else if (element.name() == "biela"){
            hash.bielas.push(element);

        } else if (element.name() == "rotula"){
            hash.rotulas.push(element);

        } else if (element.name() == "fuerza"){
            hash.fuerzas.push(element);

        } else if (element.name() == "momento-positivo"){
            hash.momentosPositivos.push(element);

        } else if (element.name() == "momento-negativo"){
            hash.momentosNegativos.push(element);
        }
    });

    return hash;
}

function getStartEndViga(viga){
    const circle1 = viga.getChildren()[1];
    const circle2 = viga.getChildren()[2];
    const c1x = circle1.getAttr("x");
    const c1y = circle1.getAttr("y");
    const c2x = circle2.getAttr("x");
    const c2y = circle2.getAttr("y");

    return {start: [c1x, c1y], end: [c2x, c2y]};
}

function getElementPos(element){
    const X = element.getAttr("x");
    const Y = element.getAttr("y");

    return [X, Y];
    return {x: X, y: Y};
}

function comparePositions(list1, list2){
    return JSON.stringify(list1) === JSON.stringify(list2);
}

function comparefuerzas(tension1, tension2){
    return JSON.stringify(tension1) === JSON.stringify(tension2);
}

function hashOfErros(){
    return {
        ERRORinitialViga: new Set(),
        ERRORvigas: new Set(),
        ERRORapoyosDeslizantes: new Set(),
        ERRORapoyosNoDeslizantes: new Set(),
        ERRORempotrados: new Set(),
        ERRORbielas: new Set(),
        ERRORrotulas: new Set(),
        ERRORfuerzas: new Set(),
        ERRORmomentosPositivos: new Set(),
        ERRORmomentosNegativos: new Set()
    }

}

function compare(stage1, stage2){ //stage1 student  stage2 solution
    const ERRORS = hashOfErros();

    const hashElementsStage1 = createHashElements(stage1);
    const hashElementsStage2 = createHashElements(stage2);

    const initViga1 = hashElementsStage1.initialViga[0];
    const initViga2 = hashElementsStage2.initialViga[0];

    const initViga1Pos = getStartEndViga(initViga1);
    const initViga2Pos = getStartEndViga(initViga2);

    let verifyedInitialViga = true;
    if (comparePositions(initViga1Pos.end, initViga2Pos.end)){ //comparamos que la viga inicial este bien posicionada
        console.log("Viga inicial bien posicionada!");
    } else {
        console.log("Viga inicial mal posicionada!");
        verifyedInitialViga = false;
        ERRORS.ERRORinitialViga.add("OJO: Atencion con la viga inicial");
    }

    let verifyedVigas = hashElementsStage1.vigas.length == hashElementsStage2.vigas.length;
    if (!verifyedVigas) ERRORS.ERRORvigas.add("OJO: Atencion con la cantidad de vigas (no iniciales)");
    hashElementsStage1.vigas.forEach(viga1 => {
        let viga1Pos = getStartEndViga(viga1);
        let verify = false;
        hashElementsStage2.vigas.forEach(viga2 => {
            let viga2Pos = getStartEndViga(viga2);
            if (comparePositions(viga1Pos.start, viga2Pos.start && comparePositions(viga1Pos.end, viga2Pos.end))){
                verify = true;
            }
        });
        verifyedVigas &&= verify; 
    });
    if (!verifyedVigas) ERRORS.ERRORvigas.add("OJO: Atencion con la posicion de alguna viga");

    let verifyedAD = hashElementsStage1.apoyosDeslizantes.length == hashElementsStage2.apoyosDeslizantes.length;  
    if (!verifyedAD) ERRORS.ERRORapoyosDeslizantes.add("OJO: Atencion con la cantidad de apoyos deslizantes");
    hashElementsStage1.apoyosDeslizantes.forEach(ad1 => {
        let ad1Pos = getElementPos(ad1);
        let verify = false;
        hashElementsStage2.apoyosDeslizantes.forEach(ad2 => {
            let ad2Pos = getElementPos(ad2);
            if (comparePositions(ad1Pos, ad2Pos)){
                verify = true;
            }
        });
        verifyedAD &&= verify;
    });
    if (!verifyedAD) ERRORS.ERRORapoyosDeslizantes.add("OJO: Atencion con la posicion de algun apoyo deslizante");

    let verifyedAND = hashElementsStage1.apoyosNoDeslizantes.length == hashElementsStage2.apoyosNoDeslizantes.length;
    if (!verifyedAND) ERRORS.ERRORapoyosNoDeslizantes.add("OJO: Atencion con la cantidad de apoyos no deslizantes");
    hashElementsStage1.apoyosNoDeslizantes.forEach(and1 => {
        let and1Pos = getElementPos(and1);
        let verify = false;
        hashElementsStage2.apoyosNoDeslizantes.forEach(and2 => {
            let and2Pos = getElementPos(and2);
            if (comparePositions(and1Pos, and2Pos)){
                verify = true;
            }
        });
        verifyedAND &&= verify;
    });
    if (!verifyedAND) ERRORS.ERRORapoyosNoDeslizantes.add("OJO: Atencion con la posicion de algun apoyo no deslizante");

    let verifyedEmpotrados = hashElementsStage1.empotrados.length == hashElementsStage2.empotrados.length;
    if (!verifyedEmpotrados) ERRORS.ERRORempotrados.add("OJO: Atencion con la cantidad de empotrados");
    hashElementsStage1.empotrados.forEach(e1 => {
        let e1Pos = getElementPos(e1);
        let verify = false;
        hashElementsStage2.empotrados.forEach(e2 => {
            let e2Pos = getElementPos(e2);
            if (comparePositions(e1Pos, e2Pos)){
                verify = true;
            }
        });
        verifyedEmpotrados &&= verify;
    });
    if (!verifyedEmpotrados) ERRORS.ERRORempotrados.add("OJO: Atencion con la posicion de algun empotrado");

    let verifyedRotulas = hashElementsStage1.rotulas.length == hashElementsStage2.rotulas.length;
    if (!verifyedRotulas) ERRORS.ERRORrotulas.add("OJO: Atencion con la cantidad de rotulas");
    hashElementsStage1.rotulas.forEach(r1 => {
        let r1Pos = getElementPos(r1);
        let verify = false;
        hashElementsStage2.rotulas.forEach(r2 => {
            let r2Pos = getElementPos(r2);
            if (comparePositions(r1Pos, r2Pos)){
                verify = true;
            }
        });
        verifyedRotulas &&= verify;
    });
    if (!verifyedRotulas) ERRORS.ERRORrotulas.add("OJO: Atencion con la posicion de alguna rotula");

    let verifyedBielas = hashElementsStage1.bielas.length == hashElementsStage2.bielas.length;
    if (!verifyedBielas) ERRORS.ERRORbielas.add("OJO: Atencion con la cantidad de bielas");
    hashElementsStage1.bielas.forEach(b1 => {
        let b1Pos = getElementPos(b1);
        let verify = false;
        hashElementsStage2.bielas.forEach(b2 => {
            let b2Pos = getElementPos(b2);
            if (comparePositions(b1Pos, b2Pos)){
                verify = true;
            }
        });
        verifyedBielas &&= verify;
    });
    if (!verifyedBielas) ERRORS.ERRORrotulas.add("OJO: Atencion con la posicion de alguna biela");

    let verifyedMN = hashElementsStage1.momentosNegativos.length == hashElementsStage2.momentosNegativos.length;
    if (!verifyedMN) ERRORS.ERRORmomentosNegativos.add("OJO: Atencion con la cantidad de momentos negativos");
    hashElementsStage1.bielas.forEach(mn1 => {
        let mn1Pos = getElementPos(mn1);
        let verify = false;
        let aux = false;
        hashElementsStage2.bielas.forEach(mn2 => {
            let mn2Pos = getElementPos(mn2);
            if (comparePositions(mn1Pos, mn2Pos)){
                if (mn1.getAttr("tension") == mn2.getAttr("tension")){
                    verify = true;
                } else {
                    ERRORS.ERRORmomentosNegativos.add("OJO: Atencion con la magnitud de algun momento negativo");
                    aux = true;
                }
            } 
        });
        verifyedMN &&= verify;
        if (!verify && !aux) ERRORS.ERRORmomentosNegativos.add("OJO: Atencion con la posicion de algun momento negativo");
    });

    let verifyedMP = hashElementsStage1.momentosPositivos.length == hashElementsStage2.momentosPositivos.length;
    if (!verifyedMP) ERRORS.ERRORmomentosPositivos.add("OJO: Atencion con la cantidad de momentos positivos");
    hashElementsStage1.momentosPositivos.forEach(mp1 => {
        let mp1Pos = getElementPos(mp1);
        let verify = false;
        let aux = false;
        hashElementsStage2.momentosPositivos.forEach(mp2 => {
            let mp2Pos = getElementPos(mp2);
            if (comparePositions(mp1Pos, mp2Pos)){
                if (mp1.getAttr("tension") == mp2.getAttr("tension")){
                    verify = true;
                } else {
                    ERRORS.ERRORmomentosPositivos.add("OJO: Atencion con la magnitud de algun momento positivo");
                    aux = true;
                }
            } 
        });
        verifyedMP &&= verify;
        if (!verify && !aux) ERRORS.ERRORmomentosPositivos.add("OJO: Atencion con la posicion de algun momento positivo");
    });

    let verifyedFuerzas = hashElementsStage1.fuerzas.length == hashElementsStage2.fuerzas.length;  
    if (!verifyedFuerzas) ERRORS.ERRORfuerzas.add("OJO: Atencion con la cantidad de fuerzas");
    hashElementsStage1.fuerzas.forEach(f1 => {
        let f1Pos = getElementPos(f1);
        let verify = false;
        let aux = false;
        hashElementsStage2.fuerzas.forEach(f2 => {
            let f2Pos = getElementPos(f2);
            if (comparePositions(f1Pos, f2Pos)){
                if (comparefuerzas(f1.getAttr("tension"), f2.getAttr("tension"))){
                    verify = true;
                } else {
                    ERRORS.ERRORfuerzas.add("OJO: Atencion con la magnitud o angulo de algun fuerza");
                    aux = true;
                }
            } 
        });
        verifyedFuerzas &&= verify;
        if (!verify && !aux) ERRORS.E.add("OJO: Atencion con la posicion de alguna fuerza");
    });
    

    console.log("verificaciones")
    const listOfConditions = [verifyedInitialViga, verifyedVigas, verifyedAD, verifyedAND, verifyedEmpotrados, verifyedRotulas, verifyedBielas, verifyedMP, verifyedMN, verifyedFuerzas]
    taskResolvedSuccefully = listOfConditions.every(condition => {condition == true});
    console.clear();
    console.log(ERRORS);

    return ERRORS;

}