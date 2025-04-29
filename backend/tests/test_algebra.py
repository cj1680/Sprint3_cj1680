import io
import pytest
from app import create_app  # only import the app factory

@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_post_without_image(client):
    response = client.post("/algebra/", data={})
    assert response.status_code == 400
    assert b"No image uploaded" in response.data

def test_post_with_unsupported_format(client):
    data = {
        "image": (io.BytesIO(b"fake image data"), "test.gif")
    }
    response = client.post("/algebra/", data=data, content_type="multipart/form-data")
    assert response.status_code == 400
    assert b"Unsupported image format" in response.data
