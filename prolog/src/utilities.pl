/**- Formato Idade Mehdia
* getValueFromListV2(+Lista, +Index, -Value)
* @brief percorre lista(linha) e devolve valor em determinado indice(celula)
* @param +Lista linha da matriz(tabuleiro)
* @param +Index indice na linha(celula)
* @param -Value qual a peca que esta na celula pesquisada
*/
getValueFromListV2([H|_T], 0, Value) :-
        Value = H.
%funcao recursiva para obter o valor na lista
getValueFromListV2([_H|T], Index, Value) :-
        Index >= 0,
        Index1 is Index - 1,
        getValueFromList(T, Index1, Value).


/**
 * getValueFromMatrixV2(+Lista, +Row, +Column, -Value)
* @brief percorre matriz(tabuleiro) e devolve valor em determinada celula, chamando getValueFromListV2 depois de ter chegado a coluna em causa
* @param +Lista matriz(tabuleiro)
* @param +Row indice da linha
* @param +Column indice da coluna
* @param -Value qual a peca que esta na celula pesquisada
*/
getValueFromMatrixV2([H|_T], 0, Column, Value) :-
        getValueFromList(H, Column, Value).
%Percorre cada linha - funcao recursiva que em cada lista chama o getValueFromLis
getValueFromMatrixV2([_H|T], Row, Column, Value) :-
        Row >= 0,
        Row1 is Row - 1,
        getValueFromMatrixV2(T, Row1, Column, Value).















/**---------------------------------------------------------------
* funcoes de complemento - Antes da descoberta de uma coisa chamafa library(lists)
* caso base o Value vai se juntar ah nova lista
* replaceInLine(+Current, +Index, +Value, -New)
* @brief percorre a matriz(tabuleiro) ate linha em causa e depois chama replaceInList, substituindo o valor da celula em causa
* @param +Current: tabuleiro actual
* @param +Index: indice da celula
* @param +Value: valor da celula
* @param -New tabuleiro futuro
*/
replaceInList([_H|T], 0, Value, [Value|T]).
% funcao de chamada recursiva para percorrer a lsita
replaceInList([H|T], Index, Value, [H|TNew]) :-
        Index > 0,
        Index1 is Index - 1,
        replaceInList(T, Index1, Value, TNew).

/*----------------------------------------------------------------
* caso base Substituir um valor na matrix em complemento com as anteriores
* replaceInMatrix(+Current, +Row, +Column, +Value, -New)
* @brief percorre a matriz(tabuleiro) ate linha em causa e depois chama replaceInList, substituindo o valor da celula em causa
* @param +Current: tabuleiro actual
* @param +Row: linha da celula
* @param +Column: coluna da celula
* @param +Value: valor da celula
* @param -New tabuleiro futuro
*/
replaceInMatrix([H|T], 0, Column,Value, [HNew|T]) :-
        replaceInList(H, Column, Value, HNew).
% percorrer a lista de listas
replaceInMatrix([H|T], Row, Column, Value, [H|TNew]) :-
        Row > 0,
        Row1 is Row - 1,
        replaceInMatrix(T, Row1, Column, Value, TNew).


/**- Formato Idade Mehdia
* getValueFromListV2(+Lista, +Index, -Value)
* @brief percorre lista(linha) e devolve valor em determinado indice(celula)
* @param +Lista linha da matriz(tabuleiro)
* @param +Index indice na linha(celula)
* @param -Value qual a peca que esta na celula pesquisada
*/
getValueFromList([H|_T], 0, Value) :-
        Value = H.
%funcao recursiva para obter o valor na lista
getValueFromList([_H|T], Index, Value) :-
        Index > 0,
        Index1 is Index - 1,
        getValueFromList(T, Index1, Value).


/*----------------------------------------------------------------
* Uma matrix eh uma lista de listas
* Percorre uma linha em primeiro lugar, e depois com o getValueFrom List retorna o Valor
* Caso base quando estamos na ultima linha
 * getValueFromMatrixV2(+Lista, +Row, +Column, -Value)
* @brief percorre matriz(tabuleiro) e devolve valor em determinada celula, chamando getValueFromListV2 depois de ter chegado a coluna em causa
* @param +Lista matriz(tabuleiro)
* @param +Row indice da linha
* @param +Column indice da coluna
* @param -Value qual a peca que esta na celula pesquisada
*/
getValueFromMatrix([H|_T], 0, Column, Value) :-
        getValueFromList(H, Column, Value).
%Percorre cada linha - funcao recursiva que em cada lista chama o getValueFromLis
getValueFromMatrix([_H|T], Row, Column, Value) :-
        Row > 0,
        Row1 is Row - 1,
        getValueFromMatrix(T, Row1, Column, Value).
