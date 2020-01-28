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
                let a = document.createElement('a');
                a.href="http://localhost:63342/annotation_tool/frontend/edit_task.html?u="+user_id;
                a.style="color: midnightblue";
                a.id="create";
                a.setAttribute('class', 'dropdown-item');
                a.innerText = 'Create or Edit Tasks';
                div.append(a);
            }

        }
    );

    let a = document.getElementById('choose');
    a.href="http://localhost:63342/annotation_tool/frontend/task.html?u="+user_id;

}

function nextPage() {
    let select = document.getElementById('selected');

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
                let label = document.createElement('label');
                label.setAttribute('class', 'form-check-label');
                label.setAttribute('for', data[i]['id']);
                label.innerText = data[i]['name'];

                inner_div.append(input);
                inner_div.append(label);
                div.append(inner_div);

            }

        }
    );

     $.getJSON(
        'http://localhost:5000/tasks' , function (data) {
            console.log(data);

        }
    );
     

}

function saveTask() {
    
}