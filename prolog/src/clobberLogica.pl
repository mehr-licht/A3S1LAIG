/**
* checkDifferenceIndexs(+RowIndex,+ColumnIndex,+PP_RowIndex,+PP_ColumnIndex)
* @brief Certifica o tipo de movimentacao conforme se queira mover 
* entre linhas ou colunas (com diferença de 1 indice)
* @param +RowIndex: linha actual
* @param +ColumnIndex: coluna actual
* @param +PP_RowIndex: praxima linha
* @param +PP_ColumnIndex: proxima coluna
*/
checkDifferenceIndexs(RowIndex,ColumnIndex,PP_RowIndex,PP_ColumnIndex):-
        RowIndex - PP_RowIndex =:= 0,
        !,
        abs(ColumnIndex - PP_ColumnIndex) =:= 1.
checkDifferenceIndexs(RowIndex,_ColumnIndex,PP_RowIndex,_PP_ColumnIndex):-
        abs(RowIndex - PP_RowIndex) =:= 1.
        
/**
 * move(+TabuleiroInicial, +RowIndex, +ColumnIndex, +PP_RowIndex, +PP_ColumnIndex, -TabuleiroFinal, +Color)
 * @brief Validar  e executar a jogada das pecas brancas
 * @param +TabuleiroInicial -> board status before the move
 * @param +RowIndex -> linha da peca selecionada que vai se movimentar 
 * @param +ColumnIndex -> coluna da peca selecionada que vai se movimentar
 * @param +PP_RowIndex -> Linha da P.roxima P.osicao 
 * @param +PP_ColumnIndex -> Coluna da P.roxima P.osicao
 * @param +Color -> black or white : which piece to move
 * @param -TabuleiroFinal -> board status after the move   
*/
move(TabuleiroInicial, RowIndex,ColumnIndex,PP_RowIndex,PP_ColumnIndex, TabuleiroFinal, white):-
    getValueFromMatrix(TabuleiroInicial, RowIndex, ColumnIndex, ValueJogador),
    ValueJogador == white, 
    write('Peca escolhida valida\n'),
    getValueFromMatrix(TabuleiroInicial, PP_RowIndex, PP_ColumnIndex, ValueAdversario), 
    ValueAdversario == black,
    write('Jogada Valida'),
    replaceInMatrix(TabuleiroInicial, PP_RowIndex, PP_ColumnIndex, white, TabuleiroNovo),
    replaceInMatrix(TabuleiroNovo, RowIndex, ColumnIndex, empty, TabuleiroFinal).

/*
* @brief (vide anterior) validar a jogada das pecas pretas
*/
move(TabuleiroInicial, RowIndex,ColumnIndex,PP_RowIndex,PP_ColumnIndex, TabuleiroFinal, black):-
    getValueFromMatrix(TabuleiroInicial, RowIndex, ColumnIndex, ValueJogador),
    ValueJogador == black, 
    write('Peca escolhida valida\n'),
    getValueFromMatrix(TabuleiroInicial, PP_RowIndex, PP_ColumnIndex, ValueAdversario),
    ValueAdversario == white,
    write('Jogada Valida'),
    replaceInMatrix(TabuleiroInicial, PP_RowIndex, PP_ColumnIndex, black, TabuleiroNovo),
    replaceInMatrix(TabuleiroNovo, RowIndex, ColumnIndex, empty, TabuleiroFinal).


/**
 * selecionarProximaPosicao(+TabuleiroInicial, -RowIndex, -ColumnIndex, +ColorPlayer)
 * @brief Obtem os valores da proxima posicao pretendida e verifica a sua validade
 * @param +TabuleiroInicial: tabuleiro actual
 * @param -RowIndex: Linha pretendida
 * @param -ColumnIndex: Coluna pretendida
 * @param +ColorPlayer: cor do adversário
 *  
 */
 selecionarProximaPosicao(TabuleiroInicial, RowIndex, ColumnIndex, ColorPlayer):-
        manageRow(NewRow),
        manageColumn(NewColumn),
        ColumnIndex is NewColumn -1,
        RowIndex is NewRow -1,
        getValueFromMatrix(TabuleiroInicial, RowIndex, ColumnIndex, ValueAdversario),
        ValueAdversario = ColorPlayer,
        !,
             write('Posicao escolhida valida\n').
selecionarProximaPosicao(TabuleiroInicial, RowIndex, ColumnIndex, ColorPlayer):-
        write('Posicao INVALIDA - seleccionar Proxima Posicao em que esteja uma peca '),write(ColorPlayer),nl, 
        selecionarProximaPosicao(TabuleiroInicial, RowIndex, ColumnIndex, ColorPlayer).
        
