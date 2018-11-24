# **LAIG**

[![video](https://i.imgur.com/dxewJDX.jpg)](https://streamable.com/s/1cc3h/mcytzg)


# LogBook TODO


[TODO] Confirmar com o Luis o parsar das animacoes nos parseComponentes - line 1590
this.animations > variavel com as animacaoes 
[1.1] Done



![demo em modo CGRA][demo]

[demo]: InAGardenGreen.jpg "demo v7.0"




 # Instructions
 Abrir no terminal\
 Correr o comando\
                   » python -V\
 Correr o seguinte comando - na pasta especifica que querems usar\
                   » python -m SimpleHTTPServer 8080\
 Abrir o chrome\
 Copypaste a sequinte info\
                   » http://localhost:8080/nomedapasta/
 
# Personal webpage
 Caso a àrea do estudante seja posta online\
  » http://paginas.fe.up.pt/~eiXXXX/mytest \
  Usar a área web de estudante da FEUP:​ colocar o projeto uma pasta dentro da
pasta public_html da conta do estudante, e acedendo à mesma através do
endereço público http://paginas.fe.up.pt/~eiXXXX/mytest . Neste caso, ficará
por omissão acessível a todos (o que pode ser contornado, p.ex. com um
ficheiro de controlo de acesso .htaccess). Tem também a desvantagem de
implicar a edição/atualização dos ficheiros no servidor da FEUP, e obrigar a uma
ligação à rede da FEUP para poder editar/carregar a aplicação
 
 
# Shortcuts

Google Chrome - Dev tools Ctrl-Shift-I\
Botao direito -  deslocar lateralmente a camera\
Botao esquerdo - roda a cena   ou CTRL +\
Botao central - aproximar e afastar


#  Estrutura biblioteca ‘WebCGF’

A biblioteca WebCGF​ (Web Computer Graphics @ FEUP) - tem como classes principais as seguintes:\
● CGFapplication ​(+) ​- Gere as questões genéricas de inicialização da aplicação e bibliotecas de
apoio, e interliga os outros componentes\
● CGFscene ​(*) ​- É responsável pela inicialização, gestão e desenho da cena\
● CGFinterface ​(*) ​- É usada para construir e gerir a interface com o utilizador; pode aceder ao
estado interno da cena para, por exemplo, ativar ou desativar funcionalidades (p.ex. luzes,
animações)\
A biblioteca contempla também as seguintes classes que representam entidades que podem integrar
uma cena (lista não exaustiva):\
● CGFobject ​(*) ​- Representa um objeto genérico, que deve implementar o método display()​; os
objetos a serem criados devem ser sub-classes de CGFObject\
● CGFlight ​(+) ​- Armazena alguma informação associada a uma fonte de luz (poderá ser
estendida por sub-classes para implementar características adicionais)\
● CGFcamera ​(+) ​- Armazena a informação associada a uma câmara

# Remember functions\
init()\
»  É aqui que tipicamente se inicializam variáveis, criam objetos ou são feitos cálculos
intensivos cujos resultados podem ser armazenados para posterior consulta

display()\
»  Contém o código que efetivamente desenha a cena repetidamente. Este método
será o foco deste primeiro trabalho.\
dividido em três secções:\
        %Inicialização do fundo, câmara e eixos\
        % Transformações geométricas\
        % Desenho de primitivas\ ​
        
        
# Remember Criar OBJECTO 3D \
Dessa forma, para criar um determinado objeto 3D, podemos simplesmente:\
» criar uma sub-classe da CGFobject​, p.ex. MyObject\
» implementar o método initBuffers​, onde\
» declaramos os arrays acima referidos,\
» invocamos a função initGLBuffers ​para a informação ser passada para o WebGL\
» Na nossa cena:\
» Criar e inicializar uma instância do novo objeto no método init() da cena\
» Invocar o método display()​ dessa instância do objeto no método display() da cena\

# Final Data\
turma1\
grupo5

up201607946 Luis Oliveira\
up201607780 Ricardo Silva

Graphical Interface Applications Laboratory - MIEIC FEUP


Projects done in colaboration with [TejInaco](https://github.com/TejInaco)

