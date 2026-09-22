# Project A — Task Manager

Project A is the main Flask web application. It demonstrates three ways of
working with Project B during the laboratory work: Git Submodule, Git Subtree
and local package installation.

## Local package mode

Keep `project-a` and `project-b` in the same parent directory.

```bash
python -m venv .venv
# Windows
.venv\\Scripts\\activate
# Linux/macOS
source .venv/bin/activate

pip install -r requirements.txt
pytest
python -m src.main
```

Open `http://127.0.0.1:5000/`.

## Submodule mode

After adding Project B to `libs/project-b`, install it with:

```bash
pip install -e libs/project-b
python -m src.module_loader
```
