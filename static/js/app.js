const state = {
    tasks: [],
    filter: "all",
};


const elements = {
    taskForm: document.querySelector("#taskForm"),
    taskInput: document.querySelector("#taskInput"),
    taskList: document.querySelector("#taskList"),
    emptyState: document.querySelector("#emptyState"),

    taskCounter: document.querySelector("#taskCounter"),

    totalTasks: document.querySelector("#totalTasks"),
    completedTasks: document.querySelector("#completedTasks"),
    activeTasks: document.querySelector("#activeTasks"),

    progressPercent:
        document.querySelector("#progressPercent"),

    progressBar:
        document.querySelector("#progressBar"),

    demoButton:
        document.querySelector("#demoButton"),

    closeDemoButton:
        document.querySelector("#closeDemoButton"),

    demoPanel:
        document.querySelector("#demoPanel"),

    demoContent:
        document.querySelector("#demoContent"),

    themeButton:
        document.querySelector("#themeButton"),

    themeIcon:
        document.querySelector("#themeIcon"),

    toast:
        document.querySelector("#toast"),

    toastText:
        document.querySelector("#toastText"),
};


async function request(
    url,
    options = {},
) {
    const response = await fetch(
        url,
        options,
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error
            || "Ошибка запроса к серверу."
        );
    }

    return data;
}


async function loadTasks() {
    try {
        state.tasks = await request(
            "/api/tasks",
        );

        render();
    } catch (error) {
        showToast(error.message);
    }
}


function getFilteredTasks() {
    if (state.filter === "active") {
        return state.tasks.filter(
            task => !task.completed
        );
    }

    if (state.filter === "completed") {
        return state.tasks.filter(
            task => task.completed
        );
    }

    return state.tasks;
}


function render() {
    renderTasks();
    renderStats();
}


function renderTasks() {
    elements.taskList.innerHTML = "";

    const tasks = getFilteredTasks();

    elements.emptyState.classList.toggle(
        "hidden",
        tasks.length !== 0,
    );

    for (const task of tasks) {
        const item = document.createElement(
            "article"
        );

        item.className = "task-item";

        if (task.completed) {
            item.classList.add(
                "completed"
            );
        }

        item.dataset.id = task.id;

        const checkButton =
            document.createElement(
                "button"
            );

        checkButton.className =
            "task-check";

        checkButton.type =
            "button";

        checkButton.title =
            task.completed
            ? "Вернуть в работу"
            : "Отметить выполненной";

        checkButton.addEventListener(
            "click",
            () => toggleTask(task.id),
        );


        const title =
            document.createElement(
                "div"
            );

        title.className =
            "task-title";

        title.textContent =
            task.title;


        const deleteButton =
            document.createElement(
                "button"
            );

        deleteButton.className =
            "delete-button";

        deleteButton.type =
            "button";

        deleteButton.title =
            "Удалить задачу";

        deleteButton.textContent =
            "×";

        deleteButton.addEventListener(
            "click",
            () => deleteTask(task.id),
        );


        item.append(
            checkButton,
            title,
            deleteButton,
        );

        elements.taskList.append(
            item
        );
    }
}


function renderStats() {
    const total =
        state.tasks.length;

    const completed =
        state.tasks.filter(
            task => task.completed
        ).length;

    const active =
        total - completed;

    const percent =
        total === 0
        ? 0
        : Math.round(
            completed
            / total
            * 100
        );

    elements.totalTasks.textContent =
        total;

    elements.completedTasks.textContent =
        completed;

    elements.activeTasks.textContent =
        active;

    elements.progressPercent.textContent =
        `${percent}%`;

    elements.progressBar.style.width =
        `${percent}%`;

    elements.taskCounter.textContent =
        formatTaskCount(total);
}


function formatTaskCount(count) {
    const lastDigit =
        count % 10;

    const lastTwoDigits =
        count % 100;

    if (
        lastDigit === 1
        && lastTwoDigits !== 11
    ) {
        return `${count} задача`;
    }

    if (
        [2, 3, 4].includes(lastDigit)
        && ![12, 13, 14].includes(
            lastTwoDigits
        )
    ) {
        return `${count} задачи`;
    }

    return `${count} задач`;
}


async function createTask(title) {
    try {
        const task = await request(
            "/api/tasks",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",
                },

                body: JSON.stringify({
                    title,
                }),
            },
        );

        state.tasks.push(task);

        elements.taskInput.value = "";

        render();

        showToast(
            "Задача добавлена"
        );
    } catch (error) {
        showToast(error.message);
    }
}