/**
 * selecionarPeca(+TabuleiroInicial, -NewRow, -NewColumn, -RowIndex, -ColumnIndex, +ColorPlayer)
 * @brief Selecionar a peca do jogador com certificacao da sua validade da peca seleccionada (white AND black)
 * Le o input de linha e coluna
 * Calcula os indexes para a peca
 * Procura no tabuleiro e verifica se a cor da posicao eh igual a calculada no tabuleiro
 * @param +TabuleiroInicial: tabuleiro actual
 * @param -NewRow: linha escolhida
 * @param -NewColumn: coluna escolhida
 * @param -RowIndex: indice da linha escolhida
 * @param -ColumnIndex: indice da coluna escolhida
 * @param +ColorPlayer: cor da peca a ser seleccionada para mover
 */ 
selecionarPeca(TabuleiroInicial, NewRow, NewColumn, RowIndex, ColumnIndex, ColorPlayer):-
        manageRow(NewRow),
        manageColumn(NewColumn),
        ColumnIndex is NewColumn -1,
        RowIndex is NewRow -1,
        getValueFromMatrix(TabuleiroInicial, RowIndex, ColumnIndex, ValueAdversario),
        ValueAdversario = ColorPlayer,
        !,
        write('Peca escolhida valida\n').
selecionarPeca(TabuleiroInicial, NewRow,NewColumn,RowIndex,ColumnIndex, ColorPlayer):-
        write('Peca NAO valida - tem de escolher uma peca '),write(ColorPlayer),nl,
        selecionarPeca(TabuleiroInicial, NewRow,NewColumn,RowIndex,ColumnIndex, ColorPlayer).


%##########################################################################################################################
%##########################################################################################################################        
/**
 * @brief Jogada do P1 - pecas white
 * NOTA: numero de linha 1-6, numero de coluna 1-5, indexL 0-5 indeC 0-4 
*/
%playJogador_1_Turno(TabuleiroInicial, NovoTabuleiro, 'P'):-
%        gameOver(Tabuleiro, white),
%        !,
%        anounce(white).
/**
 * playJogador_1_Turno(+TabuleiroInicial, -NovoTabuleiro, +TypeOfPlayer)
 * @brief turno do jogador 1 (brancas), pergunta qual a peca e para onde a mover, verificando validades
 * @param +TabuleiroInicial: tabuleiro actual
 * @param -NovoTabuleiroInicial: tabuleiro actualizado apos a jogada
 * @param +TypeOfPlayer (P=person; A=Bot Aleatorio; I=Bot Inteligente)  
 */
playJogador_1_Turno(TabuleiroInicial, NovoTabuleiro, 'P'):- 
        write('Jogador 1  -> pecas brancas\n'), 
        write('Escolha a peca white a mover:\n'),
        selecionarPeca(TabuleiroInicial, _NewRow, _NewColumn, RowIndex, ColumnIndex, white), 
        write('Escolha a posicao para mover a peca white:\n'),
        selecionarProximaPosicao(TabuleiroInicial, PP_RowIndex,PP_ColumnIndex, black),
        checkDifferenceIndexs(RowIndex,ColumnIndex,PP_RowIndex,PP_ColumnIndex),
        !,
        move(TabuleiroInicial, RowIndex,ColumnIndex,PP_RowIndex,PP_ColumnIndex,  NovoTabuleiro, white),
        write('####   Valid move  ######\n').
       % gameOver(NovoTabuleiro, black).
playJogador_1_Turno(TabuleiroInicial, NovoTabuleiro, 'P'):-
        write('Posicao NAO VALIDA - tem de escolher uma peca white'),
        playJogador_1_Turno(TabuleiroInicial, NovoTabuleiro, 'P').

playJogador_1_Turno(TabuleiroInicial, NovoTabuleiro, 'C'):-
        write('Jogador Bot -> pecas brancas\n'), 
        choose_move(TabuleiroInicial, NovoTabuleiro,white, _Nivel).



/**
 * playJogador_2_Turno(+TabuleiroInicial, -NovoTabuleiro, +TypeOfPlayer)
 * @brief turno do jogador 2 (pretas), pergunta qual a peca e para onde a mover, verificando validades
 * @param +TabuleiroInicial: tabuleiro actual
 * @param -NovoTabuleiroInicial: tabuleiro actualizado apos a jogada
 * @param +TypeOfPlayer (P=person; A=Bot Aleatorio; I=Bot Inteligente)
 */
playJogador_2_Turno(TabuleiroInicial, NovoTabuleiro, 'P'):-
        write('Jogador 2 -> pecas pretas\n'), 
        write('Escolha a peca black a mover:\n'),
        selecionarPeca(TabuleiroInicial, _NewRow, _NewColumn, RowIndex, ColumnIndex, black),
        write('Escolha a posicao para mover a peca black:\n'),
        selecionarProximaPosicao(TabuleiroInicial, PP_RowIndex, PP_ColumnIndex, white),
        checkDifferenceIndexs(RowIndex,ColumnIndex,PP_RowIndex,PP_ColumnIndex),
        !,
        move(TabuleiroInicial, RowIndex,ColumnIndex,PP_RowIndex,PP_ColumnIndex, NovoTabuleiro, black),
        write('####   Valid move  ######\n').

