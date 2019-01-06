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

	color.r = colorFactor * selectedRed + (1.0 - colorFactor) * color.r;
	color.g = colorFactor * selectedGreen + (1.0 - colorFactor) * color.g;
	color.b = colorFactor * selectedBlue + (1.0 - colorFactor) * color.b;

	gl_FragColor = color;
}