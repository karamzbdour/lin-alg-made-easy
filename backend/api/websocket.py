from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import json
import struct
from geometry.generator import generate_mesh
from core.transformations import apply_transformation

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

manager = ConnectionManager()

@router.websocket("/ws/{shape_type}")
async def websocket_endpoint(websocket: WebSocket, shape_type: str):
    await manager.connect(websocket)
    
    try:
        # 1. Handshake: Generate and send mesh topology as JSON
        mesh_data = generate_mesh(shape_type)
        base_vertices = mesh_data['vertices']
        base_indices = mesh_data['indices']
        
        init_payload = {
            "type": "init",
            "vertices": base_vertices,
            "indices": base_indices
        }
        await websocket.send_text(json.dumps(init_payload))
        
        # 2. Real-Time Loop: Await matrix, transform, and send binary buffer
        while True:
            # Client sends 3x3 transformation matrix as a JSON
            data = await websocket.receive_text()
            transform_matrix = json.loads(data)
            
            # Apply transformation
            transformed_vertices = apply_transformation(base_vertices, transform_matrix)
            
            # Serialise the transformed float list into raw binary buffer
            binary_buffer = struct.pack(f"{len(transformed_vertices)}f", *transformed_vertices)
            
            # Send only binary vertex data to save bandwidth
            await websocket.send_bytes(binary_buffer)

    except WebSocketDisconnect:
        manager.disconnect(websocket)
