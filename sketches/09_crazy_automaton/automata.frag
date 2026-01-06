precision mediump float;

varying vec2 vTexCoord;
uniform sampler2D uTexture;
uniform float uN;
uniform float uM;
uniform vec3 uColors[7];
uniform float uRandomSeed;

float rand(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 + uRandomSeed);
}

void main() {
    vec2 texel = vec2(1.0 / uN, 1.0 / uM);
    vec4 center = texture2D(uTexture, vTexCoord);
    float current = center.r;

    float newState = current;

    // Loop over 8 neighbors
    for(int i=-1;i<=1;i++){
        for(int j=-1;j<=1;j++){
            if(i==0 && j==0) continue;
            vec2 offset = vec2(float(i), float(j)) * texel;
            vec4 neighbor = texture2D(uTexture, vTexCoord + offset);
            if(neighbor.r != current){
                float probability = min(0.8, 0.5 + rand(vTexCoord)*0.5);
                if(rand(vTexCoord + offset) < probability){
                    newState = neighbor.r;
                }
            }
        }
    }

    // Map state to color using if/else (no dynamic indexing)
    vec3 color;
    if(newState < 1.0/7.0) color = uColors[0];
    else if(newState < 2.0/7.0) color = uColors[1];
    else if(newState < 3.0/7.0) color = uColors[2];
    else if(newState < 4.0/7.0) color = uColors[3];
    else if(newState < 5.0/7.0) color = uColors[4];
    else if(newState < 6.0/7.0) color = uColors[5];
    else color = uColors[6];

    gl_FragColor = vec4(color, 1.0);
}
