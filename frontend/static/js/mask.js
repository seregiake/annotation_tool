let outlineImage,
    colorImage,
    drawingAreaX,
    drawingAreaY,
    ann_color_box,
    curColor = [0, 0, 0, 128],
    mask_color_box,
    outlineColor = [0, 0, 0, 128],
    colorLayerData,
    outlineLayerData,
    mask = [],
    mask_id, kernel, dist, ratio,
    outline_matrix = [],
    cluster_id,
    clusterList = [],
    pointList = [],
    draggedPointList = [],
    draggedMaskPointList = [],
    mouseDrag = false;

function initMask() {

    console.log("imageid in mask.js : " + image_id);

    // canvasWidth = w;
    // canvasHeight = h;
    // console.log("canvasWidth: " + canvasWidth + ", canvasHeight: " + canvasHeight);

    ann_color_box = document.getElementById("ann_color");
    mask_color_box = document.getElementById("mask_color");


    console.log('http://localhost:5000/masks/' + user_id + '/' + image_id + '/' + superclass_id);
    // getJSON request to take the annotations from the server and draw it on the canvas
    $.getJSON(
        'http://localhost:5000/masks/' + user_id + '/' + image_id + '/' + superclass_id, function (data) {
            console.log(data);
            // console.log(data['valid']);

            if (data != 'Mask doesn\'t exist'){
                // console.log(data);

                kernel = data['kernel'];
                dist = data['dist'];
                ratio = data['ratio'];
                mask_id = data['id'];
                mask = JSON.parse(data['mask']);

                // takes mask_boundaries and draws them in the outline layer (3° canvas)
                outline_matrix = JSON.parse(data['boundaries']);

                /*
                kernel = data.mask.kernel;
                dist = data.mask.dist;
                ratio = data.mask.ratio;
                mask = JSON.parse(data.mask.mask);
                outline_matrix = JSON.parse(data.mask.boundaries);
                */

                redrawMask();

                // set colorLayerData and colorImage
                let color_canvas = document.getElementById('middle-canvas');
                color_canvas.width = canvasWidth;
                color_canvas.height = canvasHeight;
                let ctx2 = color_canvas.getContext("2d");
                colorLayerData = ctx2.createImageData(canvasWidth, canvasHeight);
                colorImage = colorLayerData.data;

                drawAnnotation();

                curLoadResNum ++;

                // addEventListener to top_canvas
                let top_canvas = document.getElementById('top-canvas');
                top_canvas.width = canvasWidth;
                top_canvas.height = canvasHeight;
                top_canvas.addEventListener('click', clickMouse);
                top_canvas.addEventListener('dragstart', dragStart);
                top_canvas.addEventListener('dragover', dragOver);
                top_canvas.addEventListener('dragend', dragEnd);


            } else {
                alert('There is no mask yet, enter settings and press Create Mask to create one')
            }

        }
    ).error(function(jqXHR, textStatus, errorThrown) {
        console.log("errore 404 rilevato");
        console.log("error " + textStatus);
        console.log("error " + errorThrown);

    });
}


function createMask() {

    let message = "If you confirm the previous mask it will be lost. Are you sure?";
    let dest_url = 'http://localhost:5000/masks/' + user_id + '/' + image_id + '/' + superclass_id,
        type = "PUT";

    // if the mask still does not exist --> POST request
    if (!checkResourcesLoaded()){
        message = "Press OK to create a new mask.";
        dest_url = 'http://localhost:5000/masks/' + user_id;
        type = "POST";
    }

    if (confirm(message)) {

        // takes kernel, dist, ratio value and set them as newData attributes
        let k = document.getElementById("kernel").value;
        let d = document.getElementById("dist").value;
        let r = document.getElementById("ratio").value;

        let newData = {
            "id": image_id,
            "super": superclass_id,
            "ratio" : r,
            "kernel" : k,
            "dist": d
        };

        // turns data format into JSON
        let dataJson = JSON.stringify(newData);
        console.log(dataJson);

        // post data on server
        $.ajax({
            url: dest_url ,
            type: type,
            // The key needs to match your method's input parameter (case-sensitive).
            data: dataJson,
            dataType: "json",
            contentType: "application/json"

        }).done(
            function(data){
                console.log(data);
                console.log(data['kernel']);

                kernel = data['kernel'];
                dist = data['dist'];
                ratio = data['ratio'];
                mask_id = data['id'];

                mask = JSON.parse(data['mask']);

                outline_matrix = JSON.parse(data['boundaries']);

                redrawMask();

                if (!checkResourcesLoaded()){
                    curLoadResNum ++;
                    // set colorLayerData and colorImage
                    let color_canvas = document.getElementById('middle-canvas');
                    color_canvas.width = canvasWidth;
                    color_canvas.height = canvasHeight;
                    let ctx2 = color_canvas.getContext("2d");
                    colorLayerData = ctx2.createImageData(canvasWidth, canvasHeight);
                    colorImage = colorLayerData.data;
                } else {
                    clearColorLayer();
                }

                drawAnnotation();

                // addEventListener to top_canvas
                let top_canvas = document.getElementById('top-canvas');
                top_canvas.width = canvasWidth;
                top_canvas.height = canvasHeight;
                top_canvas.addEventListener('click', clickMouse);
                top_canvas.addEventListener('dragstart', dragStart);
                top_canvas.addEventListener('dragover', dragOver);
                top_canvas.addEventListener('dragend', dragEnd);
            }
        );



    } else {
      console.log("You pressed Cancel!");
    }

}

