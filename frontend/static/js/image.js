var id,
    contex,
    canvasWidth = 0,
    canvasHeight = 0,
    outlineImage = new Image(),
    colorImage = new Image(),
    backgroundImage = new Image(),
    drawingAreaX,
    drawingAreaY,
    drawingAreaWidth,
    drawingAreaHeight,
    curColor = [0, 0, 0, 0],
    outlineColor = [0, 0, 0, 255],
    colorLayerData,
    outlineLayerData,
    totalLoadResources = 3,
    curLoadResNum = 0;


window.onload = function () {

    init();

    // controllare se esiste la maschera, se non esiste o è invalida
    // rendere non cliccabile il pusante displayMask

    /*

    - init():  funzione che prende l'elemento canvas,
    fa il load dell'immagine (backgroundLayer), dell'immagine che verrà colorata (colorLayer) e della maschera (se esiste - outlineLayer),
    e fa il draw del canvas per la prima volta.

    - clearCanvas(): funzione che ripulisce il canvas e mantiene il display solo il backgroundLayer

    - redraw(): funzione che disegna elementi nel canvas.
     fa il clearCanvas, disegna l'immagine di mezzo (colorLayer) con i colori modificati (legge le annotazioni salvate),
     disegna la maschera (outlineLayer).

    - matchOutlineColor(r, g, b, a): funzione che controlla se ho raggiunto i bordi della maschera
    ritorna true o false dopo il confornto con i valori della maschera
        return (r = outlineR && g = outlineG && b = outlineB && a == outlineA )

    - matchStartColor(pixelPos, startR, startG, startB): funzione che serve a controllare se il colore corrisponde al colore di partenza
    se il pixel corrente nell'outlineLayer è "nero" ritorna false
    controlla r, g, b nel pixel del colorLayer
                se corrisponde al colore cliccato ritorna true
                se corrisponde al nuovo colore ritorna false
    ritorna true


    - colorPixel(pixelPos, r, g, b, a): funzione che colora un pixel del colorLayer
        colorLayerData.data[pixelPos] = r;
        colorLayerData.data[pixelPos + 1] = g;
        colorLayerData.data[pixelPos + 2] = b;
        colorLayerData.data[pixelPos + 3] = a !== undefined ? a : 255;

    - floodFill(startX, startY, startR, startG, startB, startA = 255): funzione che serve a:
            scorrere verso l'alto pixel per pixel fino a trovare il bordo dell'immagine o
                un pixel che non ha lo stesso colore di riempimento
            scorrere verso il basso aggiungendo nuovi pixel allo stack e colorando i pixels
            dopo aver colorato un pixel si controlla se a sx e dx del pixel dobbiamo colorare (ignorando ogni pixel minore di 0)
                ovvero controlliamo se il colore del pixel sx corrisponde al colore iniziale (matchStartColor) e
                in caso positivo
                    se reachLeft era a false lo poniamo a true e aggiungiamo il pixel al pixelStack (push)
                    altrimenti passiamo a controllare nello stesso modo a dx
                in caso contrario poniamo reachLeft a false e passiamo a controllare nello stesso modo a dx
            e procede verso il basso




     */

    //Creates a new, blank ImageData object with the specified dimensions. All of the pixels in the new object are transparent black


};




function init(){
    // extracts the image id from the url
    let url_string = window.location.href;
    let url = new URL(url_string);
    let image_id = url.searchParams.get("image");
    id = image_id;

    // get background_canvas and its context
    let canvas = document.getElementById("background_canvas");
    contex = canvas.getContext("2d");

    // getJSON request to take the image from the server and draw it on the canvas
    $.getJSON(
        'http://localhost:5000/images/'+image_id, function (data) {
            // console.log(data);
            // console.log(data.image.id);
            // console.log(data.image.name);
            // console.log(data.image.url);

            backgroundImage.src = data.image.url;
            backgroundImage.onload = () => {

                canvasWidth = backgroundImage.width;
                canvasHeight = backgroundImage.height;

                canvas.width = backgroundImage.width;
                canvas.height = backgroundImage.height;

                contex.drawImage(backgroundImage, 0, 0);
            }
        }
    ).error(function(jqXHR, textStatus, errorThrown) {
        // !!!! Da rivedere

        console.log("errore 404 rilevato");

        console.log("error " + textStatus);
        console.log("error " + errorThrown);

    });

}

