#version 300 es
precision highp float;

uniform mat4 camera;
uniform vec4 datas[100];

in vec2 vertexPosition;

out vec2 uv;
out vec2 texData;

void main() {
    vec4 data = datas[gl_InstanceID];
    float hOffset = (1.0 / 9.0) * ((data.y + 1.0) + (data.z / 2.0));

    texData = data.zw;  
    vec2 note = (vertexPosition * vec2(data.z / 18.0, 0.125)) - vec2(1.0 - hOffset, 0.0) + vec2(0.0, data.x);

    gl_Position = camera * vec4(note, 0.05, 1.0);
    uv = ((vertexPosition + 1.0) / 2.0);
    uv.y = 1.0 - uv.y;
}