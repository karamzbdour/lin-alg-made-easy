from geometry.generator import generate_mesh
from core.transformations import apply_transformation

def run_tests():
    print("--- Testing Maths Core & Mesh Generator ---")
    
    # 1. Generate Mesh
    print("\n[1/3] Generating sphere mesh...")
    mesh_data = generate_mesh('sphere')
    vertices = mesh_data['vertices']
    indices = mesh_data['indices']
    
    num_verts = len(vertices) // 3
    num_faces = len(indices) // 3
    print(f"Generated {num_verts} vertices and {num_faces} triangular faces.")
    
    # 2. Define a Transformation Matrix (Scaling by 2 in the X axis)
    transform_matrix = [
        [2.0, 0.0, 0.0],
        [0.0, 1.0, 0.0],
        [0.0, 0.0, 1.0]
    ]
    
    # 3. Apply Transformation
    print("\n[2/3] Applying transformation matrix:")
    for row in transform_matrix:
        print(f"  {row}")
        
    transformed_vertices = apply_transformation(vertices, transform_matrix)
    
    # 4. Validate output on first vertex
    print("\n[3/3] Validating results...")
    
    v_0_orig = vertices[0:3]
    v_0_trans = transformed_vertices[0:3]
    
    print(f"Vertex 0 [Original]:    {v_0_orig}")
    print(f"Vertex 0 [Transformed]: {v_0_trans}")
    
    # Assert that the X coordinate (index 0) was correctly scaled by 2
    assert v_0_trans[0] == v_0_orig[0] * 2.0, "X coordinate was not scaled correctly!"
    
    # Assert that the Y and Z coordinates were untouched
    assert v_0_trans[1] == v_0_orig[1], "Y coordinate was incorrectly altered!"
    assert v_0_trans[2] == v_0_orig[2], "Z coordinate was incorrectly altered!"
    
    print("\n[SUCCESS] Vectorized mathematical transformation validated!")

if __name__ == "__main__":
    run_tests()
