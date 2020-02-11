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

function nextPage() {
    // TODO legge l'operazione richiesta ed esegue di conseguenza
    // let select = document.getElementById('selected');
    window.location.href = "http://localhost:63342/annotation_tool/frontend/task.html";

}




function logout(){
    let message = "Are you sure you want to logout?";
    if (confirm(message)) {
        localStorage.removeItem('user_id');
        localStorage.removeItem('token');
        window.location.href = 'http://localhost:63342/annotation_tool/frontend/signin.html';
    }

}