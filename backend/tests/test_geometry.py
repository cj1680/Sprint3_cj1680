import pytest
from io import BytesIO
from app import create_app

# Helper function to create a dummy image (you can replace this with a more realistic image generator if needed)
def create_test_image():
    img = BytesIO()
    img.write(b"fakeimagecontent")
    img.seek(0)
    return img

# Test for the /geometry route with a valid image
def test_geometry_route_valid_image(client):
    # Use a valid image (e.g., PNG)
    image = create_test_image()
    response = client.post('/geometry/', data={'image': (image, 'test.png')})
    
    # Assert that the response is successful
    assert response.status_code == 200
    assert 'response' in response.json()

# Test for the /geometry route with no image in the request
def test_geometry_route_no_image(client):
    response = client.post('/geometry/')
    
    # Assert that the response status code is 400
    assert response.status_code == 400
    assert 'error' in response.json()

# Test for the /geometry route with an unsupported image format
def test_geometry_route_unsupported_format(client):
    image = create_test_image()
    response = client.post('/geometry/', data={'image': (image, 'test.txt')})
    
    # Assert that the response status code is 400
    assert response.status_code == 400
    assert 'error' in response.json()
    assert response.json()['error'] == "Unsupported image format. Only PNG and JPG are supported."
