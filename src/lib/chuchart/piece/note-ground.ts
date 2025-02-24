import { getTexture } from "../texture";

export class GroundNoteHandler {
    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;
    }
    async load(requestShader: (name: string) => Promise<WebGLProgram | undefined>) : Promise<void> {
        if (!this.gl) return;
        
        this.program = await requestShader("note");
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

        this.texture = await getTexture(this.gl, "/chu/tex/note.png");
    }
    draw() {
        if (!this.buffer || !this.gl || !this.program) return;

        // Assign note data
        // TODO: set the size to be the number of notes we're drawing
        const noteData: Float32Array = new Float32Array(400);
        // TODO: pass in chart data and actually read it
        /*
            x (0): measure offset
            y (1): horizontal offset (0 to 15 i think)
            z (2): width
            w (3): type (1 for red, 2 for golden)
        */
        for (let i = 0; 400 > i; i++) {
            if (i % 4 != 3) {
                noteData[i] = Math.floor(Math.random() * 16);
            } else
                noteData[i] = Math.floor(Math.random() * 2) + 1;
        }
        this.gl.uniform4fv(this.gl.getUniformLocation(this.program, "datas"), noteData);

        // Assign VA pointers
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
        this.gl.vertexAttribPointer(this.gl.getAttribLocation(this.program, "vertexPosition"), 2, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.gl.getAttribLocation(this.program, "vertexPosition"));

        // Assign textures
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.uniform1i(this.gl.getUniformLocation(this.program, "tex"), 0);

        // Draw objects
        // TODO: set the size to be the number of notes we're drawing
        this.gl.drawArraysInstanced(this.gl.TRIANGLE_STRIP, 0, 4, 2);
    };

    program: WebGLProgram | undefined;
    private texture: WebGLTexture | null = null;
    private gl: WebGL2RenderingContext | null = null;
    private buffer: WebGLBuffer | null = null;
};