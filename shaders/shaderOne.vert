#ifdef GL_ES
precision highp float;
#endif


/*
Textures are referenced as uniforms of type int, in which the uniform’s value defines the texture unit to
be used
• A uniform sampler2D assigned with the value 0 gets linked to GL_TEXTURE0
*/

//IN para vertexShader
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

//globais, unicos de cada shader mas acessiveis de qq um, static e redefinidos lá fora
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform sampler2D uSampler;

uniform float waterscale;
uniform float texscale;
uniform float timeFactor;
uniform float normScale;

//passar para frag para extrapolar para cada pixel, aqui só para vertices
varying vec4 coords;
varying vec4 normal;
varying vec2 vTextureCoord;

uniform sampler2D colormap;

uniform float factor;

vec4 getNoise(vec2 uv){
    vec2 uv0 = (uv/103.0)+vec2(factor/17.0, factor/29.0);
    vec2 uv1 = uv/107.0-vec2(factor/-19.0, factor/31.0);
    vec2 uv2 = uv/vec2(897.0, 983.0)+vec2(factor/101.0, factor/97.0);
    vec2 uv3 = uv/vec2(991.0, 877.0)-vec2(factor/109.0, factor/-113.0);
    vec4 noise = (texture2D(colormap, uv0)) +
                 (texture2D(colormap, uv1)) +
                 (texture2D(colormap, uv2)) +
                 (texture2D(colormap, uv3));
    return noise*0.5-1.0;
}

//no main definimos contas e o que passa para fragShader. se no fragShader tiver vars com o mesmo nome entao recebe os valores
void main() {
	vec3 offset=vec3(0.0,0.0,0.0);
	vTextureCoord = aTextureCoord;
    offset = aVertexNormal*waterscale*(getNoise(aTextureCoord).b/10.0);
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition+offset, texscale);
}
