import { getTexture } from "../texture";
import { Chart } from "../chart";

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
    draw(chart: Chart) {
        if (!this.buffer || !this.gl || !this.program) return;

        const notes = chart.access("note");
        const noteData: Float32Array = new Float32Array(notes.length * 4);
        notes.forEach((note, idx) => {
            noteData[(idx * 4) + 0] = note.offset;
            noteData[(idx * 4) + 1] = note.horizontal;
            noteData[(idx * 4) + 2] = note.width ?? 2;
            noteData[(idx * 4) + 3] = note.subtype ?? 0;
        });
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
        this.gl.drawArraysInstanced(this.gl.TRIANGLE_STRIP, 0, 4, notes.length);
    };

    program: WebGLProgram | undefined;
    private texture: WebGLTexture | null = null;
    private gl: WebGL2RenderingContext | null = null;
    private buffer: WebGLBuffer | null = null;
};