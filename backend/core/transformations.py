import numpy as np

def apply_transformation(vertices: list[float], matrix: list[list[float]]) -> list[float]:
    """
    Applies a transformation represented by a 3x3 matrix to a flat list of vertices in R^3.
    
    :param vertices: Flat list of floats [x0, y0, z0, x1, y1, z1, ...]
    :param matrix: 3x3 list of floats representing the linear transformation
    :return: Flat list of transformed floats
    """
    # 1. Convert the flat list to a structured 2D array of shape (N, 3)
    v_array = np.array(vertices, dtype=np.float32).reshape(-1, 3)
    
    # 2. Convert the input matrix list to a 3x3 NumPy array
    m_array = np.array(matrix, dtype=np.float32)
    
    # 3. Apply Transformation in batch
    transformed_v = v_array @ m_array.T
    
    # 4. Flatten back to 1D array for buffer serialisation back to the frontend
    return transformed_v.flatten().tolist()
