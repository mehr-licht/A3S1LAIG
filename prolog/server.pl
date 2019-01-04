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
parse_input(gameOver(Board),JSON):-
	gameOver(Board,Looser),
	!,
	json(Looser,JSON).
parse_input(gameOver(Board),JSON):-
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
 * OLD TESTE http://localhost:8081/choose_move([[black,white,black,white,black],[white,black,white,black,white],[black,white,black,white,black],[white,black,white,black,white],[black,white,black,white,black],[white,black,white,black,white]],TabuleiroFinal,black,1)
 * NEW TESTE http://localhost:8081/choose_move([[black,white,black,white,black],[white,black,white,black,white],[black,white,black,white,black],[white,black,white,black,white],[black,white,black,white,black],[white,black,white,black,white]])
 * Devolve o novo tabuleiro em Board após jogada bot
*/
parse_input(choose_move(Tabuleiro),ListJSON):-
	choose_move(Tabuleiro, TabuleiroF,_Color, _Nivel,LineFuture,ColumnFuture,LineNova,ColumnNova),
	json([LineFuture,ColumnFuture,LineNova,ColumnNova], ListJSON).
	%matrix_to_json(TabuleiroF,Board).


/**
 * 
 * Devolve uma lista de jogadas para cada peca escolhida 
*/
parse_input(selectedPiece(TabuleiroInicial,LineIndex,ColumnIndex),ValueJSON):-
	%validMoves(TabuleiroInicial, LineIndex, ColumnIndex, Color, ListasJogadas),
	getValueFromMatrixV2(TabuleiroInicial,LineIndex,ColumnIndex,Value),
	json(Value,ValueJSON).




