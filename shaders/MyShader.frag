#ifdef GL_ES
precision highp float;
#endif


varying vec4 vFinalColor;
varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform float timeFactor;
uniform bool uUseTexture;
uniform vec4 uPickColor;


vec4 pink = vec4(255.0/255.0, 84.0/255.0, 167.0/255.0, 1);
vec4 red = vec4(255.0/255.0, 0.0/255.0, 0.0/255.0, 1);
vec4 blue = vec4(0.0/255.0, 0.0/255.0, 255.0/255.0, 1);
vec4 yellow = vec4(255.0/255.0, 215.0/255.0, 0.0/255.0, 1);
vec4 white = vec4(255.0/255.0, 255.0/255.0, 255.0/255.0, 1);
vec4 gray = vec4(128.0/255.0, 128.0/255.0, 128.0/255.0, 1);
vec4 black = vec4(0.0/255.0, 0.0/255.0, 0.0/255.0, 1);

void main() {


	vec4 newColor = ((white + vFinalColor)/2.0)*timeFactor;
	// Branching should be reduced to a minimal.
	// When based on a non-changing uniform, it is usually optimized.
	if (uUseTexture)
	{
		vec4 textureColor = texture2D(uSampler, vTextureCoord);
		gl_FragColor = textureColor * newColor;
	}
	else
		gl_FragColor = newColor;

}