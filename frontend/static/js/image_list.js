window.onload = function () {
    displayList();

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
}

let superclass_id,
    dataset_name,
    user_id,
    task;

function displayList(){
    let url_string = window.location.href;
    let url = new URL(url_string);
    user_id = localStorage.getItem('user_id');
    console.log('localStorage: ' + localStorage.getItem('user_id'));
    task = url.searchParams.get("t");


    $.getJSON(
        'http://localhost:5000/tasks/' + task, function (data) {
            console.log(data);

            superclass_id = data['super_id'];
            dataset_name = data['folder_name'];

            getImages();


        }
    );


}

function getImages(){
    $.getJSON(
        'http://localhost:5000/images', function (data) {
            console.log(data);
            // console.log(Object.keys(data).length);


            let len = 0;
            for( let i = 0; i < Object.keys(data).length; i++){
                //console.log(data[i]);
                if(data[i]["dataset"] == dataset_name){
                    len = len + 1;
                }
            }
            let num = 2;
            if (len % 3 == 0) {
                num = 3;
            } else if(len % 5 == 0){
                num = 5;
            }
            console.log(len);
            let row=0;
            let col=0;
            for( let i = 0; i < Object.keys(data).length; i++){
                //console.log(data[i]);
                if(data[i]["dataset"] == dataset_name){
                    let card = createCard();
                    let a = document.createElement('a');
                    // a.href=data.IMAGES[i].url;
                    // fare in modo che quando clicco fne javascript chiama pagina image.html passando id giusto
                    a.href="image.html?i=" + data[i].id +'&s=' + superclass_id ;
                    let img = createImg(data[i].url, data[i].name,"card-img-top");
                    a.appendChild(img);
                    card.appendChild(a);
                    let card_body = createCardBody(data[i].id, data[i].name);
                    card.appendChild(card_body);
                    // console.log("row"+row);
                    document.getElementById("row" + row).append(card);

                    if ((col + 1) % num == 0 ){
                        row = row + 1;
                        let new_row = document.createElement('div');
                        new_row.className="row";
                        new_row.id = "row" + row;
                        new_row.style = "margin-top: 3rem;";
                        document.getElementById("card-deck").append(new_row);
                    }
                    col ++;
                }
            }


        }
    );
}

function createImg(src, alt, className) {
    let img = document.createElement('img');
    img.className=className;
    img.src = src;
    img.alt = alt;
    img.width=200;
    img.height=200;
    return img;
}

function createCard(){
    let card = document.createElement('div');
    card.className = "card";
    card.maxwidth='9rem';
    return card;
}

function createCardBody(id, name) {
    let card_body = document.createElement('div');
    card_body.className = "card-body";
    let card_title = document.createElement('h5');
    card_title.className ="card-title";
    card_title.innerHTML = "id:" + id;
    card_body.appendChild(card_title);
    let card_text = document.createElement('p');
    card_text.className = "card-text";
    card_text.innerHTML = "immagine:" + name;
    card_body.appendChild(card_text);
    return card_body;
}

function logout(){
    let message = "Are you sure you want to logout?";
    if (confirm(message)) {
        localStorage.removeItem('user_id');
        localStorage.removeItem('token');
        window.location.href = 'http://localhost:63342/annotation_tool/frontend/signin.html';
    }

}