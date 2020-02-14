let image_id,
    ctx,
    canvasWidth = 0,
    canvasHeight = 0,
    backgroundImage = new Image(),
    totalLoadResources = 2,
    curLoadResNum = 0,
    superclass_id;

let user_id;

window.onload = function () {
    init();

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

};




function init(){
    // extracts the image id from the url
    // let url_string = window.location.href;
    // let url = new URL(url_string);
    let url_string = window.location.href;
    let url = new URL(url_string);
    user_id = localStorage.getItem('user_id');
    console.log('localStorage: ' + localStorage.getItem('user_id'));

    $.getJSON(
        'http://localhost:5000/users/' + user_id , function (data) {
            console.log(data);

            if(data['admin']){
                let div = document.getElementById('dropdown-menu');
                let a2 = document.createElement('a');
                a2.href="http://localhost:63342/annotation_tool/frontend/edit_task.html";
                a2.style="color: midnightblue";
                a2.id="create";
                a2.setAttribute('class', 'dropdown-item');
                a2.innerText = 'Create or Edit Tasks';
                div.append(a2);
            }

        }
    );

    let a = document.getElementById('choose');
    a.href="http://localhost:63342/annotation_tool/frontend/task.html";

    image_id = url.searchParams.get("i");
    superclass_id = url.searchParams.get("s");

    console.log(superclass_id);

    // get background_canvas and its context
    let canvas = document.getElementById("background_canvas");
    ctx = canvas.getContext("2d");

    // getJSON request to take the image from the server and draw it on the canvas
    $.getJSON(
        'http://localhost:5000/images/'+ image_id, function (data) {
            console.log(data);
            console.log(data["url"]);

            backgroundImage.src = data["url"];
            backgroundImage.onload = () => {

                canvasWidth = backgroundImage.width;
                canvasHeight = backgroundImage.height;

                ctx.canvas.width = backgroundImage.width;
                ctx.canvas.height = backgroundImage.height;

                ctx.drawImage(backgroundImage, 0, 0);
            }
            curLoadResNum ++;

            displayCategories();
            initMask();
        }
    ).error(function(jqXHR, textStatus, errorThrown) {

        console.log("errore 404 rilevato");
        console.log("error " + textStatus);
        console.log("error " + errorThrown);

    });



}

function displayCategories() {
    $.getJSON(
        'http://localhost:5000/categories/' + superclass_id, function (data) {
            console.log(data);

            let select = document.getElementById('ann_class');
            let option = document.createElement("option");
            option.id = "0";
            option.value = "0";
            option.label =  "";
            select.append(option);

            let index = 0;
            for( let i = 0; i < Object.keys(data).length; i++){
                index = index + 1;
                option = document.createElement("option");
                option.id = index;
                option.value = data[i]["id"];
                option.label =  data[i]["name"];
                select.append(option);
            }

        }
    );

}

function checkResourcesLoaded(){
    if (curLoadResNum < totalLoadResources){
        return false;
    }
    return true;
}

function logout(){
    let message = "Are you sure you want to logout?";
    if (confirm(message)) {
        localStorage.removeItem('user_id');
        localStorage.removeItem('token');
        window.location.href = 'http://localhost:63342/annotation_tool/frontend/signin.html';
    }

}