function hexToRGB(hex) {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function getMousePos(e){
    let color_canvas = document.getElementById('middle-canvas');

    // get color_canvas position
    drawingAreaX = color_canvas.getBoundingClientRect().left;
    drawingAreaY = color_canvas.getBoundingClientRect().top;

    // mouse click coordinates on the canvas rounded to manage float case
    let mouseX = Math.round(e.pageX - document.body.scrollLeft - document.documentElement.scrollLeft - drawingAreaX),
        mouseY = Math.round(e.pageY - document.body.scrollTop - document.documentElement.scrollTop - drawingAreaY);

    return [mouseX, mouseY];
}

function clickMouse(e) {

    [x, y] = getMousePos(e);

    console.log("x: " + x + ", y: " + y);

    paintAt(x, y);

}

function dragStart(e) {

    mouseDrag = true;

    [x, y] = getMousePos(e);

    // console.log("START x: " + x + ", y: " + y);
    paintAt(x, y);
    draggedPointList.push([x, y]);

}

function dragOver(e) {

    let [x, y] = getMousePos(e);
    [prev_x, prev_y] = draggedPointList[draggedPointList.length-1];

    //check if new pixel is different from precedent
    if(x != prev_x || y != prev_y){

        let prev_cluster, cluster;
        prev_cluster = mask[prev_y][prev_x];
        cluster = mask[y][x];

        let diff_cluster = true;
        for (let i = 0; i < draggedPointList.length-1; i++){
            let [sel_x, sel_y] = draggedPointList[i];
            let sel_cluster = mask[sel_y][sel_x];
            console.log(sel_x + sel_y + sel_cluster);
            if (sel_cluster == cluster){
                diff_cluster = false;
                console.log('same cluster');
            }
        }

        // add new pixel only if it has different cluster_id
        if (cluster != prev_cluster && diff_cluster){

            // check if new pixel in on the mask
            if (!matchOutlineBorder((y * canvasWidth + x) * 4)){
                // console.log("DRAG x: " + x + ", y: " + y);
                draggedPointList.push([x, y]);
                paintAt(x, y);
                return;
            }

            // check if the pixel on the mask is different from precedent pixel clicked
            if(draggedMaskPointList.length==0){
                // console.log("DRAG MASK x: " + x + ", y: " + y + ", cluster: " + cluster);
                draggedMaskPointList.push([x, y]);
            } else {
                [prev_x, prev_y] = draggedMaskPointList[draggedMaskPointList.length-1];
                if (x != prev_x || y != prev_y){
                    // console.log("DRAG MASK x: " + x + ", y: " + y + ", cluster: " + cluster);
                    draggedMaskPointList.push([x, y]);
                }
            }
        }
    }

}

function dragEnd(e) {

    dragOver(e);

    console.log("draggedPointList: " + draggedPointList);
    console.log("draggedMaskPointList: " + draggedMaskPointList);

    while(draggedPointList.length != 0){
        draggedPointList.pop();
        // console.log("draggedPointList.pop(): " + [x, y]);
        //paintAt(x, y);
    }

    while(draggedMaskPointList.length != 0){
        draggedMaskPointList.pop();
        // console.log("draggedMaskPointList.pop(): " + [x, y]);
        //paintAt(x, y);
    }

    mouseDrag = false;


}

function takeSelectedColor(color_box){
    // takes hex mask_color, convert it to rgb and save it as outlineR, outlineG, outlineB
    let rgb_color;

    if (color_box == "ann_color_box"){
        rgb_color = hexToRGB(ann_color_box.value);
        ann_color_box.disabled = true;
        curColor[0] = rgb_color.r;
        curColor[1] = rgb_color.g;
        curColor[2] = rgb_color.b;
    } else {
        rgb_color = hexToRGB(mask_color_box.value);
        outlineColor[0] = rgb_color.r;
        outlineColor[1] = rgb_color.g;
        outlineColor[2] = rgb_color.b;

    }

}

function paintAt(startX, startY) { // inizia a disegnare con il tool del secchiello dal pixel spacificato da startX e startY

    takeSelectedColor("ann_color_box");

    // takes opacity
    // let ann_opacity = document.getElementById("ann_opacity");
    // curColor[3] = Math.round(((ann_opacity.value * 255)/100));

    // takes pixel RGBA color
    let pixelPos = (startY * canvasWidth + startX) * 4,
        r = colorImage[pixelPos],
        g = colorImage[pixelPos + 1],
        b = colorImage[pixelPos + 2],
        a = colorImage[pixelPos + 3];

    // console.log("pixelPos: " + pixelPos);
    //console.log("r: " + r + ", g: " + g + ", b: " + b + ", a: " + a);
    //console.log("curColor[0] : " + curColor[0]  + ", curColor[1] : " + curColor[1] + ", curColor[2] : " + curColor[2]  + ", curColor[3] : " + curColor[3] );


    // return if you try to recolor the area with the same color and the same opacity
    if (r == curColor[0] && g == curColor[1] && b == curColor[2] && a == curColor[3]){

        floodFill(startX, startY, r, g, b, a, [0, 0, 0, 0]);
        redraw();

        // delete the element from clusterList and pointList
        clusterList.splice( clusterList.indexOf(mask[startY][startX]), 1 );
        pointList.splice( clusterList.indexOf(mask[startY][startX]), 1);

        return
    }

    /*
    // return if you click on the mask border
    if (matchOutlineBorder(pixelPos)){
        console.log(" click on the mask border ");
        return
    }
     */

    // call floodFill method and pass to it initial (x,y) and initial RGBA of the pixel clicked
    floodFill(startX, startY, r, g, b, a, curColor);
    redraw();

    clusterList.push(mask[startY][startX]);
    pointList.push([startX, startY]);
}

function matchOutlineBorder(pixelPos){
    let r = outlineImage[pixelPos],
        g = outlineImage[pixelPos + 1],
        b = outlineImage[pixelPos + 2],
        a = outlineImage[pixelPos + 3];

    //console.log("OUTLINE r: " + r + ", g: " + g + ", b: " + b + ", a: " + a);
    //console.log("OUTLINE-COLOR r: " + outlineColor[0] + ", g: " + outlineColor[1] + ", b: " + outlineColor[2] + ", a: " + outlineColor[3]);

    return (r === outlineColor[0] && g === outlineColor[1] && b === outlineColor[2] && a == outlineColor[3] );
}

function floodFill(startX, startY, startR, startG, startB, startA, newColor ) {

    let newPos,
        x,
        y,
        pixelPos,
        reachLeft,
        reachRight,
        canvasBoundLeft = 0,
        canvasBoundTop = 0,
        canvasBoundRight = canvasBoundLeft + canvasWidth - 1,
        canvasBoundBottom = canvasBoundTop + canvasHeight - 1,
        pixelStack = [[startX, startY]];

    cluster_id = mask[startY][startX];
    // console.log("cluster_id: " + cluster_id);

    while (pixelStack.length){

        newPos = pixelStack.pop();
        x = newPos[0];
        y = newPos[1];

        // takes current pixel position
        pixelPos = (y * canvasWidth + x) * 4;

        // go up inside the canvas until initialColor matches
        while ( y >= canvasBoundTop && matchInitialColor(pixelPos, x, y, startR, startG, startB, startA, newColor)){
            y -= 1;
            pixelPos -= canvasWidth * 4;
        }

        pixelPos += canvasWidth * 4;
        y += 1;
        reachLeft = false;
        reachRight = false;

        // go down inside the canvas until initialColor matches
        while (y <= canvasBoundBottom && matchInitialColor(pixelPos, x, y, startR, startG, startB, startA, newColor)){
            //y += 1;

            colorPixel(pixelPos, newColor[0], newColor[1], newColor[2], newColor[3]);

            if (x > canvasBoundLeft){ //check left side pixel
                if (matchInitialColor(pixelPos - 4, x - 1, y, startR, startG, startB, startA, newColor)){
                    if(!reachLeft){
                        //aggiungi pixel allo stack
                        pixelStack.push([x - 1, y]);
                        reachLeft = true;
                    }
                } else if(reachLeft){
                    reachLeft = false;
                }
            }

            if (x < canvasBoundRight){ //check right side pixel
                if (matchInitialColor(pixelPos + 4, x + 1, y, startR, startG, startB, startA, newColor)){
                    if(!reachRight){
                        //aggiungi pixel allo stack
                        pixelStack.push([x + 1, y]);
                        reachRight = true;
                    }
                } else if(reachRight){
                    reachRight = false;
                }
            }

            y += 1;
            pixelPos += canvasWidth * 4;

        }



    }


}

function matchInitialColor(pixelPos, x, y, startR, startG, startB, startA, newColor) {
    let different_cluster = false;

    if(mask[y][x] != cluster_id){
       //console.log(mask[y][x]);
       different_cluster = true;
    }

    // check if current pixel is in outline image and has different cluster_id
    if (matchOutlineBorder(pixelPos) && different_cluster){
        return false;
    }


    let r = colorImage[pixelPos],
        g = colorImage[pixelPos + 1],
        b = colorImage[pixelPos + 2],
        a = colorImage[pixelPos + 3];

    // If the current pixel matches the clicked color
    if (r == startR && g == startG && b == startB && a == startA){
        return true;
    }

    // If current pixel color is already colored with new color and opacity
    if (r == newColor[0] && g == newColor[1] && b == newColor[2] && a == newColor[3] ) {
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

    // Make sure required resources are loaded before redrawing

    //if (curLoadResNum < totalLoadResources) {
    //    return;
    //}


    //clearCanvas();

    let ctx2 = document.getElementById('middle-canvas').getContext("2d");

    // disegna lo stato corrente del color layer sul canvas (invertire ordine???)
    ctx2.putImageData(colorLayerData,0,0);

    // disegna il background
    //context.drawImage(backgroundImage, 0, 0, canvasWidth, canvasHeight);

    // disegna l'outline image sopra ogni cosa. Potremmo spostarlo in un
    // canvas separato in modo da non doverlo ridisegnare ogni volta
    //context.drawImage(outlineImage, 0, 0, canvasWidth, canvasHeight)

}

function clearColorLayer() {
    let len = colorLayerData.data.length;
    for (let i = 0; i < len; i += 4 ){
        colorPixel(i, 0, 0, 0, 0);
    }

    redraw();
}



function changeOpacity(id, text_id){
    let opacity = document.getElementById(id);
    let text_opacity = document.getElementById(text_id);

    text_opacity.value = opacity.value + "%";

    let opacity_value = Math.round(((opacity.value * 255)/100));

    // TODO controlla se outlineLayer e colorLayer esistono
    //  effettuare la modifica dell'opacità da qui!!!!

    if (id == "opacity"){
        // modify outlineLayer
        console.log("modify outlineLayer opacity: " + opacity_value );
        outlineColor[3] = opacity_value;
        redrawMask();


    } else {
        // modify all colored areas in colorLayer
        console.log("modify colorLayer opacity: " + opacity_value );
        curColor[3] = opacity_value;
    }

    // la modifica sulla barra dell'opacità deve modificare l'alfa nei
    // layer corrispondenti o colorLayer outlineLayer
}


function redrawMask() {

        takeSelectedColor(mask_color_box);

        // set kernel, dist, ratio as the settings of the last mask created
        let k = document.getElementById("kernel"),
            d = document.getElementById("dist"),
            r = document.getElementById("ratio");

        k.value = kernel;
        d.value = dist;
        r.value = ratio;

        // takes mask_boundaries and draws them in the outline layer (3° canvas)
        let outline_canvas = document.getElementById('outline-canvas');
        let ctx3 = outline_canvas.getContext("2d");

        outline_canvas.width = canvasWidth;
        outline_canvas.height = canvasHeight;
        // console.log("canvasWidth: " + canvasWidth + ", canvasHeight: " + canvasHeight);

        outlineLayerData = ctx3.createImageData(canvasWidth, canvasHeight);
        outlineImage = outlineLayerData.data;

        // scroll the matrix with boundaries to create the outline image
        let len = outlineLayerData.data.length;
        // console.log(len);
        let col = 0, row = 0;
        let pixel = [];
        for (let i = 0; i < len && row < canvasHeight; i += 4 ){
            pixel = outline_matrix[row][col];
            // console.log("pixel: " + pixel);
            if (pixel[0] == "0"){
                outlineImage[i] = outlineColor[0];       // r
                outlineImage[i + 1] = outlineColor[1];   // g
                outlineImage[i + 2] = outlineColor[2];   // b
                outlineImage[i + 3] = outlineColor[3];   // a
            }
            if (col == canvasWidth - 1){
                row ++;
                col = 0;
            } else {
                col++;
            }

        }

        // draw the outline layer in the 3° canvas
        ctx3.putImageData(outlineLayerData, 0, 0 );


}


