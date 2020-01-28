let auth;
window.onload = function() {

        let newData = {
            "username": 'serena',
            "password": 'ciao'
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

            }
        );

}

function go() {
    console.log(auth);

    // post data on server
    $.ajax({
        url:  'http://127.0.0.1:5000/users',
        type: 'GET',
        // The key needs to match your method's input parameter (case-sensitive).
        headers: {
            Authorization: "JWT " + auth
        }

    }).done(
        function(data){
            console.log(data);

        }
    );
}