'use strict';
var content;

$(document).ready(function () {
    createHeader();//create header
    content = document.body.appendChild(document.createElement('div'));
    content.classList.add('container');
    //click nav menu 
    $('.nav-li').on("click", function () {
        alert('cliclou no ' + this.innerHTML);
        createWindow();
    });


});

//header
function createHeader() {
    
    $.ajax({
        type: 'POST', url: '',dataType: 'application/json', data: { mod: 'window', action: 'getNameWindow' },
        error: function (xhr, textStatus, error) { alert("Não foi possível atender sua requisição.");console.log(xhr.statusText);console.log(textStatus);console.log(error); },
        success: function (data, textStatus, jqXHR) {
            console.log(data);
        }
    });
    var headerNav = ['Cadastro', 'Relatorio', 'Finanças'];
    var header = document.body.appendChild(document.createElement('nav'));
    header.classList.add('header');
    for (var i = 0; i < headerNav.length; i++) {
        var a = document.createElement('a');
        //a.setAttribute("href", "#");
        a.classList.add('nav-li');
        a.innerHTML = headerNav[i];
        header.appendChild(a);
    }
}

//create window
function createWindow() {
    //post
    $.ajax({
        type: "POST",
        url: "",
        data: { mod: 'window', action: 'getWindows' },
        error: function () { alert("Não foi possível atender sua requisição."); },
        success: function (data, textStatus, jqXHR) {
            console.log(data);
            //fragmento-div
            var fragment, div, i, campo, h1, form;
            fragment = document.createDocumentFragment();
            div = fragment.appendChild(document.createElement('div'));
            div.classList.add('window');
            h1 = div.appendChild(document.createElement('h1'));
            h1.innerHTML = data[0]['nome_window'];
            form = div.appendChild(document.createElement('form'));
            form.classList.add('form');
            for (i = 0; i < data.length; i++) {
                var tipoCampo = separatorType(data[i]['campo_type'], 'type');
                campo = div.appendChild(document.createElement('input'));
                campo.setAttribute('type', separatorType(data[i]['campo_type'], 'type'));
                if (campo.type == 'radio') {//para os radios
                    campo.name = 'genero';
                    campo.value = data[i]['title_campo'];
                    campo.innerHTML = data[i]['title_campo'];
                } else if (campo.type == 'button') { //caso for button
                    campo.classList.add('myButton');
                    campo.value = data[i]['title_campo'];
                    campo.onclick = function () { alert('clicou no botao para cadastrar...'); }
                } else {
                    campo.placeholder = data[i]['title_campo'];
                    if (campo.placeholder == 'Money') {//if true add class in input
                        campo.classList.add('inpMoney');
                        campo.setAttribute("onkeypress", "return onlyNumbers(event)");
                        campo.setAttribute("size", "10");
                    }
                }
            }
            $(div).draggable();
            content.appendChild(fragment);
        }
    });
}

//footer
function createBarWindow() {
    if (footer.length > 0) {
        var divBar = $('.bar-window');
        var block = divBar.append(document.createElement('button'));
        block.innerHTML = footer[0]; // PAREI AQUIIIIIIII
        //block.classList.add('block-window-bottom');
    }
}

function separatorType(campo_type, retorno) {
    var type_field = campo_type.split("-");
    if (retorno == 'type') {
        return type_field[1];
    } else {
        return type_field[0];
    }

}


function windowFocus(context) {
    $('.janela').css('zIndex', '0');
    $('.janela').css('opacity', '0.4');
    context.style.zIndex = 9;
    context.style.opacity = 1;
}

function closeWindow(context) {
    context.style.display = 'none';
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