function createMask() {

    if (confirm("Se confermi la maschera precedente (se esiste) andrà persa.")) {

        // takes kernel, dist, ratio value and set them as newData attributes
        let kernel = document.getElementById("kernel").value;
        let dist = document.getElementById("dist").value;
        let ratio = document.getElementById("ratio").value;

        var newData = {
                "id": this.id,
                "ratio" : ratio,
                "kernel" : kernel,
                "dist": dist
            };

        // turns data format into JSON
        var dataJson = JSON.stringify(newData);
        console.log(dataJson);

        // post data on server
        $.ajax({
            url: "http://localhost:5000/masks",
            type: "post",
            // The key needs to match your method's input parameter (case-sensitive).
            data: dataJson,
            dataType: "json",
            contentType: "application/json"

        }).done(
            function(data){
                console.log(data);
            }
        );

        /*
        $.post(
            'http://localhost:5000/masks',
            {
                id: this.id,
                ratio : ratio,
                kernel : kernel,
                dist: dist
            }).done(
            function(data){
                console.log(data);
            });
         */

    } else {
      console.log("You pressed Cancel!");
    }

}

function displayMask() {

    // takes last created mask for the current image
    $.getJSON( 'http://localhost:5000/masks/'+ id, function (data) {

        if (data.mask.valid === 'Y'){
            // console.log(data);

            // takes hex mask_color, convert it to rgb and save it as outlineR, outlineG, outlineB
            let hex_color = document.getElementById("mask_color");
            console.log(hex_color.value);

            var rgb_color = hexToRGB(hex_color.value);
            console.log(rgb_color);
            outlineColor[0] = rgb_color.r;
            outlineColor[1] = rgb_color.g;
            outlineColor[2] = rgb_color.b;

            // takes opacity
            let mask_opacity = document.getElementById("opacity");
            outlineColor[3] = Math.round(((mask_opacity.value * 255)/100));
            console.log(outlineColor[3]);

            // set kernel, dist, ratio as the settings of the last mask created
            let kernel = document.getElementById("kernel");
            let dist = document.getElementById("dist");
            let ratio = document.getElementById("ratio");

            kernel.value = data.mask.kernel;
            dist.value = data.mask.dist;
            ratio.value = data.mask.ratio;

            // takes mask_boundaries and draws them in the outline layer (3° canvas)
            var outline_matrix = JSON.parse(data.mask.boundaries);
            var outline_canvas = document.getElementById('outline-canvas');
            var ctx3 = outline_canvas.getContext("2d");

            outline_canvas.width = canvasWidth;
            outline_canvas.height = canvasHeight;
            outline_canvas.addEventListener('click', createMouseEvents);
            // console.log("canvasWidth, canvasHeight");
            // console.log(canvasWidth, canvasHeight);
            outlineLayerData = ctx3.createImageData(canvasWidth, canvasHeight);
            outlineImage = outlineLayerData.data;

            // scroll the matrix with boundaries to create the outline image
            var len = outlineLayerData.data.length;
            console.log(len);
            let col = 0;
            let row = 0;
            var pixel = [];
            for (let i = 0; i <= len && row < canvasHeight; i += 4 ){
                pixel = outline_matrix[row][col];
                if (pixel[0] == "0"){
                    outlineImage[i] = outlineColor[0];       // r
                    outlineImage[i + 1] = outlineColor[1];   // g
                    outlineImage[i + 2] = outlineColor[2];   // b
                    outlineImage[i + 3] = outlineColor[3];   // a
                }
                if (col == canvasWidth-1){
                    row ++;
                    col = 0;
                } else {
                    col++;
                }

            }

            // draw the outline layer in the 3° canvas
            ctx3.putImageData(outlineLayerData, 0, 0 );

            // set colorLayerData and colorImage
            var color_canvas = document.getElementById('middle-canvas');
            color_canvas.width = canvasWidth;
            color_canvas.height = canvasHeight;
            var ctx2 = color_canvas.getContext("2d");
            colorLayerData = ctx2.createImageData(canvasWidth, canvasHeight);
            colorImage = colorLayerData.data;

            /*
            // !!! PENSA SE CAMBIARE POSIZIONE
            var color_canvas = document.getElementById('middle-canvas');
            color_canvas.width = canvasWidth;
            color_canvas.height = canvasHeight;
            color_canvas.addEventListener('click', createMouseEvents);
             */

        } else {
            alert('Non esiste ancora una maschera, ' +
                'inserisci le specifiche e premi ' +
                'Create Mask per crearne una')
        }

        }
    ).error(function(jqXHR, textStatus, errorThrown) {
        // !!!! Da rivedere

        console.log("errore 404 rilevato - la maschera corrispondente non esiste");

        console.log("error " + textStatus);
        console.log("error " + errorThrown);

    });
}

