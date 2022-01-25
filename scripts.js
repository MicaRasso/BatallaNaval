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
    if (result === 0){
        //color celeste
        move.style.backgroundColor = '#0CB7F2'
        move.style.borderColor = '#297b91'
        //Indica los vances por consola, hasta que lo agregue al DOM
        console.log('¡Bomba al agua!')
        extraMessages(totalTries,sinkedShips)
    }else{
        //color rojo
        move.style.backgroundColor = '#b5051d'
        move.style.borderColor = '#751925'
        //Aumenta la cantidad de barcos hundidos
        sinkedShips++
        //Indica los vances por consola, hasta que lo agregue al DOM
        console.log('¡Hundiste un barco enemigo!')
        extraMessages(totalTries,sinkedShips)
        //Analiza si se finalizo el juego
        if (sinkedShips===5){finishGame()}
    }
};
//Mensajes que aparecerán por consola hasta que los agregue al DOM
function extraMessages(tries,sinked){
    if(tries===0 && sinked===0){
        console.log('¡Bienvenido a la batalla naval!');
        console.log('Tenés 20 movimientos para hundir los 5 barcos enemigos.');
        console.log('Si usas uno de más, estarás perdido.');
        console.log('¡Éxitos!');
    }else{
        if (tries>19 && sinked<5){
        console.log('Ya no quedan esperanzas ¿Cuanto más necesitas?');
        }else{
            if (sinked !== 5){
                console.log(`Te quedan ${20-tries} movimientos`);
            }
        }
    }
};
//Muestra los resultados al terminar el juego
function finishGame(){
    let main=document.getElementById("main")
    //Se elimina el board
    let board=document.getElementById("board")
    main.removeChild(board)
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
//Cada vez que se carga la pagina se crea un nuevo tablero, de esta manera no lo hace el servidor de manera automatica 
document.addEventListener('DOMContentLoaded', async(event)=>{
    extraMessages(0,0)
    event.preventDefault();
    await fetch('http://localhost:8080/newBoard') 
})