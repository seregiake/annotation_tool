window.onload = function () {
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
            let user = document.getElementById('user');
            user.value = data['username'];
            let email = document.getElementById('email');
            email.value = data['email'];
            oldEmail = data['email'];

        }
    );

    let a = document.getElementById('choose');
    a.href="http://localhost:63342/annotation_tool/frontend/task.html";

}

let oldEmail,
    user_id;

function  editUser() {
    let email = document.getElementById('email').value;
    let psw1 = document.getElementById('psw1').value;
    let psw2 = document.getElementById('psw2').value;

    if (email == oldEmail && psw1=='' && psw2==''){
        alert('No changes made');
        return
    }

    if (psw1 != psw2){
        return alert("If you want to change your're password, repeat the same twice!")
    }

    if (psw1 == psw2 && psw1 != ''){
        let user = {
            "email": email,
            "password" : psw1
        };

        // turns data format into JSON
        let dataJson = JSON.stringify(user);
        console.log(dataJson);

    $.ajax({
            url: 'http://localhost:5000/users/' + user_id ,
            type: "PUT",
            // The key needs to match your method's input parameter (case-sensitive).
            data: dataJson,
            dataType: "json",
            contentType: "application/json"

        }).done(
            function(data){
                console.log(data);
                alert("New profile settings successfully registered!")

            }
        );


    }




}

function logout(){
    let message = "Are you sure you want to logout?";
    if (confirm(message)) {
        localStorage.removeItem('user_id');
        localStorage.removeItem('token');
        window.location.href = 'http://localhost:63342/annotation_tool/frontend/signin.html';
    }

}