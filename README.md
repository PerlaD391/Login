# 🎓 Sistema Escolar con Autenticación y Panel de Captura

**Materia:** Programación Web  
**Actividad:** Actividad 5 · Programación Web · 7SC  
**Alumna / Integrante:** Martinez Nieto Adelina  
**Repositorio / Ubicación:** `c:\xampp\htdocs\Actividad5\Login`  

---

## 📋 Portada y Descripción Breve del Proyecto

El **Sistema Escolar con Autenticación** es una aplicación web interactiva desarrollada en dos pantallas principales (`login.html` e `index.html`) que simula el control de acceso y la administración escolar. 

El proyecto integra:
- 🔐 **Pantalla de Login y Registro:** Formulario de inicio de sesión con ocultamiento/visibilidad de contraseñas, validación de correo y contraseña mediante expresiones regulares y módulo de registro flotante (modal) persistido en `localStorage`.
- 👤 **Navbar Dinámico con Control de Sesión:** Muestra el nombre y correo del usuario autenticado en un menú desplegable (dropdown) con opción de cierre de sesión seguro.
- 📂 **Sidebar Lateral Animado:** Menú lateral responsivo con submenús colapsables y control de navegación entre la vista de bienvenida y los formularios de captura.
- 📝 **Formulario de Captura de Usuarios:** Formulario para registrar nuevos accesos con validaciones de nombre (solo letras), formato de correo y requisitos de contraseña.
- 🎓 **Registro y Validación de Alumnos:** Formulario especializado que valida un **Número de Control de exactamente 6 dígitos enteros** y evalúa la fecha de nacimiento.
- 🎂 **Modal Interactivo de Mayoría de Edad:** Ventana emergente dinámica que calcula la edad exacta del alumno y despliega un resultado estilizado (verde para mayor de edad, amarillo/naranja para menor de edad).

---

## 🎨 Explicación y Documentación Técnica

### 1. Framework CSS Utilizado

Para el diseño del sistema se utilizó **Bootstrap 5 (v5.3.3)** cargado a través de CDN, junto con la librería de iconos **Font Awesome 6.5.1** y un archivo CSS personalizado (`css/login.css`).

| Tecnología / Componente | Justificación y Uso |
|:---|:---|
| **Bootstrap 5.3.3 (CDN)** | Proporciona la estructura del grid responsivo, tarjetas (`cards`), modales (`bootstrap.Modal`), barra de navegación (`navbar`), clases de utilidad (`bg-primary`, `bg-dark`, `bg-success`, `bg-warning`) y componentes interactivas. |
| **Font Awesome 6.5.1** | Aporta la iconografía visual para los campos de entrada, botones de ojo (`fa-eye` / `fa-eye-slash`), iconos de usuario, escudo de seguridad y badges. |
| **Vanilla CSS (`css/login.css`)** | Define las transiciones fluidas del sidebar (`left: -250px` a `left: 0`), estilos de enlaces activos, ajustes de layout fija para el navbar y ajustes responsivos mediante Media Queries (`@media (min-width: 992px)`). |

> **Nota:** No se emplearon frameworks de JavaScript (como React, Angular o Vue) ni Tailwind CSS, dando cumplimiento a los requerimientos de JavaScript vanilla y manipulación directa del DOM.

---

### 2. Flujo del Login hacia el Sistema

La aplicación está dividida en dos páginas Web independientes conectadas a través del estado de la sesión en el navegador (`localStorage`):

```
┌─────────────────────────────────┐           ┌─────────────────────────────────┐
│           login.html            │           │           index.html            │
│  - Formulario de Autenticación  │           │      - Panel de Administración  │
│  - Modal de Registro de Usuario │  ──────►  │      - Navbar con Nombre        │
│  - Almacena 'usuarioSesion'     │           │      - Sidebar y Formularios    │
└─────────────────────────────────┘           └─────────────────────────────────┘
                 ▲                                             │
                 │                                             │
                 └───────────── Logout (btnSalir) ──────────────┘
```

