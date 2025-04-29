import pytest
from io import BytesIO
from unittest.mock import patch, MagicMock
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

    # Mocking external dependencies (Cloudinary, PostgreSQL, and Anthropics)
    with patch('app.routes.geometry_route.anthropic.Anthropic') as MockAnthropic, \
         patch('app.routes.geometry_route.cloudinary.uploader.upload') as MockUpload, \
         patch('app.routes.geometry_route.psycopg2.connect') as MockDBConnection:

        # Mock the response from the Anthropics API
        mock_anthropic_instance = MagicMock()
        mock_anthropic_instance.messages.create.return_value = MagicMock(content=[MagicMock(text="The shape is a triangle where angle A is 60, angle B is 60, and angle C is 60.")])
        MockAnthropic.return_value = mock_anthropic_instance

        # Mock Cloudinary upload
        MockUpload.return_value = {'secure_url': 'http://image.url', 'public_id': 'image_id'}

        # Mock database connection
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_conn.cursor.return_value = mock_cursor
        MockDBConnection.return_value = mock_conn

        # Perform the POST request
        with app.test_client() as client:
            image = create_test_image()
            response = client.post('/geometry/', data={'image': (image, 'test.png')})

            # Check that the response is successful and valid
            assert response.status_code == 200
            response_data = response.get_json()  # Get the response as a dictionary
            assert 'response' in response_data
            assert 'The shape is a triangle' in response_data['response'][0]

# Test for the /geometry route with no image in the request
def test_geometry_route_no_image():
    # Create the app and get the test client
    app = create_app()
    app.config['TESTING'] = True

    with app.test_client() as client:
        response = client.post('/geometry/')
        assert response.status_code == 400
        response_data = response.get_json()  # Get the response as a dictionary
        assert 'error' in response_data

# Test for the /geometry route with an unsupported image format
def test_geometry_route_unsupported_format():
    # Create the app and get the test client
    app = create_app()
    app.config['TESTING'] = True

    with app.test_client() as client:
        image = create_test_image()
        response = client.post('/geometry/', data={'image': (image, 'test.txt')})
        assert response.status_code == 400
        response_data = response.get_json()  # Get the response as a dictionary
        assert 'error' in response_data
        assert response_data['error'] == "Unsupported image format. Only PNG and JPG are supported."
