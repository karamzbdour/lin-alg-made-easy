export class WSClient {
  private ws: WebSocket | null = null;
  public onInit: ((vertices: Float32Array, indices: Uint16Array) => void) | null = null;
  public onUpdate: ((vertices: Float32Array) => void) | null = null;
  
  constructor(private url: string) {}

  connect() {
    this.ws = new WebSocket(this.url);
    this.ws.binaryType = 'arraybuffer'; // Crucial for receiving binary buffers

    this.ws.onopen = () => console.log("WebSocket connected");
    this.ws.onclose = () => console.log("WebSocket disconnected");
    
    this.ws.onmessage = (event) => {
      if (typeof event.data === 'string') {
        const payload = JSON.parse(event.data);
        if (payload.type === 'init' && this.onInit) {
          const vertices = new Float32Array(payload.vertices);
          const indices = new Uint16Array(payload.indices);
          this.onInit(vertices, indices);
        }
      } else if (event.data instanceof ArrayBuffer) {
        if (this.onUpdate) {
          const vertices = new Float32Array(event.data);
          this.onUpdate(vertices);
        }
      }
    };
  }

  sendMatrix(matrix: number[][]) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(matrix));
    }
  }
}
