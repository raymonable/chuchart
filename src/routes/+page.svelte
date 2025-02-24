<script lang="ts">
    import { onMount } from "svelte";
  import { ChartViewer } from "$lib/chuchart/view";
  import { Chart } from "$lib/chuchart/chart";

  let canvas: HTMLCanvasElement | undefined;
  let viewer: ChartViewer | undefined;

  import "../app.scss";

  onMount(async () => {
      if (canvas) {
          let glContext = canvas.getContext("webgl2", {antialias: true});
          if (!glContext) return;

          viewer = new ChartViewer(glContext);
          await viewer.load(new Chart([
              {
                  horizontal: 4,
                  width: 10,
                  type: "note",
                  offset: 1
              },
              {
                  type: "flick",
                  horizontal: 4,
                  width: 10,
                  offset: 1
              }
          ]));
      }
  });
</script>

CHUNITHM Chart Viewer<br>
<canvas width=1920 height=1080 bind:this={canvas}></canvas>

<style lang="scss">
  canvas {
      background: url("/bg.jpg");
      background-position: center;
      background-size: cover;
  }
</style>