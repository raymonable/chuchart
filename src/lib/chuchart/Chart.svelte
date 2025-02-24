<script lang="ts">
    import { onMount } from "svelte";
    import { ChartViewer } from "./chart";

    let canvas: HTMLCanvasElement | undefined;
    let viewer: ChartViewer | undefined;

    onMount(async () => {
        if (canvas) {
            let glContext = canvas.getContext("webgl2", {antialias: true});
            if (!glContext) return;

            viewer = new ChartViewer(glContext);
            await viewer.load({
                bpm: 100,
                notes: [
                    {
                        horizontal: 0,
                        width: 15,
                        type: 0,
                        beat: 3
                    }
                ]
            });
        }
    });
</script>
<canvas width=1920 height=1080 bind:this={canvas}></canvas>

<style lang="scss">
    canvas {
        background: url("/bg.jpg");
        background-position: center;
        background-size: cover;
    }
</style>