# 🔐 Sistema Escolar con Login

**Proyecto:** Sistema de acceso y gestión escolar con login funcional, registro de usuarios y captura de alumnos.

**Integrantes del equipo:**
- 👤 Perla Danae Gallardo Vasquez — Login, navbar y logout
- 👤 Dante Azael Villalobos — Sidebar, formulario de captura y modal de edad

**Materia:** Programación Web
**Repositorio:** [https://github.com/PerlaD391/Login](https://github.com/PerlaD391/Login)
**Demo en vivo:** [https://tu-usuario.github.io/sistema-login/](https://tu-usuario.github.io/sistema-login/)

---

## 📋 Descripción Breve del Proyecto

**Sistema Escolar con Login** es una aplicación web de dos pantallas conectadas que simula el acceso y la gestión de un sistema escolar real. El proyecto demuestra:

- ✅ Un **login funcional** que valida usuarios registrados contra `localStorage`
- ✅ Un **registro de usuarios** que guarda credenciales de forma persistente
- ✅ Un **panel principal** con sidebar, navbar dinámico y opción de cerrar sesión
- ✅ Un **formulario de captura de alumnos** con validaciones completas
- ✅ Un **modal de edad** que verifica si el alumno es mayor o menor de edad
- ✅ Una **tabla de alumnos registrados** con opción de eliminar

Todo esto sin usar frameworks de JavaScript, solo **HTML, CSS, JavaScript puro y Bootstrap 5** para el diseño visual.

---

## 🎨 Framework CSS Utilizado

Elegimos **Bootstrap 5 (v5.3.3)** porque:

| Ventaja | Descripción |
|:---|:---|
| **Componentes prediseñados** | Navbar, sidebar, modales, dropdowns y formularios listos para usar |
| **Responsivo por defecto** | Se adapta automáticamente a móvil, tablet y escritorio |
| **Documentación completa** | Existe una gran comunidad y ejemplos oficiales |
| **Sin dependencias pesadas** | Solo se carga el CSS y el JS desde CDN |
| **Compatible con JS puro** | No requiere React, Vue ni otros frameworks |

**NO usamos Tailwind** ni frameworks de JavaScript como React o Vue, tal como lo pide la rúbrica.

---

## 🔄 Flujo del Login hacia el Sistema

El proyecto tiene **dos pantallas conectadas**:

```
┌──────────────────┐         ┌──────────────────┐
│   login.html     │  ────►  │   index.html     │
│  (Autenticación) │         │  (Panel sistema) │
└──────────────────┘         └──────────────────┘
        ▲                             │
        │                             │
        └──────── Logout ─────────────┘
```

### Paso 1: Autenticación en `login.html`

El usuario ingresa su correo y contraseña. El sistema valida:

1. **Formato del correo** con `Utileria.validarCorreo()`
2. **Seguridad de la contraseña** con `Utileria.validarPassword()`
3. **Existencia del usuario** en `localStorage`
4. **Coincidencia de la contraseña** con la registrada

```javascript
const resultado = GestorUsuarios.validarCredenciales(correo, password);

if (!resultado.exito) {
    if (resultado.motivo === 'no-existe') {
        // "Usuario no registrado. Crea una cuenta aquí."
    } else if (resultado.motivo === 'password-incorrecta') {
        // "Contraseña incorrecta. Intenta de nuevo."
    }
    return;
}
```

### Paso 2: Guardar sesión y redirigir

Si las credenciales son correctas, se guarda la sesión en `localStorage`:

```javascript
localStorage.setItem('usuarioSesion', JSON.stringify({
    id: resultado.usuario.id,
    correo: resultado.usuario.correo,
    nombre: resultado.usuario.nombre,
    fechaLogin: new Date().toISOString()
}));

window.location.href = 'index.html';
```

### Paso 3: Leer la sesión en `index.html`

Al cargar el sistema, se verifica que exista una sesión activa:

```javascript
const sesion = localStorage.getItem('usuarioSesion');

if (!sesion) {
    window.location.href = 'login.html';  // Sin sesión → regresar al login
    return;
}

const usuario = JSON.parse(sesion);
```

### Paso 4: Logout

Al hacer clic en "Salir del sistema":

```javascript
localStorage.removeItem('usuarioSesion');
window.location.href = 'login.html';
```

---

## 🔑 ¿Cómo se pasa el nombre de usuario del login al navbar?

Usamos **`localStorage`** como "puente" entre las dos pantallas. Esta es la técnica más simple y efectiva cuando no se tiene backend.

### ¿Por qué `localStorage` y no otra técnica?

| Técnica | ¿Por qué NO? |
|:---|:---|
| **Variables globales** | Se pierden al cambiar de página |
| **URL con parámetros** | Poco seguro y poco elegante |
| **Cookies** | Más complejas de manejar |
| **Sesiones del servidor** | Requieren backend |
| **`localStorage`** ✅ | Persiste entre páginas, simple, sin backend |

### Flujo detallado:

**1. En `login.html` (se guarda):**
```javascript
localStorage.setItem('usuarioSesion', JSON.stringify({
    id: resultado.usuario.id,
    correo: resultado.usuario.correo,
    nombre: resultado.usuario.nombre,   // ← NOMBRE REAL
    fechaLogin: new Date().toISOString()
}));
```

**2. En `index.html` (se lee):**
```javascript
const usuario = JSON.parse(localStorage.getItem('usuarioSesion'));
document.getElementById('nombreUsuarioNavbar').textContent = usuario.nombre;
document.getElementById('correoUsuarioNavbar').textContent = usuario.correo;
```

**3. En el HTML del navbar:**
```html
<button class="btn btn-dark dropdown-toggle" data-bs-toggle="dropdown">
    <i class="fas fa-user-circle me-2"></i>
    <span id="nombreUsuarioNavbar">Usuario</span>
</button>
```

El `<span>` con id `nombreUsuarioNavbar` es el que recibe el nombre real del usuario.

---

## 🧩 Métodos Principales

### Librería `utileria.js` (validaciones reutilizables)

| Método | Descripción |
|:---|:---|
| `Utileria.validarCorreo(correo)` | Valida el formato de un correo electrónico |
| `Utileria.soloLetras(texto)` | Valida que un texto solo tenga letras |
| `Utileria.validarLongitud(numero, max)` | Valida la longitud de un número |
| `Utileria.calcularEdad(fechaNacimiento)` | Calcula la edad exacta |
| `Utileria.esMayorDeEdad(fechaNacimiento)` | Verifica si es mayor de 18 años |
| `Utileria.validarPassword(password)` | Valida que la contraseña sea segura |

### Gestor de Usuarios (login)

| Método | Descripción |
|:---|:---|
| `GestorUsuarios.registrar(correo, password)` | Registra un nuevo usuario |
| `GestorUsuarios.validarCredenciales(correo, password)` | Valida las credenciales de login |
| `GestorUsuarios.buscarPorCorreo(correo)` | Busca un usuario por su correo |
| `GestorUsuarios.obtenerUsuarios()` | Devuelve todos los usuarios registrados |

### Gestor de Alumnos (sistema)

| Método | Descripción |
|:---|:---|
| `GestorAlumnos.agregarAlumno(alumno)` | Agrega un nuevo alumno |
| `GestorAlumnos.eliminarAlumno(id)` | Elimina un alumno por su ID |
| `GestorAlumnos.buscarPorCorreo(correo)` | Busca un alumno por correo |
| `GestorAlumnos.buscarPorNumeroControl(numero)` | Busca un alumno por número de control |

### Funciones del sistema

| Función | Descripción |
|:---|:---|
| `inicializarLogin()` | Configura el formulario de login |
| `inicializarSistema()` | Configura el panel del sistema |
| `renderizarTablaAlumnos()` | Renderiza la tabla de alumnos |
| `mostrarModalEdad()` | Muestra el modal con el resultado |
| `togglePasswordVisibility()` | Muestra/oculta la contraseña (ojito) |
| `activarLink()` | Cambia la sección activa del sidebar |

---

## 🛠️ Proceso de Creación Paso a Paso

### 🔹 Paso 1: División del trabajo

Para garantizar una participación equilibrada (50/50 en los commits), dividimos el trabajo así:

| Integrante | Responsabilidades |
|:---|:---|
| **Integrante A** | `login.html`, lógica del login, navbar con dropdown, logout |
| **Integrante B** | `index.html`, sidebar, formulario de captura, número de control, modal de edad |

Cada quien subió sus avances por separado con commits descriptivos.

---

### 🔹 Paso 2: Estructura de archivos

Organizamos el proyecto siguiendo la estructura que pide la rúbrica:

```
/sistema-login
├── README.md
├── login.html
├── index.html
├── /css
│   └── login.css
├── /js
│   ├── utileria.js      (librería del proyecto anterior)
│   └── login.js         (lógica del login y del sistema)
└── /img
    ├── captura-login.png
    ├── captura-sistema.png
    ├── captura-formulario.png
    ├── captura-modal.png
    └── captura-dropdown.png
```

---

### 🔹 Paso 3: Construcción del Login (`login.html`)

**Estructura del formulario:**

```html
<form id="loginForm" autocomplete="off">
    <div class="mb-3">
        <label for="correo">Correo electrónico</label>
        <input type="text" id="correo" class="form-control" placeholder="correo@ejemplo.com">
    </div>

    <div class="mb-4">
        <label for="password">Contraseña</label>
        <div class="input-group">
            <input type="password" id="password" class="form-control">
            <button type="button" id="togglePassword">
                <i class="fas fa-eye" id="toggleIcon"></i>
            </button>
        </div>
    </div>

    <button type="button" id="btnLogin" class="btn btn-primary w-100">
        Entrar al sistema
    </button>
</form>
```

**Lógica de validación:**

1. Verificar que los campos no estén vacíos
2. Validar el formato del correo con `Utileria.validarCorreo()`
3. Validar la seguridad de la contraseña con `Utileria.validarPassword()`
4. Buscar el usuario en `localStorage`
5. Comparar la contraseña
6. Redirigir a `index.html`

**Modal de registro (solo correo y contraseña):**

Se agregó un modal que aparece al hacer clic en "Regístrate aquí". Solo pide:
- Correo electrónico
- Contraseña
- Confirmar contraseña

El nombre de usuario se genera automáticamente desde la parte antes del `@` del correo.

---

### 🔹 Paso 4: Construcción del Sidebar (`index.html`)

**Estructura HTML:**

```html
<div class="sidebar" id="sidebar">
    <div class="sidebar-header">
        <h5><i class="fas fa-graduation-cap me-2"></i>Menú</h5>
    </div>
    <ul class="sidebar-menu">
        <li>
            <a href="#" class="sidebar-link active" id="linkInicio">
                <i class="fas fa-home me-2"></i>Inicio
            </a>
        </li>
        <li>
            <a href="#" class="sidebar-link" id="toggleUsuarios">
                <i class="fas fa-users me-2"></i>Usuarios
                <i class="fas fa-chevron-down ms-auto"></i>
            </a>
            <ul class="sidebar-submenu" id="submenuUsuarios">
                <li>
                    <a href="#" class="sidebar-sublink" id="linkCaptura">
                        <i class="fas fa-user-plus me-2"></i>Captura
                    </a>
                </li>
            </ul>
        </li>
    </ul>
</div>
```

**Funcionalidades implementadas:**

1. **Botón hamburguesa** que abre/cierra el sidebar con animación
2. **Submenú desplegable** de Usuarios con transición suave
3. **Cambio de sección activa** al hacer clic en cualquier opción
4. **Cierre automático en móvil** después de seleccionar una opción

**Función `activarLink()` que resalta el link actual:**

```javascript
function activarLink(linkActivo) {
    document.querySelectorAll('.sidebar-link, .sidebar-sublink').forEach(function (link) {
        link.classList.remove('active');
    });
    linkActivo.classList.add('active');
}
```

---

### 🔹 Paso 5: Construcción del Navbar con el Usuario

**Estructura:**

```html
<nav class="navbar navbar-dark bg-dark fixed-top">
    <button class="btn btn-dark" id="btnToggleSidebar">
        <i class="fas fa-bars"></i>
    </button>
    <span class="navbar-brand">Sistema Escolar</span>
    
    <div class="dropdown ms-auto">
        <button class="btn btn-dark dropdown-toggle" data-bs-toggle="dropdown">
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
</nav>
```

**Lógica para mostrar el nombre:**

```javascript
document.getElementById('nombreUsuarioNavbar').textContent = usuario.nombre;
document.getElementById('correoUsuarioNavbar').textContent = usuario.correo;
```

**Logout:**

```javascript
document.getElementById('btnSalir').addEventListener('click', function (e) {
    e.preventDefault();
    if (confirm('¿Estás seguro que deseas salir del sistema?')) {
        localStorage.removeItem('usuarioSesion');
        window.location.href = 'login.html';
    }
});
```

---

### 🔹 Paso 6: Formulario de Captura con Número de Control

**Campos del formulario:**

| Campo | Tipo | Validación |
|:---|:---|:---|
| Nombre de usuario | texto | `Utileria.soloLetras()` |
| Correo electrónico | texto | `Utileria.validarCorreo()` |
| Contraseña | password | `Utileria.validarPassword()` + ojito |
| Número de control | texto | 6 dígitos exactos |
| Fecha de nacimiento | date | No puede ser futura |

**Validación del número de control (6 dígitos):**

```javascript
if (!Utileria.validarLongitud(numeroControl, 6) || numeroControl.length !== 6) {
    mensajeCaptura.textContent = 'El número de control debe tener exactamente 6 dígitos.';
    return;
}
```

**Validación de duplicados:**

```javascript
if (GestorAlumnos.buscarPorCorreo(correo)) {
    mensajeCaptura.textContent = 'Ese correo ya está registrado en otro alumno.';
    return;
}

if (GestorAlumnos.buscarPorNumeroControl(numeroControl)) {
    mensajeCaptura.textContent = 'Ese número de control ya está registrado.';
    return;
}
```

**Ojito para ver/ocultar la contraseña:**

```html
<div class="input-group">
    <input type="password" id="passwordCaptura" class="form-control">
    <button type="button" id="toggleCapturaPassword">
        <i class="fas fa-eye" id="toggleIconCaptura"></i>
    </button>
</div>
```

```javascript
btnToggleCaptura.addEventListener('click', function () {
    togglePasswordVisibility(inputPasswordCaptura, toggleIconCaptura);
});
```

---

### 🔹 Paso 7: Modal de Edad

El modal se muestra después de guardar un alumno exitosamente. Verifica:

1. **Edad calculada** con `Utileria.calcularEdad()`
2. **Mayoría de edad** con `Utileria.esMayorDeEdad()`
3. **Protección contra fechas futuras** (evita edades negativas)

**Protección contra edades negativas:**

```javascript
let edad = Utileria.calcularEdad(fechaNacimiento);

if (edad < 0) {
    mensajeCaptura.textContent = 'La fecha de nacimiento no puede ser futura.';
    return;
}

const hoy = new Date();
const fechaNac = new Date(fechaNacimiento);
if (fechaNac > hoy) {
    mensajeCaptura.textContent = 'La fecha de nacimiento no puede ser futura.';
    return;
}
```

**Función que muestra el modal:**

```javascript
function mostrarModalEdad(nombre, edad, esMayor) {
    const modal = new bootstrap.Modal(document.getElementById('modalEdad'));
    
    if (esMayor) {
        tituloModal.textContent = '¡Mayor de edad!';
        textoModal.textContent = nombre + ' tiene la edad suficiente para acceder al sistema.';
        iconoModal.className = 'fas fa-user-check fa-4x text-success mb-3';
    } else {
        tituloModal.textContent = 'Menor de edad';
        textoModal.textContent = nombre + ' NO tiene la edad suficiente para acceder al sistema.';
        iconoModal.className = 'fas fa-user-times fa-4x text-danger mb-3';
    }
    
    edadModal.textContent = 'Edad: ' + edad + ' años';
    modal.show();
}
```

---

### 🔹 Paso 8: Tabla de Alumnos Registrados

La tabla se renderiza dinámicamente con los datos de `localStorage`:

```javascript
function renderizarTablaAlumnos() {
    const alumnos = GestorAlumnos.obtenerAlumnos();
    const tabla = document.getElementById('tablaAlumnos');
    
    let html = '';
    alumnos.forEach(function (alumno, index) {
        const claseEdad = alumno.esMayor ? 'success' : 'danger';
        const textoEdad = alumno.esMayor ? 'Sí' : 'No';
        
        html += `
            <tr>
                <td>${index + 1}</td>
                <td>${alumno.nombre}</td>
                <td>${alumno.correo}</td>
                <td>${alumno.numeroControl}</td>
                <td>${alumno.edad} años</td>
                <td><span class="badge bg-${claseEdad}">${textoEdad}</span></td>
                <td>
                    <button onclick="eliminarAlumno(${alumno.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    tabla.innerHTML = html;
}
```

---

### 🔹 Paso 9: Publicación en GitHub Pages

1. Subimos todos los archivos a GitHub
2. Fuimos a **Settings → Pages**
3. Seleccionamos la rama `main` y carpeta `/ (root)`
4. Guardamos y esperamos 1 minuto
5. ¡Listo! El sitio quedó disponible en GitHub Pages

---

## 📸 Capturas de Pantalla

### 🔐 Pantalla de Login

![Login](img/captura-login.png)

*Formulario de login con validación de correo y contraseña, ojito para ver/ocultar contraseña y enlace al registro.*

---

### 📝 Modal de Registro

![Registro](img/captura-registro.png)

*Modal de registro simplificado con solo correo, contraseña y confirmación de contraseña.*

---

### 🏠 Panel del Sistema

![Sistema](img/captura-sistema.png)

*Panel principal con sidebar, navbar con el nombre del usuario y sección de bienvenida.*

---

### 📋 Formulario de Captura

![Captura](img/captura-formulario.png)

*Formulario de captura de alumnos con todos los campos validados, incluido el número de control de 6 dígitos y el ojito para la contraseña.*

---

### 🎂 Modal de Edad

![Modal](img/captura-modal.png)

*Modal que muestra el resultado del cálculo de edad, indicando si el alumno es mayor o menor de edad.*

---

### 📊 Tabla de Alumnos Registrados

![Tabla](img/captura-tabla.png)

*Tabla con todos los alumnos registrados, mostrando nombre, correo, número de control, edad, mayoría de edad y botón de eliminar.*

---

### 👤 Dropdown del Usuario

![Dropdown](img/captura-dropdown.png)

*Menú desplegable del usuario en el navbar, con el correo y la opción de cerrar sesión.*

---

## 🧰 Tecnologías Utilizadas

| Tecnología | Uso |
|:---|:---|
| **HTML5** | Estructura semántica de las dos pantallas |
| **CSS3** | Estilos personalizados, variables y animaciones |
| **JavaScript (ES6)** | Lógica del login, validaciones, manipulación del DOM |
| **Bootstrap 5** | Framework CSS para el diseño responsivo |
| **Font Awesome** | Iconos (usuario, candado, ojito, etc.) |
| **localStorage** | Persistencia de usuarios, sesión y alumnos |
| **utileria.js** | Librería propia de validaciones |
| **Git & GitHub** | Control de versiones |
| **GitHub Pages** | Publicación del sitio |

---

## 📁 Estructura del Repositorio

```
/sistema-login
├── README.md                    # Este archivo
├── login.html                   # Pantalla de login + modal de registro
├── index.html                   # Panel del sistema
├── /css
│   └── login.css                # Estilos de ambas pantallas
├── /js
│   ├── utileria.js              # Librería de validaciones (del proyecto anterior)
│   └── login.js                 # Lógica del login y del sistema
└── /img
    ├── captura-login.png
    ├── captura-registro.png
    ├── captura-sistema.png
    ├── captura-formulario.png
    ├── captura-modal.png
    ├── captura-tabla.png
    └── captura-dropdown.png
```

---

## 🧪 Casos de Prueba

| Caso | Resultado esperado |
|:---|:---|
| Login con usuario NO registrado | "Usuario no registrado. Crea una cuenta aquí." |
| Login con correo correcto pero contraseña mal | "Contraseña incorrecta. Intenta de nuevo." |
| Login con credenciales correctas | "¡Bienvenido, [nombre]! Redirigiendo..." |
| Registro con correo ya existente | "Ya existe un usuario con ese correo." |
| Registro con contraseñas diferentes | "Las contraseñas no coinciden." |
| Captura con número de control de 5 dígitos | "El número de control debe tener exactamente 6 dígitos." |
| Captura con fecha futura | "La fecha de nacimiento no puede ser futura." |
| Captura con correo duplicado | "Ese correo ya está registrado en otro alumno." |
| Guardar alumno exitosamente | Modal de edad + aparece en la tabla |
| Clic en "Salir del sistema" | Confirmación + regresa al login |

---

## 🎓 Aprendizajes del Proyecto

Durante el desarrollo de este proyecto aprendimos:

1. **Comunicación entre páginas** usando `localStorage` como puente
2. **Patrón IIFE** para encapsular lógica en módulos (`GestorUsuarios`, `GestorAlumnos`)
3. **Validaciones reutilizables** con una librería propia (`utileria.js`)
4. **Manipulación del DOM** para renderizar tablas dinámicamente
5. **Bootstrap 5** para componentes visuales (navbar, sidebar, modal, dropdown)
6. **Control de versiones** con Git y trabajo colaborativo
7. **Publicación** en GitHub Pages sin necesidad de backend

---

## 📜 Licencia

Este proyecto es de uso libre para fines académicos y personales.

---

## 👥 Integrantes del Equipo

| Nombre | Responsabilidades |
|:---|:---|
| **Perla Danae Gallardo Vasquez** | `login.html` + Lógica de login + Navbar + Logout |
| **Dante Azael Villalobos** | `index.html` + Sidebar + Captura + Modal + Tabla |

**Distribución de commits:** 50% / 50%

---
