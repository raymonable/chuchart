export interface ChartNote {
    type: "note" | "slide" | "air" | "flick";
    subtype?: number;

    width?: number; /* 0 to 15 */
    horizontal: number; /* 0 to 15 */ 
    height?: number; // only for air
    offset: number; // in measures (and decimal)
};
export class Chart {
    // TODO: add howler audio source
    constructor(data: ChartNote[]) {
        this.data = data;
    };

    access(type: "note" | "slide" | "air" | "flick"): Array<ChartNote> {
        // TODO: offload currently visible objects (based off measure) to a separate array 
        //                  to avoid filtering through the array several times every frame
        return this.data.filter(n => n.type == type);
    };
    private data: ChartNote[] = [];
};