
let user_id;
window.onload = function () {
    console.log(user_id);

}

function tryLogin() {
    let username = document.getElementById('username');
    username = username.value;
    let password = document.getElementById('password');
    password = password.value;

    console.log(username, password);

    let newData = {
        "username": username,
        "password": password
    };

    // turns data format into JSON
    let json_data = JSON.stringify(newData);
    console.log(json_data);

    // post data on server
    $.ajax({
        url:  'http://127.0.0.1:5000/auth',
        type: 'POST',
        // The key needs to match your method's input parameter (case-sensitive).
        data: json_data,
        dataType: "json",
        contentType: "application/json"

    }).done(
        function(data){
            console.log(data);
            auth = data['access_token'];
            user_id = data['user_id'];

            window.location.href = 'http://localhost:63342/annotation_tool/frontend/home.html?u=' + user_id;


        }
    ).error(
        function (data) {
            alert("Wrong Username or Password!")

        }
    );


}


function logout(){
    let message = "Are you sure you want to logout?";
    if (confirm(message)) {
        window.location.href = 'http://localhost:63342/annotation_tool/frontend/signin.html';
    }

}
