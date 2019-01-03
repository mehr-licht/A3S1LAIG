:-use_module(library(sockets)).
:-use_module(library(lists)).
:-use_module(library(codesio)).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                        Server                                                   %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% To run, enter 'server.' on sicstus command line after consulting this file.
% You can test requests to this server by going to http://localhost:8081/<request>.
% Go to http://localhost:8081/quit to close server.

% Made by Luis Reis (ei12085@fe.up.pt) for LAIG course at FEUP.

port(8081).

% Server Entry Point
server :-
	port(Port),
	write('Opened Server'),nl,nl,
	socket_server_open(Port, Socket),
	server_loop(Socket),
	socket_server_close(Socket),
	write('Closed Server'),nl.

% Server Loop 
% Uncomment writes for more information on incomming connections
server_loop(Socket) :-
	repeat,
	socket_server_accept(Socket, _Client, Stream, [type(text)]),
		% write('Accepted connection'), nl,
	    % Parse Request
		catch((
			read_request(Stream, Request),
			read_header(Stream)
		),_Exception,(
			% write('Error parsing request.'),nl,
			close_stream(Stream),
			fail
		)),
		
		% Generate Response
		handle_request(Request, MyReply, Status),
		format('Request: ~q~n',[Request]),
		format('Reply: ~q~n', [MyReply]),
		
		% Output Response
		format(Stream, 'HTTP/1.0 ~p~n', [Status]),
		format(Stream, 'Access-Control-Allow-Origin: *~n', []),
		format(Stream, 'Content-Type: text/plain~n~n', []),
		format(Stream, '~p', [MyReply]),
	
		% write('Finnished Connection'),nl,nl,
		close_stream(Stream),
	(Request = quit), !.
	
close_stream(Stream) :- flush_output(Stream), close(Stream).

% Handles parsed HTTP requests
% Returns 200 OK on successful aplication of parse_input on request
% Returns 400 Bad Request on syntax error (received from parser) or on failure of parse_input
handle_request(Request, MyReply, '200 OK') :- catch(parse_input(Request, MyReply),error(_,_),fail), !.
handle_request(syntax_error, 'Syntax Error', '400 Bad Request') :- !.
handle_request(_, 'Bad Request', '400 Bad Request').

% Reads first Line of HTTP Header and parses request
% Returns term parsed from Request-URI
% Returns syntax_error in case of failure in parsing
read_request(Stream, Request) :-
	read_line(Stream, LineCodes),
	print_header_line(LineCodes),
	
	% Parse Request
	atom_codes('GET /',Get),
	append(Get,RL,LineCodes),
	read_request_aux(RL,RL2),	
	
	catch(read_from_codes(RL2, Request), error(syntax_error(_),_), fail), !.
read_request(_,syntax_error).
	
read_request_aux([32|_],[46]) :- !.
read_request_aux([C|Cs],[C|RCs]) :- read_request_aux(Cs, RCs).


% Reads and Ignores the rest of the lines of the HTTP Header
read_header(Stream) :-
	repeat,
	read_line(Stream, Line),
	print_header_line(Line),
	(Line = []; Line = end_of_file),!.

check_end_of_header([]) :- !, fail.
check_end_of_header(end_of_file) :- !,fail.
check_end_of_header(_).

% Function to Output Request Lines (uncomment the line bellow to see more information on received HTTP Requests)
% print_header_line(LineCodes) :- catch((atom_codes(Line,LineCodes),write(Line),nl),_,fail), !.
print_header_line(_).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                       Commands                                                  %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%								 		OUR NEW  COMMANDS 											 %%%%
%%% test with url http://localhost:8081/handshake [substitute handshake with function(param,param) ] %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


% Require your Prolog Files here
:-include('src/clobberInit.pl').
:-include('json.pl').

%returns list with N values with each value set to C
test(_,[],N) :- N =< 0.
test(A,[A|Bs],N) :- N1 is N-1, test(A,Bs,N1).


parse_input(handshake, handshake).
parse_input(test(C,N), Res) :- test(C,Res,N).
parse_input(quit, goodbye).

% TESTE http://localhost:8081/move([[black,white,black,white,black],[white,black,white,black,white],[black,white,black,white,black],[white,black,white,black,white],[black,white,black,white,black],[white,black,white,black,white]],2,1,2,2,white)
% Devolve TabuleiroFinal após movimentacao da peca
%
parse_input(move(InitialBoard,RowIndex,ColumnIndex,PP_RowIndex,PP_ColumnIndex,Colour),TabuleiroFinal):-
	move(InitialBoard, RowIndex,ColumnIndex,PP_RowIndex,PP_ColumnIndex,Final, Colour),
	matrix_to_json(Final,TabuleiroFinal).

/**
* TESTE http://localhost:8081/initialBoard
* Devolve o tabuleiro inicial
*/
parse_input(initialBoard,Board):-
	initialBoard(B),
	matrix_to_json(B,Board).

