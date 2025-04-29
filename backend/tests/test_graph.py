import pytest
from io import BytesIO
from app import create_app  # Import the create_app function to instantiate the app

@pytest.fixture
def app():
    app = create_app()  # Create the Flask app using the app factory function
    return app

@pytest.fixture
def client(app):
    return app.test_client()  # Create a test client for the app

def create_test_image():
    # Create a simple 1x1 pixel image for testing
    img = BytesIO()
    img.write(b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90\x8c\x01\x30\x00\x00\x00\x01IDAT8\x8d\x63\xf8\xff\xff?\x00\x06\x00\x02\x00\x01\xa0>\x94\xf7\x00\x00\x00\x00IEND\xaeB`\x82')
    img.seek(0)
    return img

def test_graph_route_valid_image(client):
    # Use a valid image (e.g., PNG)
    image = create_test_image()
    response = client.post('/graphs/', data={'image': (image, 'test.png')})

    assert response.status_code == 200
    json_data = response.get_json()
    assert 'response' in json_data
    assert isinstance(json_data['response'], list)

def test_graph_route_invalid_image_format(client):
    # Use an unsupported image type
    image = create_test_image()
    response = client.post('/graphs/', data={'image': (image, 'test.gif')})

    assert response.status_code == 400
    json_data = response.get_json()
    assert 'error' in json_data
    assert json_data['error'] == 'Unsupported image format. Only PNG and JPG are supported.'

def test_graph_route_no_image(client):
    # Test case where no image is provided
    response = client.post('/graphs/')
    
    assert response.status_code == 400
    json_data = response.get_json()
    assert 'error' in json_data
    assert json_data['error'] == 'No image uploaded'
