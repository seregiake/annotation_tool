window.onload = function () {
    displaySuperCategories();
    displayTask();
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
}

function displaySuperCategories() {

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
                 "frontend/images_list.html?t=" + select.value;


}

function logout(){
    let message = "Are you sure you want to logout?";
    if (confirm(message)) {
        localStorage.removeItem('user_id');
        localStorage.removeItem('token');
        window.location.href = 'http://localhost:63342/annotation_tool/frontend/signin.html';
    }

}