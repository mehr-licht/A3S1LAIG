attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;

//****************************novos em relacao a texture2.vert
uniform sampler2D uSampler2;

uniform float normScale;

uniform vec2 dims;
uniform vec2 charCoords;
//*************************************************



void main() {
	vec3 offset=vec3(0.0,0.0,0.0);  // NOVO
	
	vTextureCoord = aTextureCoord;

	if (texture2D(uSampler2, vec2(0.0,0.1)+vTextureCoord).b > 0.5)
		offset=aVertexNormal*normScale*0.1;
//ESTE IF THEN NOVO
		

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition+offset, 1.0);  //OFFSET NOVO
}



//UMA DAS TEXTURAS COM VOLUME POR CIMA DE OUTRA
//PARA APENAS UMA TEXTURA EM CIMA DE OUTRA VER texture2.vert