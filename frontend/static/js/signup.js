function registerUser(){

    let username = document.getElementById('newUser').value;
    let email = document.getElementById('email').value;
    let psw1 = document.getElementById('psw1').value;
    let psw2 = document.getElementById('psw2').value;
    console.log("ciao");

    if (username == "" | email == "" || psw1 == "" || psw2 == "") {
        return alert('Complete the form to sign up')
    }

    $.getJSON('http://localhost:5000/users',
         function (data) {
            console.log(data);
            for( let i = 0; i < Object.keys(data).length; i++){
                if (data[i]['username'] == username){
                    return alert('Name already in use, choose another one to continue!')
                }

            }

        }
    );

    if (psw1 != psw2){
        return alert('Repeat the same password!')
    }

    let newUser = {
            "username": username,
            "email": email,
            "password" : psw1
        };

        // turns data format into JSON
        let dataJson = JSON.stringify(newUser);
        console.log(dataJson);

    $.ajax({
            url: 'http://localhost:5000/users' ,
            type: "POST",
            // The key needs to match your method's input parameter (case-sensitive).
            data: dataJson,
            dataType: "json",
            contentType: "application/json"

        }).done(
            function(data){
                console.log(data);
                alert("New user successfully registered!");
                let stringa = window.location.href;
                let elimina = new RegExp("\signup.html");
                stringa = stringa.replace(elimina, "");
                window.location.href = stringa + 'signin.html';

            }
        );

}