#### Paso 1: Autenticación / Registro en `login.html`
1. El usuario ingresa sus credenciales en `login.html`.
2. Se invocan las funciones de validación de `utileria.js` (`validarCorreo` y `validarPassword`).
3. El módulo `moduloAutenticacion.validarCredenciales(correo, password)` busca el correo en la clave `usuariosRegistrados` de `localStorage`.
4. Si coincide la contraseña, se invoca `moduloAutenticacion.establecerSesion(usuario)`.

#### Paso 2: Creación de la Sesión y Redirección
Se almacena en `localStorage` con la clave `'usuarioSesion'` un objeto con los datos del usuario:

```javascript
localStorage.setItem('usuarioSesion', JSON.stringify({
    id: usuario.id,
    correo: usuario.correo,
    nombre: usuario.nombre,
    fechaLogin: new Date().toISOString()
}));

// Redirección inmediata al panel principal
window.location.href = 'index.html';
```

#### Paso 3: Verificación de Sesión en `index.html`
Al cargar `index.html`, la función `inicializarSistema()` consulta la sesión mediante `moduloAutenticacion.obtenerSesion()`:
- **Si no existe sesión:** Redirige automáticamente a `login.html`.
- **Si existe sesión:** Inyecta la información en el navbar y habilita las funciones del panel.

#### Paso 4: Logout (Cierre de Sesión)
Al presionar el botón "Salir del sistema" en el dropdown del navbar:
```javascript
moduloAutenticacion.cerrarSesion(); // Elimina 'usuarioSesion' de localStorage
window.location.href = 'login.html';
```

---

### 3. ¿Cómo se pasa el Nombre de Usuario del Login al Navbar?

Dado que `login.html` e `index.html` son páginas HTML distintas y no se dispone de un backend con variables de sesión PHP o cookies de servidor, la información se transfiere utilizando **`localStorage`**.

#### Diagrama de paso de datos:
1. **En `login.html` (Al iniciar sesión o registrarse):**
   El nombre de usuario se genera o extrae (por defecto la parte previa al `@` del correo o el nombre ingresado) y se guarda en el JSON de la sesión:
   ```javascript
   const nuevoUsuario = {
       id: Date.now(),
       nombre: nombre || correo.split('@')[0],
       correo: correo,
       password: password,
       fechaRegistro: new Date().toISOString()
   };
   ```

2. **En `index.html` (Al cargar el DOM):**
   El script ejecuta `inicializarSistema()` la cual recupera el objeto guardado y actualiza dinámicamente el contenido del HTML:
   ```javascript
   const usuario = moduloAutenticacion.obtenerSesion();

   // Actualización de elementos HTML en el Navbar
   document.getElementById('nombreUsuarioNavbar').textContent = usuario.nombre;
   document.getElementById('correoUsuarioNavbar').textContent = usuario.correo;
   ```

3. **En el HTML del Navbar (`index.html`):**
   ```html
   <button class="btn btn-dark dropdown-toggle" type="button" id="dropdownUsuario" data-bs-toggle="dropdown">
       <i class="fas fa-user-circle me-2"></i>
       <span id="nombreUsuarioNavbar">Usuario</span>
   </button>
   ```

---

### 4. Métodos Principales del Código (`js/login.js`)

#### Módulo de Autenticación (`moduloAutenticacion`) - Patrón Módulo IIFE

| Método | Parámetros | Descripción |
|:---|:---|:---|
| `obtenerUsuarios()` | Ninguno | Recupera el arreglo de usuarios almacenados en `localStorage` (`usuariosRegistrados`). |
| `guardarUsuarios(usuarios)` | `usuarios` (Array) | Guarda el arreglo actualizado de usuarios en `localStorage`. |
| `buscarPorCorreo(correo)` | `correo` (String) | Busca un usuario por coincidencia de correo (insensible a mayúsculas/minúsculas). |
| `registrar(correo, password, nombre)` | `correo`, `password`, `nombre` | Valida duplicados, crea el objeto usuario y lo guarda de forma permanente. |
| `validarCredenciales(correo, password)` | `correo`, `password` | Comprueba si el usuario existe y si la contraseña coincide. |
| `establecerSesion(usuario)` | `usuario` (Object) | Crea el registro `'usuarioSesion'` en `localStorage`. |
| `obtenerSesion()` | Ninguno | Retorna el objeto de la sesión activa o `null` si no se ha iniciado sesión. |
| `cerrarSesion()` | Ninguno | Elimina la clave `'usuarioSesion'` de `localStorage`. |

