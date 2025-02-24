#version 300 es
precision highp float;

uniform sampler2D tex;

in vec2 texData;
in vec2 uv;
out vec4 color;

void main() {
    float width = texData.x;
    vec2 uvOffset = (uv * vec2(1.0, 0.125 * texData.y));

    float center = (1.0 / width);
    vec2 texUV = uvOffset;

    if (center > uv.x) {
        texUV *= vec2(width / 2.0, 1.0);
    } else if (1.0 - center < uv.x) {
        texUV.x = 1.0 - texUV.x;
        texUV *= vec2(width / 2.0, 1.0);
    } else
        texUV = texUV * vec2(0.0, 1.0) + vec2(0.5, 0.0);
    color = texture(tex, texUV);//vec4(texUV, 0.0, 1.0);
}