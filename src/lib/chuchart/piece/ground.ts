export class Ground {
    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;
    }
    async load(requestShader: (name: string) => Promise<WebGLProgram | undefined>) : Promise<void> {
        if (!this.gl) return;
        
        this.program = await requestShader("ground");
        if (!this.program) return;
        this.gl.useProgram(this.program);

        this.buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
            1.0, 1.0,
            -1.0, 1.0,
            1.0, -1.0,
            -1.0, -1.0
        ]), this.gl.STATIC_DRAW);
    }
    draw() {
        if (!this.buffer || !this.gl || !this.program) return;

        // Assign VA pointers
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
        this.gl.vertexAttribPointer(this.gl.getAttribLocation(this.program, "vertexPosition"), 2, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.gl.getAttribLocation(this.program, "vertexPosition"));

        // Draw objects
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    };

    program: WebGLProgram | undefined;
    private gl: WebGL2RenderingContext | null = null;
    private buffer: WebGLBuffer | null = null;
};