async function toggleTask(id) {
    try {
        const updatedTask =
            await request(
                `/api/tasks/${id}`,
                {
                    method: "PATCH",
                },
            );

        const index =
            state.tasks.findIndex(
                task => task.id === id
            );

        if (index !== -1) {
            state.tasks[index] =
                updatedTask;
        }

        render();
    } catch (error) {
        showToast(error.message);
    }
}


async function deleteTask(id) {
    try {
        await request(
            `/api/tasks/${id}`,
            {
                method: "DELETE",
            },
        );

        state.tasks =
            state.tasks.filter(
                task => task.id !== id
            );

        render();

        showToast(
            "Задача удалена"
        );
    } catch (error) {
        showToast(error.message);
    }
}


async function loadDemo() {
    elements.demoButton.disabled = true;

    elements.demoButton.textContent =
        "Проверка...";

    try {
        const data = await request(
            "/api/demo",
        );

        renderDemo(data);

        elements.demoPanel.classList.remove(
            "hidden"
        );

        elements.demoPanel.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });

        showToast(
            "Project B работает корректно"
        );
    } catch (error) {
        showToast(error.message);
    } finally {
        elements.demoButton.disabled = false;

        elements.demoButton.textContent =
            "Запустить проверку";
    }
}


function renderDemo(data) {
    elements.demoContent.innerHTML = "";

    const labels = {
        current_date:
            "Текущая дата",

        formatted_date:
            "Дата форматирована",

        tomorrow:
            "Завтра",

        days_between:
            "Разница в днях",

        reverse:
            "Reverse",

        capitalized:
            "Capitalize",

        normalized:
            "Normalize",

        slug:
            "Slug",

        file_content:
            "Файл",

        file_lines:
            "Строк в файле",
    };

    for (
        const [key, value]
        of Object.entries(data)
    ) {
        const item =
            document.createElement(
                "div"
            );

        item.className =
            "demo-item";

        const label =
            document.createElement(
                "span"
            );

        label.textContent =
            labels[key] || key;

        const result =
            document.createElement(
                "strong"
            );

        result.textContent =
            String(value);

        item.append(
            label,
            result,
        );

        elements.demoContent.append(
            item
        );
    }
}


function showToast(message) {
    elements.toastText.textContent =
        message;

    elements.toast.classList.add(
        "visible"
    );

    clearTimeout(
        showToast.timeoutId
    );

    showToast.timeoutId =
        setTimeout(
            () => {
                elements.toast.classList.remove(
                    "visible"
                );
            },
            2500,
        );
}


function setTheme(theme) {
    const isLight =
        theme === "light";

    document.body.classList.toggle(
        "light-theme",
        isLight,
    );

    elements.themeIcon.textContent =
        isLight
        ? "☀"
        : "☾";

    localStorage.setItem(
        "task-manager-theme",
        theme,
    );
}


function initTheme() {
    const savedTheme =
        localStorage.getItem(
            "task-manager-theme"
        );

    if (savedTheme) {
        setTheme(savedTheme);
        return;
    }

    setTheme("dark");
}


elements.taskForm.addEventListener(
    "submit",
    event => {
        event.preventDefault();

        const title =
            elements.taskInput.value.trim();

        if (!title) {
            showToast(
                "Введите название задачи"
            );

            return;
        }

        createTask(title);
    },
);


document
    .querySelectorAll(
        ".filter-button"
    )
    .forEach(button => {
        button.addEventListener(
            "click",
            () => {
                document
                    .querySelectorAll(
                        ".filter-button"
                    )
                    .forEach(item => {
                        item.classList.remove(
                            "active"
                        );
                    });

                button.classList.add(
                    "active"
                );

                state.filter =
                    button.dataset.filter;

                renderTasks();
            },
        );
    });


elements.demoButton.addEventListener(
    "click",
    loadDemo,
);


elements.closeDemoButton.addEventListener(
    "click",
    () => {
        elements.demoPanel.classList.add(
            "hidden"
        );
    },
);


elements.themeButton.addEventListener(
    "click",
    () => {
        const isLight =
            document.body.classList.contains(
                "light-theme"
            );

        setTheme(
            isLight
            ? "dark"
            : "light"
        );
    },
);


initTheme();
loadTasks();