playJogador_2_Turno(TabuleiroInicial, NovoTabuleiro, 'P'):-
        write('Posicao NAO VALIDA - tem de escolher uma peca black'),
        playJogador_2_Turno(TabuleiroInicial, NovoTabuleiro, 'P').
%bot random
playJogador_2_Turno(TabuleiroInicial, NovoTabuleiro, 'C'):- 
       choose_move(TabuleiroInicial, NovoTabuleiro,black, _Nivel).
%bot intel
playJogador_2_Turno(_TabuleiroInicial,_NovoTabuleiro, 'I'):- 
        write('Nothing done yet').

%##################################################### »»» Anuncio de FINAL DE JOGO >> BEGIN
/**
 * anunciamento(+Color)
 * @brief Anuncia que quem ia jogar perdeu o jogo
 * @param +Color: cor das pecas que perdem o jogo
 */
anunciamento(Color):-
        nl,nl, write(Color),
        write(' pieces LOOSE THE GAME'),nl,
        abort.
%##################################################### »»» Anuncio de FINAL DE JOGO »» END
%#########################################################################  GAME OVER SECTION  >>> BEGIN
/**
 * @brief condicao de terminacao do jogo. se lista de jogadas possiveis de todas as pecas de uma cor for vazia esse player ja nao joga e perdeu o jogo
 * gameOver(+Tabuleiro, -Looser) 
 * @param -Looser: Color do jogador que perde
 * @param Tabuleiro: tabuleiro actual
*/

gameOver(Tabuleiro, Looser):-
       % Looser == black, CorContraria = white,
        ( posicoesPecasNoTabuleiro(Tabuleiro, black,ListaDePecasNoTabuleiro),
          loop(Tabuleiro, white, ListaDePecasNoTabuleiro, Total),
          Total =:= 0, Looser == black)
        ;
        ( posicoesPecasNoTabuleiro(Tabuleiro, white,ListaDePecasNoTabuleiro),
          loop(Tabuleiro, black, ListaDePecasNoTabuleiro, Total),
          Total =:= 0, Looser == white
        )
        ;
        Looser == empty.
 %       nl,
  %      write('total de Jogadas'), write(Total), nl.
 %       write('ListadePares'), write(ListaDePares),nl,
%write('ListaFinal : '), write(ListaFinal), nl.
    %    ListaDePares == [].
     %   Total =:= 0,
     %   !.      
   %     anunciamento(Looser).

%gameOver(Tabuleiro, Looser):-
%        Looser == white,
%        CorContraria = black,
%        posicoesPecasNoTabuleiro(Tabuleiro, Looser,ListaDePecasNoTabuleiro), 
%        loop(Tabuleiro, CorContraria, ListaDePecasNoTabuleiro, Total),
 %       nl,
 %       write('white total de Jogadas'), write(Total), nl.
%        Total =:= 0,
%        !.
   %     anunciamento(Looser).
%gameOver( _, _):- false.
/**
 * loop(+Tabuleiro, +CorContraria, +Lista, -Total).
 * @brief descobre o numero total de jogadas validas 
 * @param +Tabuleiro: tabuleiro actual
 * @param +CorContraria: cor do adversario
 * @param +Lista: celulas onde tem pecas
 * @param -Total: total de jogadas validas 
 */
loop(_,_,[],0).
loop(Tabuleiro, CorContraria, [[Line-Column]|Tail], Total):-
        valid_moves(Tabuleiro, Line, Column, CorContraria, ListaDePares ),
        length(ListaDePares, Tamanho),
        loop(Tabuleiro, CorContraria, Tail, AuxTotal),
        Total is (AuxTotal + Tamanho).
%#########################################################################  GAME OVER SECTION  >>> END

/**
 * @brief Alterna a sequencia de jogadas
 * gameLoop(+Tabuleiro, +Jogador1, +Jogador2) 
 * @param +Tabuleiro: tabuleiro actual
 * @param +Jogador1: brancas
 * @param +Jogador2: pretas
 * Chamada recursiva no fim
*/
gameLoop(Tabuleiro, Jogador1, Jogador2):- 
        printBoard(Tabuleiro),
                playJogador_1_Turno(Tabuleiro, NovoTabuleiro, Jogador1), %    Jogador 1 ->(Tabuleiro , 'branca' ) 
                gameOver(NovoTabuleiro, black),
                printBoard(NovoTabuleiro),
                playJogador_2_Turno(NovoTabuleiro, FinalTabuleiro, Jogador2), %  Jogador 2-> (Tabuleiro, 'preta')
                gameOver(FinalTabuleiro, white), 
                gameLoop(FinalTabuleiro, Jogador1, Jogador2).

/**
 * @brief Inicia o jogo
 * @ startGame(+Jogador1,+Jogador2) 
 * @param +Jogador1: brancas
 * @param +Jogador2: pretas
*/
startGame(Jogador1,Jogador2):- initialBoard(TabuleiroInicial), 
                                gameLoop(TabuleiroInicial, Jogador1, Jogador2).
