from src.main import create_app


def test_index():
    client = create_app(testing=True).test_client()
    response = client.get("/")
    assert response.status_code == 200
    assert "Task Manager" in response.get_data(as_text=True)


def test_project_b_integration():
    client = create_app(testing=True).test_client()
    response = client.get("/api/demo")
    assert response.status_code == 200
    data = response.get_json()
    assert data["reverse"] == "dlroW olleH"
    assert data["file_lines"] == 2
