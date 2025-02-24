export function getTexture(gl: WebGL2RenderingContext, path: string) : Promise<WebGLTexture | null> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = path;
        image.onload = () => {
            const texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(
                gl.TEXTURE_2D,
                0,
                gl.RGBA,
                gl.RGBA,
                gl.UNSIGNED_BYTE,
                image,
            );
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            resolve(texture);
        };
        image.onerror = reject;
    });
};