'use strict';
var content, windowsOpen = [];

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
                windowsOpen.push( [nWindowFull,1] );
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
                form.addEventListener("submit", function(evento){event.preventDefault();sendForm(data[0].nJanela);}); //add event default for submit form
                var nameForm = data[0].nJanela; //.replace(/ /g, "_").toLowerCase();
                form.setAttribute('name', nameForm);
                for (i = 0; i < data.length; i++) {
                    //var tipoCampo = separatorType(data[i]['campo_type'], 'type');
                    campo = form.appendChild(document.createElement(data[i]['field_element']));
                    campo.setAttribute('type', data[i]['field_type'] );
                    campo.name = nameInput(data[i]['descricao']);
                    campo.setAttribute('data-iten', data[i]['id']);
                    // if (campo.type == 'radio') {//para os radios
                    //     campo.name = 'genero';
                    //     campo.innerHTML = data[i]['title_campo'];
                    // } else if (campo.type == 'submit') { //caso for button
                    //     campo.classList.add('myButton');
                    //     campo.value = data[i]['descricao'];
                    // } else {
                        campo.placeholder = data[i]['descricao'];
                    //     if(data[i]['field_type'] == 'number'){
                    //         campo.classList.add('inpMoney');
                    //         campo.setAttribute("onkeypress", "return onlyNumbers(event)");
                    //         campo.setAttribute("size", "10"); 
                    //         campo.setAttribute("min", "0"); 
                    //         campo.setAttribute("max", "100"); 
                    //     }
                    //     if (campo.placeholder == 'Money') {//if true add class in input
                    //         campo.classList.add('inpMoney');
                    //         campo.setAttribute("onkeypress", "return onlyNumbers(event)");
                    //         campo.setAttribute("size", "10");
                    //     }
                    // }
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
//end func    
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

function verifyWindowOpens(nameWindow){
    var winOpens = $('.window');
    if(winOpens.length > 0){
        for (var c = 0; c < winOpens.length; c++) {
            if(winOpens[c].classList.contains("windowDisplayOff") == true){
                winOpens[c].classList.remove("windowDisplayOff"); 
            }else if(winOpens[c].id === nameWindow){
                //winOpens[c].classList.remove("windowDisplayOn"); 
                //alert('ja foi criado.');
                return false;
            }
        }
    }
}


function nameInput(title_campo){
    var titleReturn = title_campo.split(" ");
    return titleReturn[0].toLowerCase();
}

function sendForm(nForm){
    var error = 0;
    var array = [];
    array.push(nForm);
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
                console.log(data);
                $('.msg-error').removeClass('msg-error');
                $('input').val('');
                alert(data);
            }
        });
    }else{
        alert('Falta informar dados..');
    }
}




