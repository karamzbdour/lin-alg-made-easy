import pyvista as pv
import numpy as np
from typing import Dict, Any

def generate_mesh(shape_type: str = 'cube') -> Dict[str, Any]:
    """
    Generates a parameterized 3D surface mesh and serialises its geometry 
    for WebGL consumption.
    """
    if shape_type == 'sphere': 
        mesh = pv.Sphere(radius=1.0, theta_resolution=30, phi_resolution=30)
    elif shape_type == 'cube':
        mesh = pv.Box(bounds=(0,1,0,1,0,1))
    else:
        raise ValueError(f"Unsupported shape type: {shape_type}")

    # This is critical because WebGL primitives are constructed from triangles.
    mesh = mesh.triangulate()
    
    # We cast to float32 since WebGL uses 32-bit floats.
    vertices = np.array(mesh.points, dtype=np.float32)
    

    # Extract vertex indices for each triangle. Each face is represented as [3, i1, i2, i3].
    faces_raw = mesh.faces.reshape(-1, 4)
    indices = np.array(faces_raw[:, 1:], dtype=np.uint16)
    
    # Flatten arrays for serialisation over WebSockets
    return {
        "vertices": vertices.flatten().tolist(),
        "indices": indices.flatten().tolist()
    }
