import pytest
from app import create_app  # Import the create_app function from app.py
from io import BytesIO
from unittest import mock

@pytest.fixture
def client():
    # Create a Flask app instance using the factory function
    app = create_app()

    # Use Flask's test client for making requests to the app
    with app.test_client() as client:
        yield client

def test_algebra_route_success(client):
    # Prepare mock data for the image upload
    image_data = BytesIO(b"fake_image_data")  # A simple byte string as a placeholder
    image_data.filename = "test_image.jpg"
    
    data = {
        "image": (image_data, "test_image.jpg"),
        "token": "valid_token"  # Mock a valid token
    }

    # Mock the external calls (Anthropic AI, Cloudinary, and PostgreSQL)
    with mock.patch("anthropic.Anthropic.messages.create") as mock_ai:
        mock_ai.return_value.content = [{"text": "x squared plus y equals 0"}]  # Mock AI response

        with mock.patch("cloudinary.uploader.upload") as mock_upload:
            mock_upload.return_value = {"secure_url": "fake_url", "public_id": "fake_public_id"}

            with mock.patch("psycopg2.connect") as mock_db:
                mock_cursor = mock.Mock()
                mock_db.return_value.cursor.return_value = mock_cursor

                # Make the POST request to the algebra route
                response = client.post("/algebra/", data=data)

                # Assert that the AI API was called correctly
                mock_ai.assert_called_once()

                # Check the response
                assert response.status_code == 200
                assert b"response" in response.data  # Ensure that the response contains the "response" key
                assert b"x squared plus y equals 0" in response.data  # Ensure the AI response is present

                # Assert that the image was uploaded to Cloudinary
                mock_upload.assert_called_once()

                # Assert that a database insert occurred
                mock_cursor.execute.assert_called_once_with(
                    '''INSERT INTO conversations (u_id_fk, branch, image_url, image_id, conversation, filename)
                    VALUES (%s, %s, %s, %s, %s, %s)''',
                    mock.ANY  # You can assert the specific values here if needed
                )

def test_algebra_route_missing_image(client):
    data = {
        "token": "valid_token"  # Missing image in the request
    }
    response = client.post("/algebra/", data=data)
    assert response.status_code == 400
    assert b"No image uploaded" in response.data  # Ensure the error message is correct

def test_algebra_route_invalid_image_format(client):
    # Simulate an unsupported file format (e.g., .gif)
    image_data = BytesIO(b"fake_image_data")
    image_data.filename = "test_image.gif"
    
    data = {
        "image": (image_data, "test_image.gif"),
        "token": "valid_token"
    }
    response = client.post("/algebra/", data=data)
    assert response.status_code == 400
    assert b"Unsupported image format" in response.data  # Ensure the error message is correct

