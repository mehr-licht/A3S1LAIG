#ifdef GL_ES
precision highp float;
#endif

varying vec4 coords;
varying vec4 normal;

void main() {
	if (coords.x > 0.0)
		gl_FragColor =  normal;//para x positivos a cor reflecte a normal
	else
	{
		gl_FragColor.rgb = abs(coords.xyz)/3.0; //para x negativos 
		gl_FragColor.a = 1.0;   //alpha=1 e rgb=coord/3(absoluto)
	}
}