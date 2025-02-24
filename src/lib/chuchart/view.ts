import { loadShader } from "./shader";
import { glMatrix, mat4 } from "gl-matrix";

import { type Chart } from "./chart";

import { Ground } from "./piece/ground";
import { GroundNoteHandler } from "./piece/note-ground";

glMatrix.setMatrixArrayType(Array);

export interface RenderObject {
    program: WebGLProgram | undefined
    draw: (chart: Chart) => void,
    load: (requestShader: (name: string) => Promise<WebGLProgram | undefined>) => void
};

export class ChartViewer {
    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;
    };

    async load(chart: Chart) {
        if (!this.gl) return;

        this.gl.enable(this.gl.DEPTH_TEST);

        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

        await this.addHandler(new Ground(this.gl));

        await this.addHandler(new GroundNoteHandler(this.gl));

        this.chart = chart;
        this.draw();
    };
    async addHandler(object: RenderObject) {
        this.objects.push(object);
        await object.load(this.requestShader.bind(this));
    }
    requestShader(name: string) : Promise<WebGLProgram | undefined> {
        const vert = `/chu/shaders/core/${name}.glsl`;
        const frag = `/chu/shaders/pixel/${name}.glsl`;
        return new Promise((resolve, reject) => {
            if (!this.gl) return;
            loadShader(this.gl, vert, frag).then(program => {
                if(program)
                    this.gl?.useProgram(program);
                resolve(program);
            }).catch(error => {
                reject(error);
            })
        })
    };
    draw() {
        if (!this.gl) return;
        requestAnimationFrame(this.draw.bind(this));

        this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // TODO: store this as it's 4x4 array instead of calculating. Maybe we won't even need glMatrix in the future?
        const cameraMatrix = mat4.create();
        mat4.perspective(cameraMatrix, 70, 1920 / 1080, 0.1, 100);
        mat4.translate(cameraMatrix, cameraMatrix, [0.0, 0.0, -3.0]);
        mat4.rotateX(cameraMatrix, cameraMatrix, glMatrix.toRadian(-61.25));
        mat4.translate(cameraMatrix, cameraMatrix, [0.0, -1.25, 0.0]);
        
        this.objects.forEach(object => {
            if (!object.program || !this.chart) return;

            this.gl?.useProgram(object.program);
            this.gl?.uniformMatrix4fv(this.gl.getUniformLocation(object.program, "camera"), false, cameraMatrix);
            
            object.draw(this.chart);
        });
    };

    private shaders: WebGLProgram[] = [];
    private objects: RenderObject[] = [];
    private chart: Chart | null = null;
    private gl: WebGL2RenderingContext | undefined;
};