function hexToRGB(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function createMouseEvents(e) {

    var color_canvas = document.getElementById('middle-canvas');

    // get color_canvas position
    drawingAreaX = color_canvas.getBoundingClientRect().left;
    drawingAreaY = color_canvas.getBoundingClientRect().top;

    // mouse click coordinates on the canvas
    var mouseX = Math.round(e.pageX - document.body.scrollLeft - document.documentElement.scrollLeft - drawingAreaX),
        mouseY = Math.round(e.pageY - document.body.scrollTop - document.documentElement.scrollTop - drawingAreaY);

    // TODO: in alcune immagini la drawingArea è float... questo è un problema per mouseX, mouseY che servono
    //  per indicare il pixel della matrice --> DA RISOLVERE!!!

    console.log("mouseX: " + mouseX + ", mouseY: " + mouseY);
    // console.log("e.pageX: " + e.pageX + ", document.body.scrollLeft: " + document.body.scrollLeft + ", drawingAreaX " + drawingAreaX);
    // console.log("e.pageY: " + e.pageY + ", document.body.scrollTop: " + document.body.scrollTop + ", drawingAreaY " + drawingAreaY);

    paintAt(mouseX, mouseY);

    /*
    if (mouseX < drawingAreaX){ //sx dell'area di disegno
        // non deve fare nulla
    } else if ((mouseY > drawingAreaY && mouseY < drawingAreaY + canvasHeight) && (mouseX <= drawingAreaX + canvasWidth)){
        // localizzazione mouse click nell'area di disegno
        paintAt(mouseX - drawingAreaX, mouseY - drawingAreaY);
    }
     */

}

function paintAt(startX, startY) { // inizia a disegnare con il tool del secchiello dal pixel spacificato da startX e startY

    // takes hex mask_color, convert it to rgb and save it as outlineR, outlineG, outlineB
    let hex_color = document.getElementById("ann_color");
    //console.log(hex_color.value);

    var rgb_color = hexToRGB(hex_color.value);
    //console.log(rgb_color);
    curColor[0] = rgb_color.r;
    curColor[1] = rgb_color.g;
    curColor[2] = rgb_color.b;

    // takes opacity
    let ann_opacity = document.getElementById("ann_opacity");
    curColor[3] = Math.round(((ann_opacity.value * 255)/100));

    // takes pixel RGBA color
    var pixelPos = (startY * canvasWidth + startX) * 4,
        r = colorImage[pixelPos],
        g = colorImage[pixelPos + 1],
        b = colorImage[pixelPos + 2],
        a = colorImage[pixelPos + 3];

    // console.log("pixelPos: " + pixelPos);
    // console.log("r: " + r + ", g: " + g + ", b: " + b + ", a: " + a);

    // !!!! CAPIRE SE pixelPos è calcolato bene


    // return if you try to recolor the area with the same color and the same opacity
    if (r == curColor[0] && g == curColor[1] && b == curColor[2] && a == curColor[3]){
        console.log(" try to recolor the area with the same color and the same opacity ");
        return
    }

    // console.log("colore selezionato:");
    // console.log("r: " + curColor[0] + ", g: " + curColor[1] + ", b: " + curColor[2] + ", a: " + curColor[3]);

    // return if you click on the mask border
    if (matchOutlineBorder(pixelPos)){
        console.log(" click on the mask border ");
        return
    }

    // call flood Fill method and pass to it initial (x,y) and initial RGBA of the pixel clicked
    floodFill(startX, startY, r, g, b, a);

    redraw();
    /*

    redraw();

     */

}

function matchOutlineBorder(pixelPos){
    var r = outlineImage[pixelPos],
        g = outlineImage[pixelPos + 1],
        b = outlineImage[pixelPos + 2],
        a = outlineImage[pixelPos + 3];

    //console.log("OUTLINE r: " + r + ", g: " + g + ", b: " + b + ", a: " + a);
    //console.log("OUTLINE-COLOR r: " + outlineColor[0] + ", g: " + outlineColor[1] + ", b: " + outlineColor[2] + ", a: " + outlineColor[3]);

    return (r === outlineColor[0] && g === outlineColor[1] && b === outlineColor[2] && a == outlineColor[3] );
}

function floodFill(startX, startY, startR, startG, startB, startA) {

    var newPos,
        x,
        y,
        pixelPos,
        reachLeft,
        reachRight,
        drawingBoundLeft = 0,
        drawingBoundTop = 0,
        drawingBoundRight = drawingBoundLeft + canvasWidth - 1,
        drawingBoundBottom = drawingBoundTop + canvasHeight - 1,

        // drawingBoundLeft = drawingAreaX,
        // drawingBoundTop = drawingAreaY,
        // drawingBoundRight = drawingAreaX + canvasWidth - 1,
        // drawingBoundBottom = drawingAreaY + canvasHeight - 1,
        pixelStack = [[startX, startY]];

    while (pixelStack.length){

        newPos = pixelStack.pop();
        x = newPos[0];
        y = newPos[1];

        // prende la posizione del pixel corrente
        pixelPos = (y * canvasWidth + x) * 4;
        // console.log("pixelPos: " + pixelPos );
        // console.log("x: " + x + ", y: " + y );

        // colorImage[pixelPos] = 255;
        // colorImage[pixelPos + 4] = 255;


        // var ctx2 = document.getElementById('middle-canvas').getContext("2d");
        //colorLayerData = ctx2.getImageData(0,0, canvasWidth, canvasHeight);
        // colorImage = colorLayerData.data;
        /*
        console.log(colorImage);
        console.log(colorImage.length);
        console.log(colorLayerData);
        console.log(outlineImage);
        console.log("canvasWidth: " + canvasWidth + ", canvasHeight: " + canvasHeight);

         */


        // va su finche il colore matches e si è dentro il canvas
        while ( y >= drawingBoundTop && matchInitialColor(pixelPos, startR, startG, startB, startA)){
            y -= 1;
            pixelPos -= canvasWidth * 4;
        }

        pixelPos += canvasWidth * 4;
        y += 1;
        reachLeft = false;
        reachRight = false;

        // scende finche il colore matches e si è dentro il canvas
        while (y <= drawingBoundBottom && matchInitialColor(pixelPos, startR, startG, startB, startA)){
            y += 1;

            colorPixel(pixelPos, curColor[0], curColor[1], curColor[2], curColor[3]);

            if (x > drawingBoundLeft){
                if (matchInitialColor(pixelPos - 4, startR, startG, startB, startA)){
                    if(!reachLeft){
                        //aggiungi pixel allo stack
                        pixelStack.push([x - 1, y]);
                        reachLeft = true;
                    }
                } else if(reachLeft){
                    reachLeft = false;
                }
            }

            if (x < drawingBoundRight){
                if (matchInitialColor(pixelPos + 4, startR, startG, startB, startA)){
                    if(!reachRight){
                        //aggiungi pixel allo stack
                        pixelStack.push([x + 1, y]);
                        reachRight = true;
                    }
                } else if(reachRight){
                    reachRight = false;
                }
            }

            pixelPos += canvasWidth * 4;

        }



    }


}

function matchInitialColor(pixelPos, startR, startG, startB, startA) {

    // se il pixel corrente nell'outline image è bordo
    if (matchOutlineBorder(pixelPos)){
        return false;
    }

    var r = colorImage[pixelPos],
        g = colorImage[pixelPos + 1],
        b = colorImage[pixelPos + 2],
        a = colorImage[pixelPos + 3];

    // If the current pixel matches the clicked color
    // se il pixel corrente appartiene allo stesso gruppo di quello cliccato
    if (r == startR && g == startG && b == startB && a == startA){
        return true;
    }

    // If current pixel color matches the new color and opacity
    if (r == curColor[0] && g == curColor[1] && b == curColor[2] && a == curColor[3]) {
        return false;
    }

    return true;
}

function colorPixel(pixelPos, r, g, b, a) {
    colorImage[pixelPos] = r;
    colorImage[pixelPos + 1] = g;
    colorImage[pixelPos + 2] = b;
    colorImage[pixelPos + 3] = a !== undefined ? a : 255;
}

function redraw() {  //disegna gli elementi nel canvas
    var locX,
        locY;

    // Make sure required resources are loaded before redrawing

    //if (curLoadResNum < totalLoadResources) {
    //    return;
    //}


    //clearCanvas();

    var ctx2 = document.getElementById('middle-canvas').getContext("2d");

    // disegna lo stato corrente del color layer sul canvas (invertire ordine???)
    ctx2.putImageData(colorLayerData,0,0);

    // disegna il background
    //context.drawImage(backgroundImage, 0, 0, canvasWidth, canvasHeight);

    // disegna l'outline image sopra ogni cosa. Potremmo spostarlo in un
    // canvas separato in modo da non doverlo ridisegnare ogni volta
    //context.drawImage(outlineImage, 0, 0, canvasWidth, canvasHeight)

}

function clearCanvas() {
    context.clearRect(0,0, context.canvas.width, context.canvas.height);
    // aggiungere il disegna immagine di background
}







/*
function redraw() {  //disegna gli elementi nel canvas
    var locX,
        locY;

    // Make sure required resources are loaded before redrawing

    //if (curLoadResNum < totalLoadResources) {
    //    return;
    //}


    clearCanvas();

    // disegna lo stato corrente del color layer sul canvas (invertire ordine???)
    context.putImageData(colorLayerData,0,0);

    // disegna il background
    context.drawImage(backgroundImage, 0, 0, canvasWidth, canvasHeight);

    // disegna l'outline image sopra ogni cosa. Potremmo spostarlo in un
    // canvas separato in modo da non doverlo ridisegnare ogni volta
    context.drawImage(outlineImage, 0, 0, canvasWidth, canvasHeight)

}

function matchOutlineColor(r, g, b, a){
    return (r === outlineR && g === outlineG && b === outlineB && a == outlineA );
}

function matchStartColor(pixelPos, startR, startG, startB) {
    var r = outlineLayerData.data[pixelPos],
        g = outlineLayerData.data[pixelPos + 1],
        b = outlineLayerData.data[pixelPos + 2],
        a = outlineLayerData.data[pixelPos + 3];

    if (matchOutlineColor(r, g, b, a)){ // se il pixel corrente nell'outline image è nero (ipotesi maschera nera)
        return false;
    }

    r = colorLayerData.data[pixelPos];
    g = colorLayerData.data[pixelPos + 1];
    b = colorLayerData.data[pixelPos + 2];

    if (r === startR && g === startG && b === startB){ // se il pixel corrente appartiene allo stesso gruppo di quello cliccato
        return true;
    }

    return true;
}

function colorPixel(pixelPos, r, g, b, a) {
    colorLayerData.data[pixelPos] = r;
    colorLayerData.data[pixelPos + 1] = g;
    colorLayerData.data[pixelPos + 2] = b;
    colorLayerData.data[pixelPos + 3] = a !== undefined ? a : 255;
}

function floodFill(startX, startY, startR, startG, startB) {

    var newPos,
        x,
        y,
        pixelPos,
        reachLeft,
        reachRight,
        drawingBoundLeft = drawingAreaX,
        drawingBoundTop = drawingAreaY,
        drawingBoundRight = drawingAreaX + drawingAreaWidth - 1,
        drawingBoundBottom = drawingAreaY + drawingAreaHeight - 1,
        pixelStack = [[startX, startY]];

    while (pixelStack.length){

        newPos = pixelStack.pop();
        x = newPos[0];
        y = newPos[1];

        // prende la posizione del pixel corrente
        pixelPos = (y * canvasWidth + x) * 4;

        // va su finche il colore matches e si è dentro il canvas
        while ( y >= drawingBoundTop && matchStartColor(pixelPos, startR, startG, startB)){
            y -= 1;
            pixelPos -= canvasWidth * 4;
        }

        pixelPos += canvasWidth * 4;
        y += 1;
        reachLeft = false;
        reachRight = false;

        // scende finche il colore matches e si è dentro il canvas
        while (y <= drawingBoundBottom && matchStartColor(pixelPos, startR, startG, startB)){
            y += 1;

            colorPixel(pixelPos, curColor.r, curColor.g, curColor.b, curColor.a);

            if (x > drawingBoundLeft){
                if (matchStartColor(pixelPos - 4, startR, startG, startB)){
                    if(!reachLeft){
                        //aggiungi pixel allo stack
                        pixelStack.push([x - 1, y]);
                        reachLeft = true;
                    }
                } else if(reachLeft){
                    reachLeft = false;
                }
            }

            if (x < drawingBoundRight){
                if (matchStartColor(pixelPos + 4, startR, startG, startB)){
                    if(!reachRight){
                        //aggiungi pixel allo stack
                        pixelStack.push([x + 1, y]);
                        reachRight = true;
                    }
                } else if(reachRight){
                    reachRight = false;
                }
            }

            pixelPos += canvasWidth * 4;

        }

    }


}

function paintAt(startX, startY) { // inizia a disegnare con il tool del secchiello dal pixel spacificato da startX e startY

    var pixelPos = (startY * canvasWidth + startX) * 4,
        r = colorLayerData.data[pixelPos],
        g = colorLayerData.data[pixelPos + 1],
        b = colorLayerData.data[pixelPos + 2],
        a = colorLayerData.data[pixelPos + 3];

    if (r === curColor.r && g === curColor.g && b === curColor.b && a === curColor.a){
        return // perche si sta tentando di riempire con lo stesso colore e stessa opacità
    }

    if (matchOutlineColor(r, g, b, a)){
        return // perche si è cliccato sulla maschera
    }

    floodFill(startX, startY, r, g, b);

    redraw();

}

// aggiungere mouse event listeners ai canvas
function createMouseEvents() {
            $('#canvas').mousedown(function (e) {
                // localizzazione mouse down
                var mouseX = e.pageX - this.offsetLeft,
                    mouseY = e.pageY - this.offsetTop;

                if (mouseX < drawingAreaX){ //sx dell'area di disegno
                    // non deve fare nulla
                } else if ((mouseY > drawingAreaY && mouseY < drawingAreaY + drawingAreaHeight) && (mouseX <= drawingAreaX + drawingAreaWidth)){
                    // localizzazione mouse click nell'area di disegno
                    paintAt(mouseX, mouseY);
                }
            });

        }
 */





