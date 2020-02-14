window.onload = function () {
    user_id = localStorage.getItem('user_id');
    console.log('localStorage: ' + localStorage.getItem('user_id'));


    $.getJSON(
        'http://localhost:5000/users/' + user_id , function (data) {
            console.log(data);
            let h1 = document.getElementById('welcome');
            let name = data['username'];
            name = name.charAt(0).toUpperCase() + name.substring(1);
            h1.innerText="Welcome " + name;
            if(data['admin']){
                let div = document.getElementById('dropdown-menu');
                let a2 = document.createElement('a');
                a2.href="edit_task.html";
                a2.style="color: midnightblue";
                a2.id="create";
                a2.setAttribute('class', 'dropdown-item');
                a2.innerText = 'Create or Edit Tasks';
                div.append(a2);

                let select = document.getElementById('selected');
                let option = document.createElement('option');
                option.id = "2";
                option.value = "2";
                option.label = "Create or Edit Tasks";
                select.append(option);

            }

        }
    );

    let a = document.getElementById('choose');
    a.href="task.html";

}

function nextPage() {
    let select = document.getElementById('selected');
    if (select.value == "1"){
        window.location.href = "task.html";
    } else {
        window.location.href = "edit_task.html";
    }

}


function logout(){
    let message = "Are you sure you want to logout?";
    if (confirm(message)) {
        localStorage.removeItem('user_id');
        localStorage.removeItem('token');
        let stringa = window.location.href;
        let elimina = new RegExp("\home.html");
        stringa = stringa.replace(elimina, "");

        window.location.href = stringa + 'signin.html';
    }

}