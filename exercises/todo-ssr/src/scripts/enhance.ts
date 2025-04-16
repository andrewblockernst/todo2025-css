import type { Task } from "../state";

type FilterType = "all" | "complete" | "incomplete";

export interface HistoryState {
  tab: string;
  filter: FilterType;
}

export interface APIResponse {
  success?: boolean;
  error?: string;
  task?: Task;
  tasks?: Task[];
  filter?: FilterType;
  tab?: string;
  removed?: number;
  activeTab?: string;
}

// Variables globales para almacenar el estado actual
let activeTabId: string;
let activeFilter: FilterType = "all";

document.addEventListener("DOMContentLoaded", () => {
  console.log("Progressive Enhancement activado - DEBUG");

  //LLAMADA DE ESTADO CON URL
  initializeFromUrl();

  //SE INICIALIZA DESDE LA PESTAÑA ACTIVA, DE SER ASI Y QUE SE ELIMINE UNA PESTAÑA APARECE SIN TAREAS
  if (!activeTabId) {
    const activeTabElement = document.querySelector(".block[data-tab]");
    activeTabId = activeTabElement?.getAttribute("data-tab") || "today";
  }

  if (!activeFilter) {
    const activeFilterBtn = document.querySelector(
      "button[data-filter].bg-amber-200"
    );
    activeFilter =
      (activeFilterBtn?.getAttribute("data-filter") as FilterType) || "all";
  }

  console.log("Estado inicial:", { activeTabId, activeFilter });

  //UPDATE DE PESTAÑA Y FILTRO DISPONIBLE
  addDataAttributes();
  interceptForms();
  setupAddTabButton();

  //MANEJO CON HISTORIAL DE NAVEGACION
  window.addEventListener("popstate", (event: PopStateEvent) => {
    if (event.state as HistoryState) {
      console.log("Estado recuperado de historial:", event.state);
      const state = event.state as HistoryState;
      activeTabId = state.tab || "today";
      activeFilter = state.filter || "all";
      updateVisibleTab(activeTabId);
      updateFilterButtons(activeFilter);
      applyFilter(activeFilter);
    }
  });
});

//A CONTINUACION ESTA TODO EL MANEJO DE URL PARA QUE NO SE RECARGUE LA PAGINA

function initializeFromUrl(): void {
  const url = new URL(window.location.href);
  const tabParam = url.searchParams.get("tab");
  const filterParam = url.searchParams.get("filter") as FilterType | null;

  if (tabParam) {
    activeTabId = tabParam;
    updateVisibleTab(activeTabId);
  }

  if (filterParam) {
    activeFilter = filterParam;
    updateFilterButtons(activeFilter);
    applyFilter(activeFilter);
  }
}

function updateUrl(): void {
  const url = new URL(window.location.href);

  // Actualizar parámetros de la URL
  url.searchParams.set("tab", activeTabId);

  if (activeFilter !== "all") {
    url.searchParams.set("filter", activeFilter);
  } else {
    url.searchParams.delete("filter");
  }

  // Actualizar URL sin recargar usando History API
  const state: HistoryState = { tab: activeTabId, filter: activeFilter };
  window.history.pushState(state, "", url.toString());
}

// Actualizar la pestaña visible y los botones de filtro
function updateVisibleTab(tabId: string): void {
  // Ocultar todas las pestañas
  document.querySelectorAll('[id^="tab-"]').forEach((tabPanel: Element) => {
    tabPanel.classList.add("hidden");
    tabPanel.classList.remove("block");
  });

  // Mostrar la pestaña seleccionada
  const activeTabPanel = document.getElementById(`tab-${tabId}`);
  if (activeTabPanel) {
    activeTabPanel.classList.remove("hidden");
    activeTabPanel.classList.add("block");
  }

  // Actualizar apariencia de botones
  document.querySelectorAll("button[data-tab]").forEach((button: Element) => {
    button.classList.remove("bg-amber-400", "text-slate-900");
    button.classList.add("bg-orange-900", "text-slate-100");
  });

  const activeTabButton = document.querySelector(`button[data-tab="${tabId}"]`);
  if (activeTabButton) {
    activeTabButton.classList.remove("bg-orange-900", "text-slate-100");
    activeTabButton.classList.add("bg-amber-400", "text-slate-900");
  }

  // Actualizar campo oculto en el formulario
  const tabInput = document.querySelector(
    '#task-form input[name="tab"]'
  ) as HTMLInputElement | null;
  if (tabInput) {
    tabInput.value = tabId;
  }
}

