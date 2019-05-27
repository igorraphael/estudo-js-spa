'use strict';
var content;

$(document).ready(function () {
    content = document.body.appendChild(document.createElement('div'));
    content.classList.add('container');
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
    //post
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
                var fragment, div, i, campo, h1, form;
                fragment = document.createDocumentFragment();
                div = fragment.appendChild(document.createElement('div'));
                div.setAttribute("id", data[0].nome_window.replace(/ /g, "_") );
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

//function to name open windows.
function idWindow(name_window){
    var name = name_window.replace(" ", "_");
    return name
}

