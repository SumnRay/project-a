"""Demonstration loader for Project B when it is connected as a submodule.

Expected submodule location: ``project-a/libs/project-b``.
"""

from __future__ import annotations

import sys
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[1]
SUBMODULE_SRC = PROJECT_ROOT / "libs" / "project-b" / "src"

if SUBMODULE_SRC.exists() and str(SUBMODULE_SRC) not in sys.path:
    sys.path.insert(0, str(SUBMODULE_SRC))

from project_b_utils import (  # noqa: E402
    capitalize_words,
    format_date,
    get_current_date,
    reverse_string,
)


def main() -> None:
    print(f"Текущая дата: {get_current_date()}")
    print(f"Форматированная дата: {format_date(get_current_date())}")
    print(f"Обратный текст: {reverse_string('Hello World')}")
    print(f"С заглавной: {capitalize_words('hello world from project a')}")


if __name__ == "__main__":
    main()
