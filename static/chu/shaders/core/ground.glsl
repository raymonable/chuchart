#version 300 es
precision highp float;

uniform mat4 camera;

in vec2 vertexPosition;

out vec2 uv;

void main() {
    gl_Position = camera * vec4((vertexPosition * vec2(1.0, 10.0)) + vec2(0.0, 9.5), 0.0, 1.0);
    
    uv = ((vertexPosition + 1.0) / 2.0);
}