import pytest
from io import BytesIO
from app import create_app

# Helper function to create a dummy image
def create_test_image():
    img = BytesIO()
    img.write(b"fakeimagecontent")
    img.seek(0)
    return img

# Test for the /geometry route with a valid image
def test_geometry_route_valid_image():
    # Create the app and get the test client
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        image = create_test_image()
        response = client.post('/geometry/', data={'image': (image, 'test.png')})
        assert response.status_code == 200
        assert 'response' in response.json()

# Test for the /geometry route with no image in the request
def test_geometry_route_no_image():
    # Create the app and get the test client
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        response = client.post('/geometry/')
        assert response.status_code == 400
        assert 'error' in response.json()

# Test for the /geometry route with an unsupported image format
def test_geometry_route_unsupported_format():
    # Create the app and get the test client
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        image = create_test_image()
        response = client.post('/geometry/', data={'image': (image, 'test.txt')})
        assert response.status_code == 400
        assert 'error' in response.json()
        assert response.json()['error'] == "Unsupported image format. Only PNG and JPG are supported."
