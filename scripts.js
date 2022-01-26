//Inicialización de variables
let sinkedShips=0 //Cantidad de barcos hundidos
let totalTries=0 //Cantidad de intentos
//Esta función es la que se envía desde el código HTML al presionar una de los botones
function sendMove(id){
    analizeMove(id)
    //Las dos lineas siguientes inhabilitan el presionar un boton dos veces
    let button=document.getElementById(id)
    button.onclick=""
    //Aumenta la cantidad de toques en los botones
    totalTries++
    eraseMessages()
}
//Envía el id al servidor y este analiza la jugada
async function analizeMove(id){
    const send = await fetch('http://localhost:8080/move',{
        method: "POST",
        body: `${id}`
    });
    const result= await send.json();
    //Con el resultado se llama a la función para modificar el color del boton
    modifyButton(id,result);
;}
//Cambia el aspecto del botón dependiendo del resultado y aumenta la cantidad de barcos hundidos "sinkedShips" cuando se requiere
function modifyButton(id,result){
    let move= document.getElementById(id)
    extraMessages(totalTries,sinkedShips,result)
    if (result === 0){
        //color celeste
        move.style.backgroundColor = '#0CB7F2'
        move.style.borderColor = '#297b91'
    }else{
        //color rojo
        move.style.backgroundColor = '#b5051d'
        move.style.borderColor = '#751925'
        //Aumenta la cantidad de barcos hundidos
        sinkedShips++
        //Analiza si se finalizo el juego
        if (sinkedShips===5){finishGame()}
    }
};

//Crea los parrafos para el cartel, podría crearlo directamente del HTML
let sign=document.getElementById("sign")
let p1 = document.createElement("p")
p1.classList='sign-text'
let p2 = document.createElement("p")
p2.classList='sign-text'
let p3 = document.createElement("p")
p3.classList='sign-text'
sign.appendChild(p1)
sign.appendChild(p2)
sign.appendChild(p3)
//Mensajes que aparecerán por consola hasta que los agregue al DOM
function extraMessages(tries,sinked,result){
    if(tries===0 && sinked===0){
        //Hacer una función luego
        p1.innerText='¡Bienvenido a la batalla naval!';
        p2.innerText='Tenés 20 movimientos para hundir los 5 barcos enemigos. Si usas uno de más, estarás perdido.';
        p3.innerText='¡Éxitos!';
    }else{
        if (result===0){
            p1.innerText='¡Bomba al agua!';
        }else{
            p1.innerText='¡Hundiste un barco enemigo!';
        }
        if (tries>19 && sinked<5){
        p2.innerText='Ya no quedan esperanzas ¿Cuanto más necesitas?';
        }else{
            if (sinked !== 5){
                p2.innerText=`Te quedan ${20-tries} movimientos`
            }
        }
    }
};
//Limpia el texto del cartel con cada jugada, puede que no sea realmente necesario en p1 y p2, pero no se como se podría resolver el texto de p3 de otra manera
function eraseMessages(){
    p1.innerText=''
    p2.innerText=''
    p3.innerText=''
}
/*
//Muestra los resultados al terminar el juego
function finishGame(){
    let main=document.getElementById("main")
    //Se elimina el board y el cartel de textos
    let board=document.getElementById("board")
    main.removeChild(board)
    main.removeChild(sign)
    //Se crea el div para mostrar los resultados
    let label1=document.createElement("div");
    label1.id="finish"
    if (totalTries <= 20){
        label1.innerHTML="Felicitaciones ¡Ganaste!"
    }else{
        label1.innerHTML="Volve a intentarlo ¡Esta vez perdiste!"
    }
    //Se agregan los elementos creados en el DOM
    main.appendChild(label1) //div principal, muestra los resultados
    //Se crea el botón para recargar la pagina
    let label2=document.createElement("div");
    let button=document.createElement("button")
    button.innerText="Volver a jugar"
    button.id="refresh"
    //Se agregan los elementos creados en el DOM
    main.appendChild(label1) //div principal, muestra los resultados
    label1.appendChild(label2) //div del boton
    label2.appendChild(button)
    //Al presionar el boton de fin de juego pide al servidor un nuevo tablero, puede hacerlo recargando la pagina o creando los elementos desde esta página de script
    button.onclick=function (){
        window.location.reload()
    }
}
*/


//Muestra los resultados al terminar el juego
function finishGame(){
    //Obtencion de elementos del DOM
    let main=document.getElementById("main")
    let board=document.getElementById("board")
    //Eliminación el board y el cartel de textos
    main.removeChild(board)
    main.removeChild(sign)
    //Creación de elementos para mostrar los resultados
    let label1=document.createElement("div"); //Cartel general
    label1.id="finish"
    let label2=document.createElement("div")  //Div para el boton, sirve para que se genere un "enter" entre el texto y el botón
    let p=document.createElement("p")
    let button=document.createElement("button") //Botón para recargar la pagina
    button.innerText="Volver a jugar"
    button.id="refresh"
    //Cambia la posicion del titulo en la segunda pantalla
    document.getElementById("title").style.gridColumn = "1 / 7";
    //Seleccion del mensaje a mostrar
    if (totalTries <= 20){
        p.innerText="Felicitaciones ¡Ganaste!"
    }else{
        p.innerText="Volve a intentarlo ¡Esta vez perdiste!"
    }
    //Se agregan los elementos creados en el DOM
    main.appendChild(label1) //div principal, muestra los resultados
    label1.appendChild(p)
    label1.appendChild(label2) //div del boton
    label2.appendChild(button)
    //Al presionar el boton de fin de juego pide al servidor un nuevo tablero, puede hacerlo recargando la pagina o creando los elementos desde esta página de script
    button.onclick=function (){
        window.location.reload()
    }
}




//Cada vez que se carga la pagina se crea un nuevo tablero, de esta manera no lo hace el servidor de manera automatica 
document.addEventListener('DOMContentLoaded', async(event)=>{
    extraMessages(0,0)
    event.preventDefault();
    await fetch('http://localhost:8080/newBoard') 
})