function updateFilterButtons(filter: FilterType): void {
  // Actualizar apariencia de botones
  document.querySelectorAll("[data-filter]").forEach((button: Element) => {
    button.classList.remove("bg-amber-200", "text-guinness");
    button.classList.add("bg-medium-wood", "text-slate-100");
  });

  const activeFilterButton = document.querySelector(
    `[data-filter="${filter}"]`
  );
  if (activeFilterButton) {
    activeFilterButton.classList.remove("bg-medium-wood", "text-slate-100");
    activeFilterButton.classList.add("bg-amber-200", "text-guinness");
  }
}

function interceptForms(): void {
  console.log("Interceptando formularios...");

  //LLAMADA A FORMULARIOS IMPLEMENTANDO AJAX A PARTIR DE LOS METODOS VISTOS ANTERIORMENTE
  document
    .querySelectorAll('form[method="POST"]')
    .forEach((form) => {
      const htmlForm = form as HTMLFormElement;
      console.log("Formulario encontrado:", htmlForm.id || "sin ID");

      htmlForm.addEventListener("submit", async (e: SubmitEvent) => {
        if (htmlForm.getAttribute("action") === "/") {
          console.log("Interceptando envío de formulario");
          e.preventDefault(); //METODO DE IMPEDIMENTO DE RECARGA SACADO DE INTERNET!!!

          //DATOS DE FORMULARIO CON ID DE PESTAÑA ACTUAL
          const formData = new FormData(htmlForm);
          const action = formData.get("action") as string;
          console.log("Acción:", action);

          try {
            //LLAMADO A AJAX COMO TAL - "UNA DE LAS MANERAS DE ESTRUCTURARLO"
            let response: Response;

            switch (action) {
              case "add-task":
                console.log("Agregando tarea a pestaña:", activeTabId);
                response = await fetch("/api/tasks", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    text: formData.get("taskText"),
                    tab: activeTabId, //LLAMADA A VARIABLE GLOBAL DE PESTAÑA ACTIVA - ESTO LO SAQUE DE INTERNET PARA SABER COMO MANEJARLO
                  }),
                });
                break;

              case "toggle-complete":
                const taskId = formData.get("taskId") as string;
                console.log("Cambiando estado de tarea:", taskId);

                const taskElement = document.querySelector(
                  `[data-task-id="${taskId}"]`
                );
                const isCompleted =
                  taskElement?.classList.contains("completed");

                response = await fetch(`/api/tasks/${taskId}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ completed: !isCompleted }),
                });
                break;

              case "delete-task":
                const deleteTaskId = formData.get("taskId") as string;
                console.log("Eliminando tarea:", deleteTaskId);

                response = await fetch(`/api/tasks/${deleteTaskId}`, {
                  method: "DELETE",
                });
                break;

              case "clear-completed":
                const tab = formData.get("tab") as string;
                console.log("Limpiando tareas completadas en pestaña:", tab);

                response = await fetch("/api/tasks/clear", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ tab }),
                });
                break;

              case "change-filter":
                const filter = formData.get("filter") as FilterType;
                console.log("Cambiando filtro a:", filter);

                response = await fetch("/api/filter", {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ filter }),
                });
                break;

              case "change-tab":
                const newTab = formData.get("tab") as string;
                console.log("Cambiando a pestaña:", newTab);

                response = await fetch("/api/tabs", {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ tab: newTab }),
                });
                break;

              case "add-tab":
                const newTabName = formData.get("newTabName") as string;
                console.log("Creando nueva pestaña:", newTabName);

                response = await fetch("/api/tabs", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ name: newTabName }),
                });
                break;

              default:
                console.log(
                  "Acción no reconocida, enviando formulario normalmente"
                );
                htmlForm.submit();
                return;
            }

            if (!response.ok) {
              throw new Error(`Error en la solicitud AJAX: ${response.status}`);
            }

            const data = (await response.json()) as APIResponse;
            console.log("Respuesta:", data);

            await updateUI(action, formData, data);
          } catch (error) {
            console.error("Error en AJAX:", error);
            //SI HAY ERROR, SE MANEJA CON ALERTA Y SE ENVIA EL FORMULARIO NORMALMENTE
            alert(
              "Hubo un error en la comunicación. Se procesará la solicitud de manera tradicional."
            );
            htmlForm.submit();
          }
        }
      });
    });
}

function setupAddTabButton(): void {
  const showTabInput = document.getElementById("show-tab-input");
  const addTabInputGroup = document.querySelector(".add-tab-input-group");

  if (showTabInput && addTabInputGroup) {
    console.log("Configurando botón de nueva pestaña");

    showTabInput.addEventListener("click", () => {
      (addTabInputGroup as HTMLElement).style.display = "inline-block";
      (showTabInput as HTMLElement).style.display = "none";

      const newTabInput = document.getElementById(
        "new-tab-input"
      ) as HTMLInputElement;
      if (newTabInput) {
        newTabInput.focus();
      }

      document.addEventListener(
        "click",
        function closeTabInput(event: MouseEvent) {
          const target = event.target as HTMLElement;
          if (!addTabInputGroup.contains(target) && target !== showTabInput) {
            (addTabInputGroup as HTMLElement).style.display = "none";
            (showTabInput as HTMLElement).style.display = "inline-block";
            document.removeEventListener("click", closeTabInput);
          }
        }
      );
    });
  }
}

//DISTINTOS MANEJOS DE LOS CONTROLES DE LAS TASKS (FILTROS, ESTAODS DE TAREAS, ETC) - ME GUIE MUCHO POR INTERNET PARA COMPRENDER EL ESTADO ENTRE ACCIONES DE LOS BOTONES DE CONTROL
async function updateUI(
  action: string,
  formData: FormData,
  data: APIResponse
): Promise<void> {
  console.log(`Actualizando UI para acción: ${action}`);

  switch (action) {
    case "add-task":
      const taskTextInput = document.querySelector(
        'input[name="taskText"]'
      ) as HTMLInputElement | null;
      if (taskTextInput) {
        taskTextInput.value = "";
      }
      await refreshTaskList(activeTabId);
      break;

    case "toggle-complete":
      const taskId = formData.get("taskId") as string;
      const taskItem = document.querySelector(`[data-task-id="${taskId}"]`);

      if (taskItem) {
        taskItem.classList.toggle("completed");
        const taskText = taskItem.querySelector("span");
        if (taskText) {
          taskText.classList.toggle("line-through");
          taskText.classList.toggle("text-light-wood");
        }

        // Verificar si hay un filtro activo que requiera ocultar esta tarea
        if (activeFilter !== "all") {
          const isNowCompleted = taskItem.classList.contains("completed");

          if (
            (activeFilter === "complete" && !isNowCompleted) ||
            (activeFilter === "incomplete" && isNowCompleted)
          ) {
            //GUARDADO Y APLICADO DE FILTRO AL FINAL
            applyFilter(activeFilter);
          }
        }

        //MUESTRA VISUAL DEL CAMBIO DE ESTADO DE UNA TASK
        const toggleButton = taskItem.querySelector("button:last-child");
        if (toggleButton) {
          toggleButton.textContent = taskItem.classList.contains("completed")
            ? "✅"
            : "🍺";
        }
      }
      break;

    case "delete-task":
      //CHAU TASK DEL DOM
      const deleteTaskId = formData.get("taskId") as string;
      const taskElement = document.querySelector(
        `[data-task-id="${deleteTaskId}"]`
      );

      if (taskElement) {
        taskElement.remove();
      }
      break;

    case "clear-completed":
      //NO MORE TASKS, SE ELIMINAN
      const tab = formData.get("tab") as string;
      document
        .querySelectorAll(`#tab-${tab} .completed`)
        .forEach((element: Element) => {
          element.remove();
        });
      break;

    case "change-filter":
      //LAS FUNCIONES DE ARRIBA? BUENO AHORA APLICADOS AL FILTRO COMO PARAMETRO
      const filter = formData.get("filter") as FilterType;
      activeFilter = filter;
      updateFilterButtons(filter);
      applyFilter(filter);
      updateUrl();
      break;

    case "change-tab":
      const newTab = formData.get("tab") as string;

      activeTabId = newTab;
      console.log("Nueva pestaña activa:", activeTabId);

      updateVisibleTab(activeTabId);
      updateUrl();
      break;

    case "add-tab":
      if (data.tab) {
        const newTabId = data.tab;

        createNewTabElement(newTabId);
        activeTabId = newTabId;
        updateVisibleTab(activeTabId);

        const newTabInput = document.getElementById(
          "new-tab-input"
        ) as HTMLInputElement;
        if (newTabInput) {
          newTabInput.value = "";
        }

        const addTabInputGroup = document.querySelector(".add-tab-input-group");
        const showTabInput = document.getElementById("show-tab-input");
        if (addTabInputGroup && showTabInput) {
          (addTabInputGroup as HTMLElement).style.display = "none";
          (showTabInput as HTMLElement).style.display = "inline-block";
        }
        updateUrl();
      }
      break;
  }
}

//CREACION DE ELEMENTOS DOM PARA LA NUEVA PESTAÑA. ESTA FUNCION SE ENCARGA DE CREAR UNA NUEVA PESTAÑA Y SU CONTENIDO
function createNewTabElement(tabId: string): void {
  const tabsContainer = document.querySelector(
    ".flex.justify-center.gap-2.py-4.bg-medium-wood"
  );
  const addTabForm = document.getElementById("add-tab-form");

  if (tabsContainer && addTabForm) {
    const newTabForm = document.createElement("form");
    newTabForm.method = "POST";
    newTabForm.action = "/";
    newTabForm.className = "inline-block";

    newTabForm.innerHTML = `
      <input type="hidden" name="action" value="change-tab" />
      <input type="hidden" name="tab" value="${tabId}" />
      <button 
        type="submit" 
        class="px-4 py-2 rounded font-bold transition-colors bg-amber-400 text-slate-900 border border-amber-200"
        data-tab="${tabId}"
      >
        ${tabId.charAt(0).toUpperCase() + tabId.slice(1)}
      </button>
    `;
    tabsContainer.insertBefore(newTabForm, addTabForm);
    interceptForm(newTabForm);
  }

  const tabName = tabId.charAt(0).toUpperCase() + tabId.slice(1);
  const mainContainer = document.querySelector(
    ".bg-orange-950.border-4.border-amber-200.rounded-lg.overflow-hidden"
  );
  const footer = document.querySelector("footer");

  if (mainContainer && footer) {
    const newTabContent = document.createElement("div");
    newTabContent.id = `tab-${tabId}`;
    newTabContent.setAttribute("data-tab", tabId);
    newTabContent.className = "p-6 block"; // Visible inicialmente

    newTabContent.innerHTML = `
      <h2 class="text-amber-200 text-2xl text-center font-serif mb-4 pb-2 border-b border-amber-200">
        ${tabName} Tasks
      </h2>
      
      <ul class="space-y-2 mb-6">
        <!-- Las tareas se mostrarán aquí -->
      </ul>
      
      <div class="flex flex-wrap justify-center gap-2 mt-2">
        <form method="POST" action="/" class="inline-block">
          <input type="hidden" name="action" value="change-filter" />
          <input type="hidden" name="filter" value="all" />
          <button 
            type="submit" 
            class="px-3 py-1 rounded border border-amber-200 transition-colors bg-amber-200 text-guinness"
            data-filter="all"
          >
            All
          </button>
        </form>
        
        <form method="POST" action="/" class="inline-block">
          <input type="hidden" name="action" value="change-filter" />
          <input type="hidden" name="filter" value="incomplete" />
          <button 
            type="submit" 
            class="px-3 py-1 rounded border border-amber-200 transition-colors bg-medium-wood text-slate-100 hover:bg-amber-800"
            data-filter="incomplete"
          >
            Incomplete
          </button>
        </form>
        
        <form method="POST" action="/" class="inline-block">
          <input type="hidden" name="action" value="change-filter" />
          <input type="hidden" name="filter" value="complete" />
          <button 
            type="submit" 
            class="px-3 py-1 rounded border border-amber-200 transition-colors bg-medium-wood text-slate-100 hover:bg-amber-800"
            data-filter="complete"
          >
            Complete
          </button>
        </form>

        <form method="POST" action="/" class="inline-block">
          <input type="hidden" name="action" value="clear-completed" />
          <input type="hidden" name="tab" value="${tabId}" />
          <button 
            type="submit" 
            class="px-3 py-1 rounded border hover:bg-amber-800 border-amber-200 bg-dark-red hover:bg-red-head text-slate-100 hover:text-guinness transition-colors"
          >
            Clear Completed
          </button>
        </form>
      </div>
    `;

    mainContainer.insertBefore(newTabContent, footer);

    newTabContent.querySelectorAll("form").forEach((form: HTMLFormElement) => {
      interceptForm(form);
    });
  }
}

//REFRESCADO DE LA LISTA DE TAREAS. LA CUAL SE MANEJA CON AJAX Y QUE NO SE RECARGUE
async function refreshTaskList(tab: string): Promise<void> {
  console.log(`Refrescando lista de tareas para pestaña: ${tab}`);

  try {
    const response = await fetch(`/api/tasks?tab=${tab}`);
    if (!response.ok) throw new Error("Error al obtener tareas");

    const data = (await response.json()) as { tasks: Task[] };
    console.log(`${data.tasks.length} tareas recibidas`);

    const taskList = document.querySelector(`#tab-${tab} ul`);
    if (!taskList) {
      console.error(`No se encontró la lista de tareas para #tab-${tab}`);
      return;
    }

    //SE FILTRA EN BASE AL CONTROL QUE APLICO
    let tasksToRender = [...data.tasks];
    if (activeFilter === "complete") {
      tasksToRender = tasksToRender.filter((task) => task.completed);
    } else if (activeFilter === "incomplete") {
      tasksToRender = tasksToRender.filter((task) => !task.completed);
    }

    //GENEACION DE HTML PARA CADA TASK
    let tasksHTML = "";

    tasksToRender.forEach((task) => {
      const completedClass = task.completed ? "completed" : "";
      const textClass = task.completed
        ? "text-light-wood line-through"
        : "text-slate-100";
      const buttonText = task.completed ? "✅" : "🍺";

      tasksHTML += `
        <li class="flex justify-between items-center p-3 bg-amber-950 rounded-lg task-item ${completedClass}" data-task-id="${task.id}">
          <span class="text-lg ${textClass}">
            ${task.text}
          </span>
          <div class="flex gap-2">
            <form method="POST" action="/" class="inline-block">
              <input type="hidden" name="action" value="delete-task" />
              <input type="hidden" name="taskId" value="${task.id}" />
              <input type="hidden" name="tab" value="${tab}" />
              <button 
                type="submit" 
                class="bg-dark-red hover:bg-red-head text-slate-100 hover:text-guinness p-2 rounded border bg-red-900 hover:bg-red-600 border-red-600 transition-colors"
              >
                🛢️
              </button>
            </form>
            
            <form method="POST" action="/" class="inline-block">
              <input type="hidden" name="action" value="toggle-complete" />
              <input type="hidden" name="taskId" value="${task.id}" />
              <input type="hidden" name="tab" value="${tab}" />
              <button 
                type="submit" 
                class="bg-green-900 hover:bg-green-600 text-slate-100 hover:text-guinness p-2 rounded border border-green-400 transition-colors"
              >
                ${buttonText}
              </button>
            </form>
          </div>
        </li>
      `;
    });

    //ACTUALIZACION EL DOM
    taskList.innerHTML = tasksHTML;

    //MAS ABAJO EXPLICO ESTO DE INTERCEPTAR FORMULARIOS
    document
      .querySelectorAll(`#tab-${tab} form`)
      .forEach((formElement) => {
        const form = formElement as HTMLFormElement;
        console.log("Re-interceptando formulario dinámico");
        interceptForm(form);
      });
  } catch (error) {
    console.error("Error al refrescar tareas:", error);
  }
}

//RECOMENDACION POR PARTE DE STACKOVERFLOW QUE MENCIONABAN LOS MULTIPLES LISTENERS QUE PUEDEN PERJUDICAR SU FUNCIONAMIENTO
//CUANDO SE HABLA DE INTERCEPTAR ES PARA QUE LAS PETICIONES DE LOS LISTENERS NO SE ENVIEN COMO PETICIONES NORMALES, SINO QUE SE MANEJEN CON AJAX
function interceptForm(form: HTMLFormElement): void {
  if (form.getAttribute("data-intercepted") === "true") {
    return;
  }

  form.setAttribute("data-intercepted", "true");

  form.addEventListener("submit", async (e: SubmitEvent) => {
    if (form.getAttribute("action") === "/") {
      e.preventDefault();

      const formData = new FormData(form);
      const action = formData.get("action") as string;
      console.log("Interceptando formulario dinámico, acción:", action);

      try {
        let response: Response;

        switch (action) {
          case "toggle-complete":
            const taskId = formData.get("taskId") as string;
            const taskElement = document.querySelector(
              `[data-task-id="${taskId}"]`
            );
            const isCompleted = taskElement?.classList.contains("completed");

            response = await fetch(`/api/tasks/${taskId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ completed: !isCompleted }),
            });
            break;

          case "delete-task":
            response = await fetch(`/api/tasks/${formData.get("taskId")}`, {
              method: "DELETE",
            });
            break;

          case "clear-completed":
            const tab = formData.get("tab") as string;
            response = await fetch("/api/tasks/clear", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ tab }),
            });
            break;

          case "change-filter":
            const filter = formData.get("filter") as FilterType;
            response = await fetch("/api/filter", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ filter }),
            });
            break;

          case "change-tab":
            const newTab = formData.get("tab") as string;
            response = await fetch("/api/tabs", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ tab: newTab }),
            });
            break;

          default:
            form.submit();
            return;
        }

        if (!response.ok) {
          throw new Error(`Error en la solicitud AJAX: ${response.status}`);
        }

        const data = (await response.json()) as APIResponse;
        await updateUI(action, formData, data);
      } catch (error) {
        console.error("Error en AJAX de formulario dinámico:", error);
        alert(
          "Hubo un error en la comunicación. Se procesará la solicitud de manera tradicional."
        );
        form.submit();
      }
    }
  });
}

//APLICADO Y GUARDADO DE FILTROS
function applyFilter(filter: FilterType): void {
  console.log(`Aplicando filtro: ${filter}`);

  const activeTabPanel = document.querySelector('.block[id^="tab-"]');
  if (!activeTabPanel) {
    console.error("No se encontró panel de pestaña activa");
    return;
  }

  activeTabPanel.querySelectorAll(".task-item").forEach((task: Element) => {
    const isCompleted = task.classList.contains("completed");

    if (filter === "all") {
      (task as HTMLElement).style.display = "";
    } else if (filter === "complete" && isCompleted) {
      (task as HTMLElement).style.display = "";
    } else if (filter === "incomplete" && !isCompleted) {
      (task as HTMLElement).style.display = "";
    } else {
      (task as HTMLElement).style.display = "none";
    }
  });
}

// Función para agregar atributos data-* a elementos
function addDataAttributes(): void {
  console.log("Agregando atributos data-* a elementos");

  // Agregar data-task-id a los elementos de tareas
  document.querySelectorAll("li").forEach((li: Element) => {
    const taskIdInput = li.querySelector(
      'input[name="taskId"]'
    ) as HTMLInputElement | null;
    if (taskIdInput) {
      const taskId = taskIdInput.value;
      li.setAttribute("data-task-id", taskId);

      // Agregar clase 'completed' si está completada
      const taskText = li.querySelector("span");
      if (taskText && taskText.classList.contains("line-through")) {
        li.classList.add("completed");
        li.classList.add("task-item");
      }
    }
  });

  // Agregar data-filter a los botones de filtro
  document
    .querySelectorAll('input[name="filter"]')
    .forEach((input: Element) => {
      const filter = (input as HTMLInputElement).value;
      const button = input
        .closest("form")
        ?.querySelector('button[type="submit"]');
      if (button) {
        button.setAttribute("data-filter", filter);
      }
    });

  // Agregar data-tab a los botones de pestaña
  document.querySelectorAll('input[name="tab"]').forEach((input: Element) => {
    const tab = (input as HTMLInputElement).value;
    const action = input
      .closest("form")
      ?.querySelector('input[name="action"]') as HTMLInputElement | null;

    if (action && action.value === "change-tab") {
      const button = input
        .closest("form")
        ?.querySelector('button[type="submit"]');
      if (button) {
        button.setAttribute("data-tab", tab);
      }
    }
  });

  //VALIDACION AGREGADA POR COPILOT
  document.querySelectorAll("form").forEach((form: HTMLFormElement) => {
    form.setAttribute("data-intercepted", "false");
  });
}
