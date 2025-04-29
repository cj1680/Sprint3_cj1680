import io
import base64
import pytest
from unittest.mock import patch, MagicMock
from backend.app.routes.algebra_route import bp
from flask import Flask

@pytest.fixture
def client():
    app = Flask(__name__)
    app.register_blueprint(bp)
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_post_no_image(client):
    response = client.post("/algebra/")
    assert response.status_code == 400
    assert b"No image uploaded" in response.data

def test_post_unsupported_image_format(client):
    data = {
        "image": (io.BytesIO(b"fake-image-content"), "equation.bmp")  # unsupported format
    }
    response = client.post("/algebra/", content_type='multipart/form-data', data=data)
    assert response.status_code == 400
    assert b"Unsupported image format" in response.data

@patch("backend.app.routes.algebra_route.anthropic.Anthropic")
def test_post_valid_image_no_equation(mock_anthropic, client):
    mock_client = MagicMock()
    mock_response = MagicMock()
    mock_response.content = ["0"]
    mock_client.messages.create.return_value = mock_response
    mock_anthropic.return_value = mock_client

    image_bytes = base64.b64decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAokB9mFTp1UAAAAASUVORK5CYII=")
    data = {
        "image": (io.BytesIO(image_bytes), "equation.png")
    }

    response = client.post("/algebra/", content_type='multipart/form-data', data=data)
    assert response.status_code == 200
    assert response.json["response"] == ["0"]
