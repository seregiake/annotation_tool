window.onload = function () {
    displayList();
}

function displayList(){
    $.getJSON(
        'http://localhost:5000/images', function (data) {
            console.log(data);
            let row=0;
            for( let i = 0; i < data.IMAGES.length; i++){
                console.log(data.IMAGES[i].name);

                let card = createCard();
                let a = document.createElement('a')
                // a.href=data.IMAGES[i].url;
                // fare in modo che quando clicco fne javascript chiama pagina image.html passando id giusto
                a.href="image.html?image="+data.IMAGES[i].id;
                let img = createImg(data.IMAGES[i].url, data.IMAGES[i].name,"card-img-top");
                a.appendChild(img);
                card.appendChild(a);
                let card_body = createCardBody(data.IMAGES[i].id, data.IMAGES[i].name);
                card.appendChild(card_body);
                console.log("row"+row);
                document.getElementById("row"+row).append(card);

                if ((i+1) % 4 === 0 ){
                    row = row + 1
                    let new_row = document.createElement('div');
                    new_row.className="row";
                    new_row.id= "row"+row;
                    new_row.style="margin-top: 3rem;";
                    document.getElementById("card-deck").append(new_row);
                }
            }
        }
    );
}

function createImg(src, alt, className) {
    let img = document.createElement('img');
    img.className=className;
    img.src=src;
    img.alt=alt;
    return img;
}

function createCard(){
    let card = document.createElement('div');
    card.className="card";
    card.style= "width:18rem;";
    return card;
}

function createCardBody(id, name) {
    let card_body = document.createElement('div');
    card_body.className="card-body";
    let card_title = document.createElement('h5');
    card_title.className="card-title";
    card_title.innerHTML= "id:" + id;
    card_body.appendChild(card_title);
    let card_text = document.createElement('p');
    card_text.className="card-text";
    card_text.innerHTML= "immagine:" + name;
    card_body.appendChild(card_text);
    return card_body;
}


