let ann_count = 0,
    ann_button = document.getElementById('ann_button'),
    edit = false,
    ann_id,
    form_name = document.getElementById('check_form');

/*
function initAnnotation(){
    console.log(image_id);


    // getJSON request to take the annotations from the server and draw it on the canvas
    $.getJSON(
        'http://localhost:5000/annotations', function (data) {
            console.log("ANNOTATIONS: ");
            console.log(data);
            console.log(data.ANNOTATIONS);


            for( let i = 0; i < data.ANNOTATIONS.length; i++){

                if (data.ANNOTATIONS[i].image_id == image_id ){
                    console.log(data.ANNOTATIONS[i].id);
                    console.log(data.ANNOTATIONS[i].color);

                    let color = JSON.parse(data.ANNOTATIONS[i].color);


                    createAnnotation(data.ANNOTATIONS[i].id, color, data.ANNOTATIONS[i].category_id);

                }


            }



        }
    ).error(function(jqXHR, textStatus, errorThrown) {
        // !!!! Da rivedere

        console.log("errore 404 rilevato");

        console.log("error " + textStatus);
        console.log("error " + errorThrown);

    });


}
*/

function  drawAnnotation() {
    $.getJSON(
        'http://localhost:5000/annotations/' + mask_id, function (data) {
            console.log(data);
            form_name.innerHTML = "";

            for( let i = 0; i < Object.keys(data).length ; i++){

                let color = JSON.parse(data[i]['color']);

                clusterList = JSON.parse(data[i]['cluster']);
                pointList = JSON.parse(data[i]['point']);

                while(clusterList.length != 0){
                    let [x, y] = pointList.pop();
                    clusterList.pop();

                    floodFill(x, y, 0, 0, 0, 0, [color[0], color[1], color[2], 128]);
                    redraw();
                }

                createAnnotation(data[i]['id'], color, data[i]['sub_id']);


            }



        }
    ).error(function(jqXHR, textStatus, errorThrown) {

        console.log("errore 404 rilevato");
        console.log("error " + textStatus);
        console.log("error " + errorThrown);

    });
}

function createAnnotation(id, rgb_color, category_id){

    let checkbox = document.createElement('input');
    checkbox.setAttribute("type", "checkbox");
    checkbox.name = "ann_check";
    checkbox.id = id;

    let color = document.createElement('input');
    color.setAttribute("type", "color");
    color.disabled = true;
    color.value = rgbToHex(rgb_color[0], rgb_color[1], rgb_color[2]);

    let select = document.getElementById('ann_class');
    // let category_id = select.selectedIndex;
    // let category_value = select.value;

    let ann_text;
    for( let i = 1; i < select.length ; i++){
        let choose = document.getElementById(i);
        if (choose.value == category_id){
            ann_text = choose.label;
        }
    }
    let label = document.createElement('label');
    label.innerText = ann_text;


    let br = document.createElement('br');

    form_name.append(checkbox);
    form_name.append(color);
    form_name.append(label);
    form_name.append(br);

    ann_button.hidden = false;
    ann_count ++;
}


function saveAnnotation() {
    if (checkResourcesLoaded()){

        let select = document.getElementById('ann_class');
        let category_id = select.selectedIndex;
        let category_value = select.value;

        console.log(category_id);

        if (category_id == 0){
            alert("Choose a category before save annotation");
            return;
        }


        let col = 0, row = 0;
        let colored_pixels = 0, white_pixels = 0;
        let cons_color = 0, cons_white = 0;
        let same_cluster = false;
        let count = [];

        while (col < canvasWidth && row < canvasHeight) {
            //console.log(mask[row][col]);
            let mask_cluster = mask[row][col];
            let found = false;
            for (let i=0; i < clusterList.length; i ++){
                if (mask_cluster == clusterList[i]){
                    found = true;
                    if (same_cluster == false){
                        count.push(cons_white);
                        console.log(cons_white);
                        cons_white = 0;
                        colored_pixels++;
                        same_cluster = true;
                        cons_color ++;
                    } else {
                        colored_pixels++;
                        same_cluster = true;
                        cons_color ++;
                    }
                }
            }

            if (!found){
                if (same_cluster == true){
                    count.push(cons_color);
                    console.log(cons_color);
                    cons_color = 0;
                    white_pixels++;
                    same_cluster = false;
                    cons_white ++;
                } else {
                    white_pixels++;
                    same_cluster = false;
                    cons_white ++;
                }
            }

            if (col == canvasWidth - 1) {
                if(row != canvasHeight - 1){
                    row++;
                    col = 0;
                    console.log('fine riga');

                }
                else {
                    col ++;
                }

            } else {
                col++;
            }
        }

        console.log("saveAnnotation");

        let newData = {
            "category_id" : category_value,
            "multiple" : 0,
            "count": JSON.stringify(count),
            "size": JSON.stringify([white_pixels, colored_pixels]),
            "cluster_id": JSON.stringify(clusterList),
            "point": JSON.stringify(pointList),
            "color": JSON.stringify([curColor[0], curColor[1], curColor[2]])
        };

        // turns data format into JSON
        let dataJson = JSON.stringify(newData);
        console.log(dataJson);

        let dest_url, type;

        if(edit){ //PUT
            dest_url = "http://localhost:5000/annotations/" + mask_id + "/" + ann_id;
            type = "PUT";

        } else { //POST
            dest_url = "http://localhost:5000/annotations/" + mask_id ;
            type = "POST";
        }

        // PUT or POST data on server
        $.ajax({
            url: dest_url,
            type: type,
            // The key needs to match your method's input parameter (case-sensitive).
            data: dataJson,
            dataType: "json",
            contentType: "application/json"

        }).done(
            function(data){
                console.log(data);
                ann_color_box.disabled = false;
                while(clusterList.length != 0){
                    pointList.pop();
                    clusterList.pop();
                }
                if (edit){
                    edit = false;
                    form_name.innerHTML = "";
                    drawAnnotation();
                    return;
                } else{
                    createAnnotation(data["id"], JSON.parse(data["color"]), data["sub_id"]);
                }

            }
        );


        clearAnnotation();
        // leggi colore, zone selezionate, categoria, salva
        // annotazione e mostrala nel pannello affianco


    } else {
        alert("caricamento risorse non completo");
    }

}