/**
 * IDEIA: Quando clica numa peca saber se a peca eh valida - Se for valida aparece um indicador de selecao
 * TESTE http://localhost:8081/getValueFromMatrixV2([[black,white,black,white,black],[white,black,white,black,white],[black,white,black,white,black],[white,black,white,black,white],[black,white,black,white,black],[white,black,white,black,white]],1,1,Value)
 * Precisa de um index linha e coluna e devolve a cor
*/
parse_input(getValueFromMatrixV2([H|T], Row, Column, Value), Value):-
	getValueFromMatrixV2([H|T], Row, Column, Value).
	%Nao precisei de converter porque Value ja eh string
	%json(Value, ColorPecaSelec).
/**
 * Verificar se o destino do move eh valido/ eh uma peca vizinha
 * O ideal seria funcionar em conjugacao com o getValueFromMatrixV2
 * TESTE http://localhost:8081/checkDifferenceIndexs(1,1,1,2)
 * return 0 se for um move valido -2 se nao for valido
*/
parse_input(checkDifferenceIndexs(RowIndex,ColumnIndex,PP_RowIndex,PP_ColumnIndex), JSON):-
	checkDifferenceIndexs(RowIndex,ColumnIndex,PP_RowIndex,PP_ColumnIndex),
	!,
	Value is 0,      % Se zero a jogada eh valida
	json(Value,JSON).
% TESTE http://localhost:8081/checkDifferenceIndexs(1,1,3,2)
parse_input(checkDifferenceIndexs(_RowIndex,_ColumnIndex,_PP_RowIndex, _PP_ColumnIndex), JSON):-
	Value is 1, % Se 1 a jogada NAO eh valida
	json(Value,JSON).

/**
 * Certificacao do gameOver
 * A cada jogada verifica se existe gameOver
 * TESTE http://localhost:8081/gameOver([[empty,empty,empty,empty,empty],[empty,empty,black,black,empty],[empty,white,empty,empty,black],[white,white,empty,black,empty],[empty,white,empty,empty,empty],[empty,empty,empty,empty,empty]],white)
 * A chamada tem que ser feita com o Board e Looser com white ou black
*/
parse_input(gameOver(Board, Looser),JSON):-
	gameOver(Board,Looser),
	!,
	json(Looser,JSON).
parse_input(gameOver(Board,Looser),JSON):-
	Value is 1, % Se 1 NAO ha gameOver
	json(Value,JSON).

/**
 * Devolve o score, calcula as jogadas validas para as cores
 * 1 elemento da array Scores - blacks
 * 2 elemento da array Scores - white
 * http://localhost:8081/sendScore([[black,white,black,white,black],[white,black,white,black,white],[black,white,black,white,black],[white,black,white,black,white],[black,white,black,white,black],[white,black,white,black,white]],Score)
*/ 
parse_input(sendScore(Tabuleiro),ScoresJSON):-
	sendScore(Tabuleiro, Scores),
	json(Scores, ScoresJSON).


/** BOT PLAY esta predefenido com a cor black
 * TESTE http://localhost:8081/choose_move([[black,white,black,white,black],[white,black,white,black,white],[black,white,black,white,black],[white,black,white,black,white],[black,white,black,white,black],[white,black,white,black,white]],TabuleiroFinal,black,1)
 * Devolve o novo tabuleiro em Board após jogada bot 
*/
parse_input(choose_move(Tabuleiro),Board):-
	choose_move(Tabuleiro, TabuleiroF,_Color, _Nivel),
	matrix_to_json(TabuleiroF,Board).


/**
 * 
 * 
*/
parse_input(validMoves(TabuleiroInicial,LineIndex,ColumnIndex,ColorContraria),ListjogJSON):-
	validMoves(TabuleiroInicial, LineIndex, ColumnIndex, ColorContraria, ListasJogadas),
	json(ListasJogadas,ListjogJSON).





