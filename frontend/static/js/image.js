let image_id,
    cat_id,
    contex,
    canvasWidth = 0,
    canvasHeight = 0,
    backgroundImage = new Image(),
    totalLoadResources = 2,
    curLoadResNum = 0;

let user_id = 0;

window.onload = function () {

    //prendere user_id dall'autenticazione

    init();

    initMask();

    // initAnnotation();

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
    let id = url.searchParams.get("image");
    image_id = id;

    // get background_canvas and its context
    let canvas = document.getElementById("background_canvas");
    contex = canvas.getContext("2d");

    // getJSON request to take the image from the server and draw it on the canvas
    $.getJSON(
        'http://localhost:5000/images/'+ image_id, function (data) {
            console.log(data);
            console.log(data["url"]);
            cat_id = data["category"];

            backgroundImage.src = data["url"];
            backgroundImage.onload = () => {

                canvasWidth = backgroundImage.width;
                canvasHeight = backgroundImage.height;

                canvas.width = backgroundImage.width;
                canvas.height = backgroundImage.height;

                contex.drawImage(backgroundImage, 0, 0);
            }
            curLoadResNum ++;
        }
    ).error(function(jqXHR, textStatus, errorThrown) {

        console.log("errore 404 rilevato");
        console.log("error " + textStatus);
        console.log("error " + errorThrown);

    });

    displayCategories();

}

function displayCategories() {
    $.getJSON(
        'http://localhost:5000/categories', function (data) {
            console.log(data);
            let cat = data["category"]
            console.log(data["category"]);

            let select = document.getElementById('category');
            let option = document.createElement("option");
            option.id = "0";
            option.value = "0";
            option.label =  "";
            select.append(option);

            let index = 0;
            for( let i = 0; i < Object.keys(cat).length; i++){
                let cat_key = Object.keys(cat)[i];
                if ( cat[cat_key]["super_id"] == cat_id){
                    index = index + 1;
                    option = document.createElement("option");
                    option.id = index;
                    option.value = cat[cat_key]["id"];
                    option.label =  cat[cat_key]["name"];
                    select.append(option);

                }

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






