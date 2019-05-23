'use strict';
var content;

$(document).ready(function () {
    createHeader();//create header
    content = document.body.appendChild( document.createElement('div') );
    content.classList.add('container');
    //click nav menu 
    $('.nav-li').on("click", function(){
        alert('cliclou no '+this.innerHTML);
        createWindow();        
    });
    

});
//header
function createHeader(){
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
function createWindow(){
    var fragment = document.createDocumentFragment();
    var myWindow = fragment.appendChild(document.createElement('div'));
    myWindow.className = 'window'; 
    //post
    $.ajax({
        type: "POST",
        url: "",
        data: {mod:'teste',action: 'all'},
        error: function() { alert("Não foi possível atender sua requisição."); },
        success: function(data, textStatus, jqXHR) { console.log(data)}
       
        });

    //$(myWindow).draggable();
    content.appendChild(fragment);
}

//footer
function createBarWindow(){
    if(footer.length > 0){
        var divBar = $('.bar-window');
        var block = divBar.append( document.createElement('button') );
        block.innerHTML = footer[0]; // PAREI AQUIIIIIIII
        //block.classList.add('block-window-bottom');
    }
}



function windowFocus(context){
    $('.janela').css('zIndex', '0');
    $('.janela').css('opacity', '0.4');
    context.style.zIndex = 9;
    context.style.opacity = 1;
}

function closeWindow(context) {
    context.style.display = 'none';
}

