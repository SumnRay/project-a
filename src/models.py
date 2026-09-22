"""Domain models for the Task Manager."""

from __future__ import annotations

from dataclasses import asdict, dataclass
from typing import List, Optional


@dataclass
class Task:
    """Task entity."""

    id: int
    title: str
    completed: bool = False

    def to_dict(self):
        """Convert task to dictionary."""

        return asdict(self)


class TaskRepository:
    """
    Simple in-memory task repository.

    Data exists while the Flask application
    is running.
    """

    def __init__(self) -> None:
        self._tasks: List[Task] = []
        self._next_id = 1

    def list(self) -> List[Task]:
        """Return all tasks."""

        return list(self._tasks)

    def add(self, title: str) -> Task:
        """Create and store a task."""

        task = Task(
            id=self._next_id,
            title=title,
        )

        self._tasks.append(task)
        self._next_id += 1

        return task

    def toggle(
        self,
        task_id: int,
    ) -> Optional[Task]:
        """Toggle task completed state."""

        for task in self._tasks:
            if task.id == task_id:
                task.completed = (
                    not task.completed
                )

                return task

        return None

    def remove(
        self,
        task_id: int,
    ) -> bool:
        """Delete a task by ID."""

        for task in self._tasks:
            if task.id == task_id:
                self._tasks.remove(task)
                return True

        return False