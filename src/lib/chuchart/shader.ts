export function compileShader(gl: WebGL2RenderingContext, source: string, type: number) : WebGLShader | undefined {
    const shader = gl.createShader(type);
    if (!shader) return;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        throw new Error(`${type == gl.VERTEX_SHADER ? "V" : "F"}${gl.getShaderInfoLog(shader) ?? "?"}`);

    return shader;
};

export async function loadShader(gl: WebGL2RenderingContext, vertexPath: string, fragmentPath: string) : Promise<WebGLProgram | undefined> {
    const vertexSource = await fetch(vertexPath).then(r => r.text());
    const fragmentSource = await fetch(fragmentPath).then(r => r.text());

    const vertexShader = compileShader(gl, vertexSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(gl, fragmentSource, gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        throw new Error(gl.getProgramInfoLog(program) ?? "?");

    return program;
};