#### Funciones de Inicialización y Control de Interfaz

| Función | Descripción |
|:---|:---|
| `inicializarLogin()` | Gestiona el formulario de login, los alternadores de visibilidad de contraseña (ojito), el modal de registro y la validación de acceso. |
| `inicializarSistema()` | Verifica la sesión del usuario, inyecta los datos en el navbar, configura los eventos del sidebar, la navegación entre secciones y el botón de logout. |
| `inicializarFormUsuario()` | Escucha el submit del formulario de captura de usuario, valida campos e invoca el registro. |
| `inicializarFormAlumno()` | Procesa el formulario de alumnos, valida que el **Número de Control contenga exactamente 6 dígitos** (`/^\d+$/`), calcula la edad e invoca el modal. |
| `mostrarAlerta(mensaje, tipo)` | Muestra notificaciones flotantes dinámicas en la parte superior del panel principal. |

#### Funciones de Librería Externa (`utileria.js`)

| Función | Descripción |
|:---|:---|
| `validarCorreo(correo)` | Verifica que la cadena cumpla con la estructura de email válido. |
| `validarPassword(password)` | Valida mínimo 8 caracteres, mayúscula, minúscula, número y símbolo especial. |
| `soloLetras(texto)` | Comprueba con expresiones regulares que el texto contenga únicamente letras y espacios. |
| `calcularEdad(fechaNacimiento)` | Calcula los años cumplidos en base a la fecha actual. |
| `esMayorDeEdad(fechaNacimiento)` | Retorna `true` si la edad es igual o superior a 18 años. |

---

## 🛠️ Proceso de Creación Paso a Paso

### Paso 1: Configuración de la Estructura del Proyecto
Se organizó la estructura de archivos en el workspace local `c:\xampp\htdocs\Actividad5\Login`:

```
/Login
├── README.md              # Documentación oficial de la actividad
├── login.html             # Pantalla de acceso y modal de registro
├── index.html             # Panel principal con sidebar, navbar y formularios
├── /css
│   └── login.css          # Estilos CSS personalizados (Sidebar, layout responsivo)
├── /js
│   └── login.js           # Lógica JavaScript (Autenticación, DOM, Validaciones)
└── /img                   # Directorio para capturas de pantalla del flujo
```

---

### Paso 2: Armado del Login y Modal de Registro (`login.html`)

