import pytest
from unittest.mock import patch, MagicMock
from io import BytesIO
from app import create_app

@pytest.fixture
def client():
    # Create a test client for the app
    app = create_app()
    return app.test_client()

def create_test_image():
    # Create a simple image in memory for testing
    image = BytesIO()
    image.write(b"fakeimagecontent")  # Not a real image, just a placeholder
    image.seek(0)  # Reset the pointer to the beginning of the "image"
    return image

@patch('app.routes.graph_route.anthropic.Anthropic')  # Mock Anthropics API
@patch('app.routes.graph_route.psycopg2.connect')  # Mock database connection
@patch('app.routes.graph_route.cloudinary.uploader.upload')  # Mock Cloudinary upload
def test_graph_route_valid_image(mock_cloudinary, mock_db, mock_anthropic, client):
    # Mock the response from the Anthropics API
    mock_anthropic_instance = MagicMock()
    mock_anthropic.return_value = mock_anthropic_instance
    mock_anthropic_instance.messages.create.return_value = MagicMock(
        content=[MagicMock(text="The shape is a V-shape. It has 3 points. The first point is: at 0, 0. Next: at 1, 1. Finally: at 2, 2.")]
    )

    # Mock the database cursor and connection
    mock_db_instance = MagicMock()
    mock_db.return_value = mock_db_instance
    mock_db_instance.cursor.return_value.__enter__.return_value = MagicMock()

    # Mock Cloudinary upload response
    mock_cloudinary.return_value = {'secure_url': 'https://example.com/image.jpg', 'public_id': 'image_id'}

    # Use a valid image (e.g., PNG)
    image = create_test_image()
    response = client.post('/graphs/', data={'image': (image, 'test.png')})

    # Assert the status code is 200 (OK)
    assert response.status_code == 200
    json_data = response.get_json()
    
    # Assert the response contains the expected data
    assert 'response' in json_data
    assert isinstance(json_data['response'], list)
    assert json_data['response'] == [
        "The shape is a V-shape. It has 3 points. The first point is: at 0, 0. Next: at 1, 1. Finally: at 2, 2."
    ]
