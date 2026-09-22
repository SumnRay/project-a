"""Flask web application for the Task Manager laboratory project."""

from __future__ import annotations

from pathlib import Path
from typing import Any, Dict

from flask import (
    Flask,
    jsonify,
    redirect,
    render_template,
    request,
    url_for,
)

from project_b_utils import (
    add_days,
    capitalize_words,
    count_lines,
    days_between,
    format_date,
    get_current_date,
    get_logger,
    normalize_whitespace,
    read_text,
    reverse_string,
    slugify,
    write_text,
)

from .models import TaskRepository
from .utils import clean_task_title


repository = TaskRepository()
logger = get_logger("project-a")


def build_demo_payload(data_dir: Path) -> Dict[str, Any]:
    """
    Demonstrate Project B functions.

    This endpoint is also used by integration tests.
    """

    today = get_current_date()

    sample_file = data_dir / "demo.txt"

    write_text(
        sample_file,
        "Project A\nProject B\n",
    )

    logger.info("Building Project B integration demo")

    return {
        "current_date": today,
        "formatted_date": format_date(today),
        "tomorrow": add_days(today, 1),
        "days_between": days_between(
            today,
            add_days(today, 7),
        ),
        "reverse": reverse_string("Hello World"),
        "capitalized": capitalize_words(
            "hello world from project a"
        ),
        "normalized": normalize_whitespace(
            "project   a   uses   project b"
        ),
        "slug": slugify("Project A + Project B"),
        "file_content": read_text(sample_file),
        "file_lines": count_lines(sample_file),
    }


def create_app(testing: bool = False) -> Flask:
    """Create and configure the Flask application."""

    app = Flask(
        __name__,
        template_folder="../templates",
        static_folder="../static",
    )

    app.config["TESTING"] = testing

    data_dir = (
        Path(__file__).resolve().parents[1]
        / "data"
    )

    @app.get("/")
    def index():
        """Render the main Task Manager page."""

        return render_template(
            "index.html",
            tasks=repository.list(),
        )

    # -------------------------------------------------
    # Original HTML form routes
    # -------------------------------------------------

    @app.post("/tasks")
    def add_task():
        """Add a task using a traditional HTML form."""

        try:
            title = clean_task_title(
                request.form.get("title", "")
            )
        except ValueError:
            return redirect(url_for("index"))

        repository.add(title)

        return redirect(url_for("index"))

    @app.post("/tasks/<int:task_id>/toggle")
    def toggle_task(task_id: int):
        """Toggle a task using a traditional form."""

        repository.toggle(task_id)

        return redirect(url_for("index"))

    # -------------------------------------------------
    # JSON API used by JavaScript
    # -------------------------------------------------

    @app.get("/api/tasks")
    def api_tasks():
        """Return all tasks."""

        return jsonify(
            [
                task.to_dict()
                for task in repository.list()
            ]
        )

    @app.post("/api/tasks")
    def api_add_task():
        """Create a task using JSON."""

        payload = request.get_json(
            silent=True
        ) or {}

        try:
            title = clean_task_title(
                payload.get("title", "")
            )
        except ValueError:
            return jsonify(
                {
                    "error": (
                        "Название задачи "
                        "не может быть пустым."
                    )
                }
            ), 400

        task = repository.add(title)

        logger.info(
            "Task created: %s",
            task.title,
        )

        return jsonify(task.to_dict()), 201

    @app.patch("/api/tasks/<int:task_id>")
    def api_toggle_task(task_id: int):
        """Toggle completed state of a task."""

        task = repository.toggle(task_id)

        if task is None:
            return jsonify(
                {
                    "error": "Задача не найдена."
                }
            ), 404

        return jsonify(task.to_dict())

    @app.delete("/api/tasks/<int:task_id>")
    def api_delete_task(task_id: int):
        """Delete a task."""

        removed = repository.remove(task_id)

        if not removed:
            return jsonify(
                {
                    "error": "Задача не найдена."
                }
            ), 404

        logger.info(
            "Task %s deleted",
            task_id,
        )

        return jsonify(
            {
                "success": True,
                "id": task_id,
            }
        )

    @app.get("/api/demo")
    def api_demo():
        """Demonstrate integration with Project B."""

        return jsonify(
            build_demo_payload(data_dir)
        )

    return app


app = create_app()


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True,
    )