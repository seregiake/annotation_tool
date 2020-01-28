window.onload = function () {
    let url_string = window.location.href;
    let url = new URL(url_string);
    user_id = url.searchParams.get("u");
    console.log(user_id);

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
                a2.href="http://localhost:63342/annotation_tool/frontend/edit_task.html?u="+user_id;
                a2.style="color: midnightblue";
                a2.id="create";
                a2.setAttribute('class', 'dropdown-item');
                a2.innerText = 'Create or Edit Tasks';
                div.append(a2);
            }

        }
    );

    let a = document.getElementById('choose');
    a.href="http://localhost:63342/annotation_tool/frontend/task.html?u="+user_id;

}

function nextPage() {
    // TODO legge l'operazione richiesta ed esegue di conseguenza
    // let select = document.getElementById('selected');
    window.location.href = "http://localhost:63342/annotation_tool/frontend/task.html?u="+user_id;

}

function selectChange() {

    $.getJSON(
        'http://localhost:5000/categories' , function (data) {
            console.log(data);
            let div = document.getElementById('superclass');
            div.innerText='';
            let btn = document.getElementById('btn-save');
            btn.hidden=false;
            for (let i = 0; i < Object.keys(data).length; i++){
                let inner_div = document.createElement('div');
                inner_div.setAttribute('class', 'form-check');
                let input = document.createElement('input');
                input.setAttribute('class', 'form-check-input');
                input.setAttribute('type', 'checkbox');
                input.value = i + 1;
                input.id = data[i]['id'];
                input.name=data[i]['name'];
                let label = document.createElement('label');
                label.setAttribute('class', 'form-check-label');
                label.setAttribute('for', data[i]['id']);
                label.innerText = data[i]['name'];

                inner_div.append(input);
                inner_div.append(label);
                div.append(inner_div);

            }

            loadChecked();

        }
    );



     

}

function loadChecked() {
    let select = document.getElementById('dataset');
    let choose = document.getElementById(select.value);
    console.log(choose.label);

    let super_choose =[];
     $.getJSON(
        'http://localhost:5000/tasks' , function (data) {
            console.log(data);
            for (let i = 0; i < Object.keys(data).length; i++){
                console.log(data[i]);
                console.log(choose.label);
                if(data[i]['folder_name'] == choose.label){

                    super_choose.push(data[i]['super_id']);
                }

            }

            console.log(super_choose);

             while (super_choose.length != 0){
                 let check_id = super_choose.pop();

                 $('input:checkbox.form-check-input').each(function () {
                   if(this.id == check_id){
                       this.checked = true;
                       console.log(this.name);

                   }
                });

             }
        }
    );

}

function saveTask() {
    // TODO legge i task selezionati e li inserisce se sono nuovi
    //  quindi controllare se non ci sono gia o se devono essere eliminati

    let super_id = [];
    $('input:checkbox.form-check-input').each(function () {
       let sThisVal = (this.checked ? $(this).val() : "");
       if(sThisVal!=''){
           console.log(this.name);
           console.log(sThisVal);
           super_id.push(sThisVal);
       }
    });

    let select = document.getElementById('dataset');
    let choose = document.getElementById(select.value);
    console.log(choose.label);
    console.log(select.value);

    while(super_id.length != 0){
        let sup_id = super_id.pop();
        let newData = {
            "name": choose.label,
            "super": sup_id

        };

        // post data on server
        $.ajax({
            url: 'http://localhost:5000/tasks',
            type: 'POST',
            // The key needs to match your method's input parameter (case-sensitive).
            data: JSON.stringify(newData),
            dataType: "json",
            contentType: "application/json"

        }).done(
            function(data){
                console.log(data);

            }
        );


    }


    
}