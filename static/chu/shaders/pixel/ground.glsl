#version 300 es
precision highp float;

in vec2 uv;
out vec4 color;

float threshold = 0.001;
float barThreshold = 0.002;

bool isOnLineX(float rootPos) {
    float pos = (1.0 / 18.0) * rootPos;
    return uv.x > pos - threshold && uv.x < pos + threshold;
}
bool isOnLineY(float pos) {
    return uv.y > pos - barThreshold && uv.y < pos + barThreshold;
}
float getYAmountThreshold(float pos) {
    return ((uv.y - (pos)) / barThreshold);
}

void main() {
    float column = floor(uv.x * 18.0);
    float alpha = column == 0.0 || column == 17.0 ? 0.9 : 0.8;

    vec4 baseColor = vec4(0.0, 0.0, 0.0, alpha);

    if (isOnLineY(0.03) && !(column == 0.0 || column == 17.0) && !(isOnLineX(1.0) || isOnLineX(17.0))) {
        float amount = 1.0 - pow(abs(getYAmountThreshold(0.03)), 1.25);
        float dotted = amount < 0.75 ? sin(amount * 25.0) < 0.0 ? 1.0 : 0.0 : 0.0; // for the dashes
        color = mix(mix(vec4(1.0, 0.85 + (amount * 0.15), (amount * 1.5) - 0.5, 1.0), baseColor, (1.0 - amount)), baseColor, dotted);
    } else 
        if (isOnLineX(1.0) || isOnLineX(17.0) || isOnLineX(5.0) || isOnLineX(13.0) || isOnLineX(9.0)) {
            color = mix(baseColor, vec4(1.0, 1.0, 0.0, 1.0), 0.75 - uv.y);
        } else
            color = baseColor;
}