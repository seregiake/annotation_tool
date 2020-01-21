window.onload = function () {
    displaySuperCategories();
}

function displaySuperCategories() {
    $.getJSON(
        'http://localhost:5000/categories', function (data) {
            console.log(data);
            let s_cat = data["super"]
            console.log(data["super"]);

            let select = document.getElementById('category');

            for( let i = 0; i < Object.keys(s_cat).length; i++){
                let option = document.createElement("option");
                console.log(s_cat[i]["id"]);
                option.id = s_cat[i]["id"];
                option.value = s_cat[i]["id"];
                option.label =  s_cat[i]["name"];

                select.append(option);

            }

        }
    );

}

function sendCategory() {

    let select = document.getElementById('category');
    let choose = document.getElementById(select.value);
    console.log(choose.label);
    console.log(select.value);

    window.location.href = "http://localhost:63342/annotation_tool/frontend/images_list.html?cat=" + select.value;
    // leggere la categoria selezionata e passare alla prossima pagina

}