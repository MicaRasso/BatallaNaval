//Se importan los paquetes necesarios
const http = require('http');
const url = require("url");

//Funcion de creación del servidor
const server = http.createServer(function (request, response) {
	response.setHeader('Access-Control-Allow-Origin', '*');
    console.log(board)
    //Registra la información que se envía al servidor
    let body = '';
    request.on('data', (chunk) => {
        chunk=`${chunk}`
        body += chunk;
        console.log('Move: ',body);
    });

    //Procesa la jugada
    request.on('end', () => {
        const parsedUrl = url.parse(request.url)
        if (parsedUrl.pathname === "/move") {
            let result= analysis(body,board);
            console.log(result);
            response.write(JSON.stringify(result));
            response.end();
        }
        //Crear un nuevo tablero sin finalizar la sesion del servidor
        if(parsedUrl.pathname==="/newBoard"){
            console.log('New board available');
            board = randomBoard(matrix);
            return board;
        }
    });
});
//Funcion de escucha del servidor
server.listen(8080, ()=>{
  console.log('Server started');
});

//Cración de la matriz original y del tablero a partir de ella
let matrix= [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]];
let board=matrix
// let board = randomBoard(matrix);

//FUNCIONES
//Estas funciones crean un tablero random con el cual jugará el usuario. Si randomBoard(arg) crea un tablero con menos de 5 naves, se creará un nuevo tablero.
//randomBoard() y analyzeBoard() son funciones recursivas entre sí, aunque, tal vez, podrían plantearse en una sola. 
//Creación del tablero 
function randomBoard(board){
    for (let i =0; i < 5; i++) {
        board[randomNumber()][randomNumber()]=1;
    }
    if (analyzeBoard(board)){
        // console.log(board)
        return board
    }else{
        matrix= [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]]
        // console.log(board)
        return randomBoard(matrix)
    }
}
function randomNumber(){
    return Math.trunc(Math.random()*5)
}
function analyzeBoard(board2analyze){
    let cont=0;
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            if (board2analyze[i][j]===1){
                cont++
    }}}
    return cont===5
}

//Analiza la jugada hecha por el usuario y envía el resultado (si el usuario hundio una nave o no)
function analysis(move,board){
    let n1=move[0];
    let n2=move[1];
    if (board[n1][n2]===1){
        board[n1][n2]=0;
        // console.log(board); //Muestra las posiciones que quedan luego de un movimiento
        return 1 //('Hundiste un barco')
    } else{
        return 0 //('Le diste al agua')
    }
}


