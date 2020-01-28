window.onload = function () {
    displaySuperCategories();
    displayTask();
}

function displaySuperCategories() {
    let url_string = window.location.href;
    let url = new URL(url_string);
    user_id = url.searchParams.get("u");
    console.log(user_id);

    /*
    $.getJSON(
        'http://localhost:5000/categories', function (data) {
            console.log(data);

            let select = document.getElementById('superclass');

            for( let i = 0; i < Object.keys(data).length; i++){
                let option = document.createElement("option");
                console.log(data[i]["id"]);
                option.id = data[i]["id"];
                option.value = data[i]["id"];
                option.label =  data[i]["name"];

                select.append(option);

            }

        }
    );

     */

}

function displayTask() {

    $.getJSON(
        'http://localhost:5000/tasks', function (data) {
            console.log(data);
            let select = document.getElementById('superclass');

            for( let i = 0; i < Object.keys(data).length; i++){
                let option = document.createElement("option");
                console.log(data[i]["id"]);
                option.id = data[i]["id"];
                option.value = data[i]["id"];
                option.label =  'Opzione ' + (i + 1);

                select.append(option);

            }


        }
    );

}

function sendCategory() {

    let select = document.getElementById('superclass');
    let choose = document.getElementById(select.value);
    console.log(choose.label);
    console.log(select.value);

    window.location.href = "http://localhost:63342/annotation_tool/" +
                 "frontend/images_list.html?u=" + user_id + '&t=' + select.value;


}