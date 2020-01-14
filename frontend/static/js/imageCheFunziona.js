
window.onload = function () {

    displayImage();
    /*
    Per il momento ho chiamato displayImage la funzione che poi diventerà init().

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


}




/*
window.addEventListener('load', function(){
    function sendData(){
        const XHR = new XMLHttpRequest();
        // Bind the FormData object and the form element
        const FD = new FormData( form );

        // Define what happens on successful data submission
        XHR.addEventListener( "load", function(event) {
          alert( event.target.responseText );
        });

        // Define what happens in case of error
        XHR.addEventListener( "error", function( event ) {
          alert( 'Oops! Something went wrong.' );
        } );

        // Set up our request
        XHR.open( "POST", "https://example.com/cors.php" );

        // The data sent is what the user provided in the form
        XHR.send( FD );
    }

    // Access the form element...
    let form = document.getElementById( "myForm" );

    // ...and take over its submit event.
    form.addEventListener( "submit", function ( event ) {
        event.preventDefault();

        sendData();
    });
});

 */

/*
function createImg(src, alt, className) {
    let img = document.createElement('img');
    img.className=className;
    img.src=src;
    img.alt=alt;
    return img;
}
 */

let id;

function displayImage() {
    let url_string = window.location.href;
    let url = new URL(url_string);
    console.log(url);

    let image_id = url.searchParams.get("image");
    console.log(image_id);
    this.id = image_id;

    $.getJSON(
        'http://localhost:5000/images/'+image_id, function (data) {
            console.log(data);
            console.log(data.image.id);
            console.log(data.image.name);
            console.log(data.image.url);

            /*
            let img = createImg(data.image.url, data.image.name, "image");
            let p = document.createElement("p");
            p.innerHTML= data.image.name;
            document.getElementById('main-container').append(img);
            document.getElementById('main-container').append(p);
            */

            let image = new Image();
            image.src = data.image.url;
            image.onload = () => {
                let canvas = document.getElementById("background-canvas");
                let ctx = canvas.getContext("2d");
                ctx.canvas.width = image.naturalWidth;
                ctx.canvas.height = image.naturalHeight;
                //ctx.drawImage(img,0,0);
                ctx.drawImage(image,0,0);
            }


        }
    )
    .error(function(jqXHR, textStatus, errorThrown) {
        // !!!! Da rivedere

        console.log("errore 404 rilevato");
        //alert("error occurred ");

        console.log("error " + textStatus);
        console.log("error " + errorThrown);
        //console.log("incoming Text " + jqXHR.responseText);

        let body = document.getElementById("myBody");
        body.innerHTML = "";
        let h1 = document.createElement("h1");
        h1.innerHTML = "The page cannot be found";
        body.appendChild(h1);
        let title = document.getElementsByTagName("title");
        title.innerHTML = "404 - Page Not Found";

        // window.location.href = "404Error.html";


    });

    /* controllare se esiste maschera ed è valida.. in quel caso fare il draw nel canvas


     */
}

function createMask() {

    if (confirm("Se confermi la maschera precedente andrà persa.")) {
        console.log("You pressed OK!");

        console.log('crea maschera');
        // genera maschera di segmentazione e la disegna sul canvas

        let kernel = document.getElementById("kernel").value;
        let dist = document.getElementById("dist").value;
        let ratio = document.getElementById("ratio").value;

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

        var newData = {
                "id": this.id,
                "ratio" : ratio,
                "kernel" : kernel,
                "dist": dist
            };

        var dataJson = JSON.stringify(newData);
        console.log(dataJson);

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

    } else {
      console.log("You pressed Cancel!");
    }


}

