"""Application-specific helper functions."""

from __future__ import annotations


def clean_task_title(value: str) -> str:
    """Normalize a task title and validate that it is not empty."""
    title = " ".join(value.split())
    if not title:
        raise ValueError("Task title must not be empty")
    return title