1. **Diseño de la Card de Login:** Se creó una tarjeta centrada con icono de escudo (`fa-user-shield`), campos para correo y contraseña, e icono de ojo en un grupo de entrada (`input-group`).
2. **Alternador de Contraseña ("Ojito"):** Mediante JavaScript se alterna el atributo `type` del input entre `'password'` y `'text'`, cambiando simultáneamente el icono entre `fa-eye` y `fa-eye-slash`.
3. **Modal de Registro (#modalRegistro):** Se incorporó un modal Bootstrap que permite registrar nuevos usuarios con campos de correo, contraseña y confirmación de contraseña.

```html
<!-- Ejemplo del campo contraseña con ojo en login.html -->
<div class="input-group">
    <input type="password" class="form-control" id="password" placeholder="Mín. 8 caracteres">
    <button class="btn btn-outline-secondary" type="button" id="togglePassword">
        <i class="fas fa-eye" id="toggleIcon"></i>
    </button>
</div>
```

> 📷 **Captura de Pantalla - Pantalla de Login:**  
> ![Login](img/captura-login.png)

> 📷 **Captura de Pantalla - Modal de Registro de Usuario:**  
> ![Registro](img/captura-registro.png)

---

### Paso 3: Armado del Sidebar Dinámico (`index.html`)

1. **Estructura Flotante y Animación:** El sidebar cuenta con `position: fixed; left: -250px;` y una transición de CSS (`transition: left 0.3s ease`).
2. **Botón Hamburguesa (`#btnToggleSidebar`):** Al hacer clic, alterna la clase `.abierto` en la barra lateral y `.desplazado` en el contenido principal (`#contenidoPrincipal`).
3. **Submenú Desplegable (#submenuUsuarios):** El elemento "Usuarios" expande suavemente la opción "Captura" modificando la propiedad `max-height`.
4. **Navegación de Secciones:** Al presionar "Captura", se oculta la sección de bienvenida (`#seccionBienvenida`) y se visualiza la sección con los formularios (`#seccionCaptura`).

```javascript
btnToggleSidebar.addEventListener('click', function () {
    sidebar.classList.toggle('abierto');
    sidebar.classList.toggle('cerrado');
    contenidoPrincipal.classList.toggle('desplazado');
    contenidoPrincipal.classList.toggle('completo');
});
```

> 📷 **Captura de Pantalla - Sidebar Plegado y Desplegado:**  
> ![Sidebar](img/captura-sidebar.png)

---

### Paso 4: Armado del Navbar con Información del Usuario

1. **Barra Fija Fija Superior (`.sistema-navbar`):** Integrada con la clase `fixed-top` y tema oscuro de Bootstrap (`navbar-dark bg-dark`).
2. **Menú Desplegable de Usuario (`#dropdownUsuario`):** Muestra el icono `fa-user-circle`, el nombre del usuario logueado (`#nombreUsuarioNavbar`) y en el encabezado del dropdown su correo (`#correoUsuarioNavbar`).
3. **Control de Logout (`#btnSalir`):** Muestra un diálogo de confirmación y elimina la sesión.

```html
<div class="dropdown ms-auto">
    <button class="btn btn-dark dropdown-toggle" type="button" id="dropdownUsuario" data-bs-toggle="dropdown">
        <i class="fas fa-user-circle me-2"></i>
        <span id="nombreUsuarioNavbar">Usuario</span>
    </button>
    <ul class="dropdown-menu dropdown-menu-end">
        <li>
            <h6 class="dropdown-header">
                <i class="fas fa-envelope me-2"></i>
                <span id="correoUsuarioNavbar"></span>
            </h6>
        </li>
        <li><hr class="dropdown-divider"></li>
        <li>
            <a class="dropdown-item text-danger" href="#" id="btnSalir">
                <i class="fas fa-sign-out-alt me-2"></i>Salir del sistema
            </a>
        </li>
    </ul>
</div>
```

> 📷 **Captura de Pantalla - Navbar y Menú del Usuario:**  
> ![Navbar Usuario](img/captura-navbar.png)

---

### Paso 5: Formulario de Registro y Validación con Número de Control

En la sección de captura se incluyen dos formularios en tarjetas independientes:

1. **Captura de Usuario:** Valida el nombre de usuario, correo y la contraseña.
2. **Registro y Validación de Alumnos (`#formAlumno`):**
   - **Nombre del Alumno:** Evaluado con `soloLetras()`.
   - **Número de Control:** Campo con `maxlength="6"`. Se valida en JavaScript con la expresión regular `/^\d+$/` exigiendo **exactamente 6 dígitos numéricos**.
   - **Fecha de Nacimiento:** Campo de tipo `date` con comprobación de fecha válida y no futura.

```javascript
// Código de validación del Número de Control (6 dígitos exactos)
const soloDigitos = /^\d+$/.test(numControl);
if (!soloDigitos || numControl.length !== 6) {
    errNumControl.style.setProperty('display', 'block', 'important');
    inputNumControl.classList.add('is-invalid');
    valido = false;
} else {
    errNumControl.style.setProperty('display', 'none', 'important');
    inputNumControl.classList.remove('is-invalid');
}
```

> 📷 **Captura de Pantalla - Formulario de Captura de Alumnos (Validación 6 Dígitos):**  
> ![Formulario Alumnos](img/captura-formulario.png)

---

### Paso 6: Construcción del Modal de Mayoría de Edad (`#modalEdadAlumno`)

Cuando el formulario de alumno supera las validaciones de campos y número de control:

1. Se calcula la edad mediante `calcularEdad(fecha)`.
2. Se evalúa la condición de mayoría de edad mediante `esMayorDeEdad(fecha)`.
3. **Personalización Dinámica del Modal:**
   - **Si es Mayor de Edad (≥ 18 años):** El encabezado adopta la clase `bg-success`, se muestra el icono `fa-check-circle` de color verde y el título "Alumno Mayor de Edad".
   - **Si es Menor de Edad (< 18 años):** El encabezado cambia a `bg-warning text-dark`, muestra el icono `fa-exclamation-triangle` y el título "Alumno Menor de Edad".

```javascript
if (esMayor) {
    modalHeader.className = 'modal-header bg-success text-white';
    modalIcono.innerHTML = '<i class="fas fa-check-circle text-success"></i>';
    modalTitulo.textContent = 'Alumno Mayor de Edad';
    modalDetalle.textContent = nombre + ' (No. Control: ' + numControl + ') tiene ' + edad + ' años cumplidos. Cumple con la mayoría de edad legal.';
} else {
    modalHeader.className = 'modal-header bg-warning text-dark';
    modalIcono.innerHTML = '<i class="fas fa-exclamation-triangle text-warning"></i>';
    modalTitulo.textContent = 'Alumno Menor de Edad';
    modalDetalle.textContent = nombre + ' (No. Control: ' + numControl + ') tiene ' + edad + ' años cumplidos. No cumple con la mayoría de edad.';
}
```

> 📷 **Captura de Pantalla - Modal de Mayoría de Edad (Resultado Alumno):**  
> ![Modal Edad](img/captura-modal.png)

---

## 📸 Capturas de Pantalla del Flujo Completo Funcionando

A continuación se presentan los espacios correspondientes a cada captura de pantalla del flujo operativo del sistema:

### 1. Pantalla Inicial de Login (`login.html`)
> 📷 **[Espacio para captura: Formulario de Login]**  
> ![Pantalla de Login](img/captura-login.png)

---

### 2. Modal Emergente de Registro de Cuenta
> 📷 **[Espacio para captura: Modal de Registro]**  
> ![Modal de Registro](img/captura-registro.png)

---

### 3. Panel Principal del Sistema y Vista de Bienvenida (`index.html`)
> 📷 **[Espacio para captura: Vista Principal del Sistema]**  
> ![Panel del Sistema](img/captura-sistema.png)

---

### 4. Menú Lateral (Sidebar) Desplegado con Submenú de Usuarios
> 📷 **[Espacio para captura: Sidebar Operativo]**  
> ![Sidebar Operativo](img/captura-sidebar.png)

---

### 5. Navbar con Menú Desplegable (Dropdown) del Usuario Logueado
> 📷 **[Espacio para captura: Dropdown del Usuario]**  
> ![Dropdown de Usuario](img/captura-dropdown.png)

---

### 6. Formularios de Captura de Usuario y Validación de Alumno (Número de Control de 6 Dígitos)
> 📷 **[Espacio para captura: Formularios de Captura]**  
> ![Formularios de Captura](img/captura-formulario.png)

---

### 7. Modal Resultado de Mayoría de Edad del Alumno
> 📷 **[Espacio para captura: Modal Resultado de Edad]**  
> ![Modal Resultado Edad](img/captura-modal.png)

---

## 👥 Datos de la Asignatura e Integrantes

- **Materia:** Programación Web
- **Actividad:** Actividad 5
- **Grupo:** 7SC
- **Integrante / Autora:** Martinez Nieto Adelina
- **Tecnologías:** HTML5, CSS3, JavaScript (ES6+), Bootstrap 5.3.3, Font Awesome 6.5.1
