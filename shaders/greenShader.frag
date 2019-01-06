#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float timeFactor;
uniform float selectedRed;
uniform float selectedGreen;
uniform float selectedBlue;

void main() {

    vec4 color = texture2D(uSampler, vTextureCoord);
    float colorFactor = abs(cos(timeFactor));

	color.r = (1.0 - colorFactor) * color.r;
	color.g = colorFactor * selectedGreen + (1.0 - colorFactor) * color.g;
	color.b =+ (1.0 - colorFactor) * color.b;
	color.a = 0.7;

	gl_FragColor = color;
}