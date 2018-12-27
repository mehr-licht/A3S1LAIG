

myTeste([ [1-2]-1,[2-2]-3,[3-2]-2,[2-1]-4, [4-2]-2 ]).

%value(Tabuleiro, +Player, -Value)

%escolhaElementosComMaisJogadas(Tabuleiro,NovaLista):-
escolhaElementosComMaisJogadas([],[],0).

escolhaElementosComMaisJogadas([[Line-Column]-Index|Tail], NewList, NewIndex ):-
    escolhaElementosComMaisJogadas(Tail,ListaDeElementosMax,MiddleIndex),
    compare(<, MiddleIndex, Index),
    !,
    write(Index), nl,
    append([[Line-Column]-Index], ListaDeElementosMax,NewList),
    NewIndex is Index.
escolhaElementosComMaisJogadas([[_-_]-_|Tail], NewList, MiddleIndex ):-
    escolhaElementosComMaisJogadas(Tail, NewList, MiddleIndex).





/**
 * choose_move(+TabuleiroInicial, -TabuleiroFinal, +Color,Nivel)
* 1) Da NOVALISTA ordenar a lista por [_-_]-Indexes maiores » vai ser o nosso Value
* 2) Por cada uma das posicoes possiveis ir buscar o length de jogadas possivies nessa peca » somar ao Value
* o bot vai seguir o caminho da arvore que tem mais jogadas possiveis, mas vai deteriorar as pecas isoladas 
*/
choose_move(Tabuleiro, TabuleiroFinal,Color, 1):-
    posicoesPecasNoTabuleiro(Tabuleiro,black,ListaDePares),
    escolha(Tabuleiro, ListaDePares,ListaParaLimpar),
    write('Lista para Limpar: '), write(ListaParaLimpar), nl,
    cleanLista(ListaParaLimpar, NovaLista), %Novalista formato [[1-1]-2,[1-3]-1,[2-2]-2,[3-3]-1,[5-1]-1]
    %escolha da peca a mover
    write('Lista ja limpa: '), write( NovaLista), nl,   
    escolhaElementosComMaisJogadas(NovaLista,_ListaIndexesMax,0),
    
    %fim da escolha da peca a mover
    jogadasNaPosicaoPossiveis(Tabuleiro, LineFuture, ColumnFuture, white, ListaJogadasVizinhas ),
    %escolha da direccao
    length(ListaJogadasVizinhas, SizeNew),    
    random(0,SizeNew,Index2),
    write('ListaJogadasVizinhas: '), write(ListaJogadasVizinhas), nl,
    write('index da jogada a fazer: '),write(Index2), nl,
    nth0(Index2, ListaJogadasVizinhas, [LineNova-ColumnNova]),    
  %  fim da escolha de direccao
    replaceInMatrix(Tabuleiro, LineNova, ColumnNova, black, TabuleiroNovo),
    replaceInMatrix(TabuleiroNovo, LineFuture, ColumnFuture, empty, TabuleiroFinal),
    write('Jogou de '),
    write(LineFuture), 
    write(' '),
    write(ColumnFuture),
    write(' para '),
    write(LineNova),
    write(' '),
    write(ColumnNova),
    write(' E acabou a jogada bot'). 





































/**
 testeBoard(X),findall([Line-Column],checkarPecaVizinhaValiada(X, 2, 2, white,[Line-Column]), ListaDePares).
X = [
    [empty,empty,empty,empty,empty],
    [empty,black,white,black,empty],
    [empty,white,black,empty,black],
    [white,white,empty,black,empty],
    [empty,white,empty,white,empty],
    [empty,black,empty,empty,empty]],
ListaDePares = [[2-1],[1-2]] ? 

*/


/**
 * getColorLinha(+Linha, +Coluna, -Color) 
 * @brief Verifica qual a peca em determinada celula (ou se vazio)
 * @param +Linha: linha da celula a verificar
 * @param +Coluna: coluna da celula a verificar
 * @param -Color: cor da celula verificada
*/
getColorLinha(Linha, Coluna, Color):-
    nth0(Coluna, Linha, Color).

