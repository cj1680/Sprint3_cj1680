import io
import pytest
from app import create_app  # Import app factory only

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
