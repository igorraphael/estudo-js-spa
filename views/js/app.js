'use strict';
var content;

$(document).ready(function () {
    content = document.body.appendChild(document.createElement('div'));
    content.classList.add('container-fluid');
    createHeader();

    //click nav menu 
    $('.nav-li').on("click", function () {
        alert('cliclou no ' + this.innerHTML);
        createWindow();
    });

    
});
//function create header
function createHeader() {
    $.ajax({
        type: 'POST', url: '', data: { mod: 'window', action: 'getNameWindow' },
        error: function (xhr, textStatus, error) { alert("Não foi possível atender sua requisição."); },
        success: function (data, textStatus, jqXHR) {
            // console.log(data);
            //var headerNav = ['Cadastro', 'Relatorio', 'Finanças'];
            var header = document.createElement('nav');
            header.classList.add('header');
            for (var i = 0; i < data.length; i++) {
                var a = document.createElement('a');
                a.classList.add('nav-li');
                a.onclick = function () { createWindow(this.innerHTML) }
                a.innerHTML = data[i];
                header.appendChild(a);
            }
            content.appendChild(header);// add header inside div.container
        }
    });
}

//create window
function createWindow(nameWindow) {
    if(nameWindow == 'Tabela'){
        createTableList(nameWindow);
    }else{
        $.ajax({
            type: "POST",
            url: "",
            data: { mod: 'window', action: 'getWindows', param: nameWindow },
            error: function () { alert("Não foi possível atender sua requisição."); },
            success: function (data, textStatus, jqXHR) {
                if(data.indexOf('Nenhum') != -1) { //Caso não exista campos para criar janela..
                    alert(data);
                }else{
                    //fragmento-div
                    var nWindowFull = data[0].nJanela.replace(/ /g, "_");
                    var fragment, div, i, campo, h1, form, btnClose;
                    fragment = document.createDocumentFragment();
                    div = fragment.appendChild(document.createElement('div'));
                    btnClose = div.appendChild( document.createElement('span') );
                    btnClose.onclick = function(){ closeWindow(this.parentNode, nWindowFull);}
                    btnClose.classList.add('btn', 'btn-close');
                    div.setAttribute("id", nWindowFull );
                    div.classList.add('window');
                    h1 = div.appendChild(document.createElement('h1'));
                    h1.innerHTML = data[0]['nJanela'];
                    form = div.appendChild(document.createElement('form'));
                    form.classList.add('form');
                    form.setAttribute("id", nWindowFull);
                    form.addEventListener("submit", function(evento){event.preventDefault();sendForm(data[0].nJanela, data[0].id_janela);}); //add event default for submit form
                    var nameForm = data[0].nJanela; //.replace(/ /g, "_").toLowerCase();
                    form.setAttribute('name', nameForm);
                    form.setAttribute('data-id-window', data[0].id_janela);
                    for (i = 0; i < data.length; i++) {
                        campo = form.appendChild(document.createElement(data[i]['field_element']));
                        campo.setAttribute('type', data[i]['field_type'] );
                        campo.name = nameInput(data[i]['descricao']);
                        campo.setAttribute('data-iten', data[i]['id']);
                        campo.placeholder = data[i]['descricao'];
                        if(data[i]['field_element'] == 'button'){
                            campo.classList.add('myButton');
                            campo.innerHTML = data[i]['descricao'];
                        }
                    }
                    $(div).draggable();
                    content.appendChild(fragment);
                }
            }
        });
    }


//end func    
}

function createTableList(nameWindow){
    var table = $("table");
    if( table.length != 0 ){
        alert('Tabela abaixo..');
    }else{
        nameWindow = 'Cliente';
    $.ajax({
        type: "POST",
        url: "",
        data: { mod: 'window', action: 'getAllData', window: nameWindow },
        error: function () { alert("Não foi possível atender sua requisição."); },
        success: function (data, textStatus, jqXHR) {
            var arrayHeaderTable = headerTable(data);
            var div, table, thead, tr, th, td, tbody;
            div = content.appendChild(document.createElement('div'));
            div.classList.add('div-table');
            //table
            table = div.appendChild(document.createElement('TABLE'));
            table.classList.add('table');
            table.setAttribute("id", 'table-'+nameWindow+'');
            //thead
            thead = table.appendChild(document.createElement('thead'));
            thead.classList.add('thead-dark');
            tr = thead.appendChild(document.createElement('tr'));
            tr.classList.add('tr-table');
            arrayHeaderTable.push('Editar');
            for(var i = 0; i < arrayHeaderTable.length; i++){
                th =  tr.appendChild(document.createElement('th'));
                th.innerHTML = arrayHeaderTable[i];
            }
            //tbody
            tbody = table.appendChild(document.createElement('tbody'));
            let contRow = data.length / 5;
            //row table tr, td.
            for(var j = 0; j < contRow; j++){
                var row = createRowTable(data);
                tr = tbody.appendChild(document.createElement('tr'));
                tr.setAttribute("data-id-value", row[j].id_item);
                for(var t = 0; t < row.length; t++){
                    td = tr.appendChild(document.createElement('td'));
                    td.innerHTML = row[t].value;
                }
            }   
        }
    });
    }
     
}
function removeArr(data){
    for (var i = 0; i < 5; i++) {
        data.shift();
    }
}
//function criar row na tabela
function createRowTable(data){
    let newArr = new Array();
    for (var i = 0; i < 5; i++) {
        newArr[i] = data[i];
    }
    removeArr(data);//remove row data
    return newArr;
}

//function para criar o header da tabela
function headerTable(data){
    var newArr = new Array();
    for(var i = 0; i < 5; i++){
        newArr[i] = data[i].window;
    }
    return newArr;
}

function windowFocus(context) {
    $('.janela').css('zIndex', '0');
    $('.janela').css('opacity', '0.4');
    context.style.zIndex = 9;
    context.style.opacity = 1;
}

function closeWindow(context, nameWindow) {
    context.parentNode.removeChild(context);//remove div DOM.
    context.classList.add('windowDisplayOff');
}

//only numbers
function onlyNumbers(e) {
    var tecla = (window.event) ? event.keyCode : e.which;
    if ((tecla > 47 && tecla < 58)) return true;
    else {
        if (tecla == 8 || tecla == 0) return true;
        else return false;
    }
}


function nameInput(title_campo){
    var titleReturn = title_campo.split(" ");
    return titleReturn[0].toLowerCase();
}

function sendForm(nameForm){
    var error = 0;
    var array = [];
    array.push(nameForm);
    $("form input").each(function(){
        var input = $(this);
        if(input.val() == ''){
            input.addClass('msg-error');   
            error++;
        }else{
            if(input.attr('type') != 'submit'){
                var data = input.val()+'['+input.data("iten")+']';
                array.push( data );
            }
            
        }
    });
    if(error == 0){ //if error 0 send submit
        $.ajax({
            type: "POST",
            url: "",
            data: { mod: 'window', action: 'insertNewRow', param: array },
            error: function () { alert("Não foi possível cadastrar cliente."); },
            success: function (data, textStatus, jqXHR) {
                //console.log(data);
                $('.msg-error').removeClass('msg-error');
                $('input').val('');
                alert(data);
            }
        });
    }else{
        alert('Falta informar dados..');
    }
}