/*
parse_input(claim(Color,Colors,Player),JSON):-
	claim(Color,Colors,Player,NewColors,NewPlayer),
	json([1,NewColors,NewPlayer],JSON).

parse_input(claim(_Color,_Colors, _Player),JSON):-
	json([0,0,0],JSON).

parse_input(humanPlay(Board,InitPos,FinalPos,P1,P2),NewBoard):-
	humanPlay(Board,InitPos,FinalPos,P1,P2,Tmp,_P),
	matrix_to_json(Tmp,NewBoard).

parse_input(humanPlay(Board,_InitPos,_FinalPos,_P1,_P2),NewBoard):-
	matrix_to_json(Board,NewBoard).

parse_input(getMove(Board,Player1,Player2),JSON):-
	getMove(Board,Player1,Player2,X1,Y1,X2,Y2),
	json([0,X1,Y1,X2,Y2],JSON).

parse_input(getMove(_Board,_Player1,_Player2),JSON):-
	json([1,0,0,0,0],JSON).

parse_input(makeMove(Board,Player,X1,Y1,X2,Y2),NewBoard):-
	makeMove(Board,Player,X1,Y1,X2,Y2,Tmp,_NP),
	matrix_to_json(Tmp,NewBoard).

parse_input(isGameOver(Board,P1,P2),Over):-
	isGameOver(Board,P1,P2,Tmp),
	json(Tmp,Over).






%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%    another example     %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%:- include('main.pl').


%define the actions that can be triggered

%------------------------------------global functions
executeCommand(handshake, handshake).
executeCommand(reconsult, 'reconsulted'):-reconsult('server.pl').
executeCommand(quit, goodbye).
executeCommand(clear, 'done'):-clear.
executeCommand(displayBoard, 'done'):-displayBoard.

%------------------------------------game settings

% init(GameType) - humanVhuman - humanVbot - botVbot
% start a new game given a modeType
% returns the next player
executeCommand(init(humanVhuman), 'success'):-init(humanVhuman).
executeCommand(init(humanVbot, BotLevel), 'success'):-init(humanVbot), chooseBotLevel(bot, BotLevel).
executeCommand(init(botVbot, Bot1Level, Bot2Level), 'success'):-init(botVbot), chooseBotLevel(bot1, Bot1Level), chooseBotLevel(bot2, Bot2Level).

%------------------------------------actions
% action(move, Xf, Yf, Xt, Yt)
% executes a move for the current user
% returns 'success' if all ok or an error message otherwise
executeCommand(action(move, Xf, Yf, Xt, Yt), 'success'+Xf-Yf-Xt-Yt+Removed):-pushGame, processMove(Xf, Yf, Xt, Yt), endTurn(Removed).

% action(claim, Color)
% makes the current user claim the supplied Color
% returns 'success' if all ok or an error message otherwise
executeCommand(action(claim, Color), 'success'):-claimColor(Color).

% action(playBot)
% if the next player is a bot, the bot executes a move
% returns the Move, like
executeCommand(action(playBot), 'success'+Xf-Yf-Xt-Yt+Removed+Color):-pushGame, movesAvailable, player(Bot),isBot(Bot),playBot(Bot, Xf-Yf-Xt-Yt-Color), endTurn(Removed).

% action(undo)
% undo a Move, like
executeCommand(action(undo), 'success'):- popGame.


% action errors
executeCommand(action(_), OutputMessage):-outputMessage(OutputMessage).
executeCommand(action(_, _), OutputMessage):-outputMessage(OutputMessage).
executeCommand(action(_, _, _, _, _), OutputMessage):-outputMessage(OutputMessage).




%------------------------------------queries
% query(board) - returns the board
executeCommand(query(board), Board):-board(Board).
% query(player)
executeCommand(query(player), Player):-player(Player).
% query(nextPlayer)
executeCommand(query(nextPlayer), NextPlayer):-nextPlayer(NextPlayer).
% query(availableColors) get a list of the next colors to claim
executeCommand(query(availableColors), ToClaim):-toClaim(ToClaim).
% query(colors) get the colors of the current player
executeCommand(query(colors), Colors):-getColors(Colors).
% query(stacks) get the stacks of the current player
executeCommand(query(stacks), Stacks):-getStacks(Stacks).
% query(score) get the score of the current player
executeCommand(query(score), Score):-evaluateBoard(Score).
% query(validMoves,Xf,Yf) get a list of all the valid moves from X and Y
executeCommand(query(validMoves,Xf,Yf), Moves):-
	getMoveableColorsByPlayer(MoveableColors),
    findall(Xt-Yt, getFullValidMove(MoveableColors, Xf, Yf, Xt, Yt, none), Moves).
% query(gameOver) returns (draw, player1, player2, bot, bot1, bot2 or false)
executeCommand(query(gameOver), Winner):- \+movesAvailable, getWinner(Winner).
executeCommand(query(gameOver), false). % game not over yet
% default query response
executeCommand(query(_), 'queried variable not set (yet)').

%functions for the interface
init(GameType):-
	clearInit,
    startGame(GameType),
    generateBoard(Board),
    player(CurrentPlayer),
    nextPlayer(NextPlayer),
    claimableColors(C),
    saveToClaim(C), % load the colors that can be claimed
    saveBoard(Board), % save the board initial state
    saveGetColors(CurrentPlayer, []),
    saveGetColors(NextPlayer, []),
    saveGetStacks(CurrentPlayer, []),
    saveGetStacks(NextPlayer, []),
	displayBoard.


% utils functions
% error message functions
setOutputMessage(Message):-
	retract(outputMessage(_)),
	assert(outputMessage(Message)).
writeOutputMessage(Message):-
	write(Message),
	setOutputMessage(Message).

*/