/**
 * getColorMatrix(+TabuleiroInicial, +Line, +Coluna, -Color) 
 * @brief Verifica qual a peca em determinada celula, percorrendo toda a matriz e chamando o predicado getColorLinha para cada linha
 * @param +TabuleiroInicial: tabuleiro actual
 * @param +Line: linha da celula em questao
 * @param +Coluna: coluna da celula em questao
 * @param -Color: cor da celula pesquisada
*/
getColorMatrix(TabuleiroInicial, Line, Coluna, Color):-
    nth0(Line,TabuleiroInicial,Linha),
    getColorLinha(Linha, Coluna, Color).


/** 
 * checkarPecaVizinhaValiada(+TabuleiroInicial, +Line, +Column, -Color, -LinhaEColuna)
 * @brief verifica para quais das 4 direccoes possiveis dos moves existe uma jogada valida e devolve lista com as possiveis
 * @param +TabuleiroInicial: tabuleiro actual
 * @param +Line da peca a jogar
 * @param +Column da peca a jogar
 * @param -Color : eh o estado  que a casa seguite tem de ter, eh a cor do adversario
 * se a peca em linha-coluna for de cor preta, entao +Color = white.
 * @param -LinhaEColuna lista de pares Linha-Coluna correspondendo a celula para onde se move, ja com verifficacao
*/
checkarPecaVizinhaValiada(TabuleiroInicial, Line,Column,Color,[Line-NewColumnIndex]):-
    NewColumnIndex is Column -1,
    ( between(0,5,Line),
      between(0,4,NewColumnIndex)
    ),
    !,
    getColorMatrix(TabuleiroInicial, Line, NewColumnIndex, ValueAdversario),
    ValueAdversario == Color.

checkarPecaVizinhaValiada(TabuleiroInicial,Line,Column,Color,[Line-NewColumnIndex]):-
    NewColumnIndex is Column +1,
    ( between(0,5,Line),
     between(0,4,NewColumnIndex)
    ),
    !,
    getColorMatrix(TabuleiroInicial, Line, NewColumnIndex, ValueAdversario),
    ValueAdversario == Color.

checkarPecaVizinhaValiada(TabuleiroInicial, Line,Column,Color, [NewLineIndex-Column]):-
    NewLineIndex is Line - 1,
    ( between(0,5,NewLineIndex),
      between(0,4,Column)
    ),
    !,
    getColorMatrix(TabuleiroInicial, NewLineIndex,Column, ValueAdversario),
    ValueAdversario == Color.

checkarPecaVizinhaValiada(TabuleiroInicial, Line,Column,Color,[NewLineIndex-Column]):-
    NewLineIndex is Line + 1,
    (
    between(0,5,NewLineIndex),
    between(0,4,Column)
    ),
    !,
    getColorMatrix(TabuleiroInicial, NewLineIndex, Column, ValueAdversario),
    ValueAdversario == Color.

/**
 * jogadasValidasPorPeca(Tabuleiro,LineIndex, ColumnIndex, _CorContraria, ListaDePares)
 * @brief: devolve lista com jogadas validas para a peca em determinada celula
 *  @param +Tabuleiro: tabuleiro actual
 *  @param +LineIndex: indice da linha da celula da peca
 *  @param +ColumnIndex:  indice da coluna da celula da peca
 * @param +CorContraria eh a cor contraria ah peca que esta na posicao [LineIndex-ColumnIndex]
 *  @param -ListaDePares: lista com jogadas validas para a peca que esta na celula, no formato par linha-coluna
*/
jogadasValidasPorPeca(Tabuleiro,LineIndex, ColumnIndex, CorContraria, ListaDePares):-
    findall([Line-Column],checkarPecaVizinhaValiada(Tabuleiro, LineIndex, ColumnIndex, CorContraria,[Line-Column]), ListaDePares).

%seleccionarBotJogada(TabuleiroInicial, LineIndex, ColumnIndex, NewLineIndex, NewColumnIndex, ColorPlayer )