function clearAnnotation(){
    let select = document.getElementById('ann_class');
    select.selectedIndex = 0;

    ann_button.value = rgbToHex(255, 0, 0);
}

function cancelAnnotation() {
    console.log("cancelAnnotation");
    if (checkResourcesLoaded()){
        while(clusterList.length != 0){
            let [x, y] = pointList.pop();
            clusterList.pop();
            floodFill(x, y, curColor[0], curColor[1], curColor[2], curColor[3], [0, 0, 0, 0]);
            redraw();
        }
        // torna alle impostazioni di default di annotation

        ann_count --;
        ann_button.hidden = true;

        if (ann_button.hidden && ann_count>0){
            ann_button.hidden = false;
        }

        ann_color_box.disabled = false;

    } else {
        console.log("caricamento risorse non completo");
    }

}

function editAnnotation() {

    if (checkedElement()){
        $.getJSON(
            'http://localhost:5000/annotations/'+ mask_id + '/' + ann_id, function (data) {
                console.log("editAnnotation");
                edit = true;
                console.log(data);

                let color = JSON.parse(data['color']);
                // console.log(color[0] + ","+ color[1] + ","+ color[2]);
                ann_color_box.disabled = true;
                curColor = [color[0], color[1], color[2], 128];
                ann_color_box.value = rgbToHex(color[0], color[1], color[2]);

                let select = document.getElementById('ann_class');
                for( let i = 1; i < select.length ; i++){
                    let choose = document.getElementById(i.toString());
                    if (choose.value == data['sub_id']){
                        select.selectedIndex = i;
                    }
                }

                clusterList = JSON.parse(data['cluster']);
                pointList = JSON.parse(data['point']);

            }
        ).error(function(jqXHR, textStatus, errorThrown) {

            console.log("errore 404 rilevato");
            console.log("error " + textStatus);
            console.log("error " + errorThrown);

        });

    }

    // carica le impostazioni dell'annotazione nella zona apposita e rende true un'indicatore
    // che serve alla funzione saveAnnotation per capire se fare POST o PUT (edit)


}

function displayAnnotation(){

}

function delAnnotation() {
    // controlla che sia stato selezionato uno e un solo elemento
    // alert che chiede se si è sicuri di voler eliminare
    // elimina l'annotazione dalla maschera, dalla lista delle annotazioni e dal server

    if (checkedElement()) {
        $.ajax({
            url: 'http://localhost:5000/annotations/' + mask_id + '/' + ann_id,
            type: "DELETE",
            contentType: "application/json"

        }).done(
            function(data){
                console.log("delAnnotation");
                console.log(data);
                clearColorLayer();
                alert("Annotation successfully deleted.");
                form_name.innerHTML = "";
                drawAnnotation();


        });
    }

}

function checkedElement(){
    let check_num = $("input[type='checkbox']:checked").length;

    // check that only one annotation is selected
    if(check_num > 1 || check_num == 0){
        alert("Check the annotation you want to edit");
        return false;
    }

    // console.log("form_name.elements[0].name: " + form_name.elements[0].checked);
    // console.log("form_name.elements.length: " + form_name.elements.length);

    for (let i = 0; i <form_name.elements.length; i++) {
        if (form_name.elements[i].checked) {
            // console.log("ann_id: " + form_name.elements[i].id);
            // console.log("ann_id: " + form_name.elements[i].value);
            ann_id = form_name.elements[i].id;
            console.log("ann_id: " + ann_id);

        }
    }


    return true;
}


function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

