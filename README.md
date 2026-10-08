# Sistema Escolar con Autenticación y Panel de Captura

**Materia:** Programación Web  
**Actividad:** Actividad 5 · Programación Web · 7SC  
**Alumna:** Martinez Nieto Adelina  
**Ubicación:** `c:\xampp\htdocs\Actividad5\Login`  

---

## Portada y Descripción Breve

El **Sistema Escolar con Autenticación** es una aplicación web responsiva desarrollada en HTML5, CSS3 y JavaScript puro (vanilla), estructurada en dos pantallas principales: `login.html` (acceso y registro) e `index.html` (panel de administración).

**Características principales:**
- Login y registro modal persistido en `localStorage`.
- Navbar dinámico que muestra el usuario autenticado y su correo.
- Sidebar lateral colapsable con submenú de acceso rápido.
- Formulario de captura de usuarios y registro de alumnos.
- Validación de **Número de Control de 6 dígitos exactos**.
- Modal interactivo de resultado de mayoría de edad.

---

## Explicación y Documentación Técnica

### 1. Framework CSS Utilizado

Se utilizó **Bootstrap 5 (v5.3.3)** vía CDN junto con **Font Awesome 6.5.1** y estilos personalizados en `css/login.css`.

| Tecnología | Descripción y Uso |
|:---|:---|
| **Bootstrap 5.3.3** | Grid responsivo, cards, modales, navbar y utilidades de color (`bg-primary`, `bg-dark`, `bg-success`, `bg-warning`). |
| **Font Awesome 6.5.1** | Iconografía para campos de texto, botones de ojo (`fa-eye`), usuario y escudo de seguridad. |
| **CSS Vanilla (`css/login.css`)** | Transiciones del sidebar, distribución del layout y ajustes responsivos. |

> **Nota:** Se utilizó JavaScript puro para la manipulación del DOM sin frameworks como React o Vue.

---

### 2. Flujo del Login hacia el Sistema

```
login.html (Credenciales) ──► localStorage ('usuarioSesion') ──► index.html (Panel)
         ▲                                                            │
         └────────────────── Logout (btnSalir) ───────────────────────┘
```

1. **Autenticación (`login.html`):** El usuario ingresa su correo y contraseña. Se valida el formato con `utileria.js` y se consulta el módulo `moduloAutenticacion`.
2. **Creación de Sesión:** Si las credenciales son correctas, se guarda en `localStorage` con la clave `'usuarioSesion'` y se redirige a `index.html`.
3. **Verificación de Sesión:** Al cargar `index.html`, la función `inicializarSistema()` consulta `'usuarioSesion'`. Si no existe, redirige al login; si existe, inyecta los datos en el navbar.
4. **Cierre de Sesión:** El botón "Salir del sistema" elimina `'usuarioSesion'` y redirige a `login.html`.

---

### 3. Paso del Nombre de Usuario al Navbar

Se utiliza **`localStorage`** para compartir datos entre `login.html` e `index.html`:

1. **En `login.html` (Guardado):**
   ```javascript
   localStorage.setItem('usuarioSesion', JSON.stringify({
       id: usuario.id,
       correo: usuario.correo,
       nombre: usuario.nombre
   }));
   ```

2. **En `index.html` (Lectura e Inyección):**
   ```javascript
   const usuario = moduloAutenticacion.obtenerSesion();
   document.getElementById('nombreUsuarioNavbar').textContent = usuario.nombre;
   document.getElementById('correoUsuarioNavbar').textContent = usuario.correo;
   ```

---

### 4. Métodos Principales (`js/login.js`)

#### Módulo de Autenticación (`moduloAutenticacion`)

| Método | Descripción |
|:---|:---|
| `registrar(correo, password, nombre)` | Registra un nuevo usuario en `localStorage` (`usuariosRegistrados`). |
| `validarCredenciales(correo, password)` | Comprueba la existencia y contraseña del usuario. |
| `establecerSesion(usuario)` | Crea el registro `'usuarioSesion'` en `localStorage`. |
| `obtenerSesion()` | Retorna los datos del usuario logueado o `null`. |
| `cerrarSesion()` | Elimina `'usuarioSesion'` de `localStorage`. |

#### Funciones del Sistema

| Función | Descripción |
|:---|:---|
| `inicializarLogin()` | Configura el login, alternador de contraseña (ojo) y modal de registro. |
| `inicializarSistema()` | Valida la sesión, inyecta el usuario en el navbar y maneja el sidebar. |
| `inicializarFormUsuario()` | Procesa la captura de nuevos usuarios. |
| `inicializarFormAlumno()` | Valida datos del alumno, exige **6 dígitos en el Número de Control** e invoca el modal de edad. |

#### Funciones de Librería (`utileria.js`)
- `validarCorreo(correo)` - Valida formato de email.
- `validarPassword(pass)` - Valida mayúscula, minúscula, número y símbolo.
- `soloLetras(texto)` - Permite únicamente letras y espacios.
- `calcularEdad(fecha)` / `esMayorDeEdad(fecha)` - Calcula la edad y determina si es >= 18.

---

## Proceso de Creación Paso a Paso con Capturas

### Paso 1: Pantalla de Login (`login.html`)
Diseño de la tarjeta centrada con grupo de entrada para correo, contraseña y botón para alternar visibilidad de contraseña (ojito).

![Login](./img/LoginPrueba1.png)

---

### Paso 2: Modal de Registro de Usuario
Modal flotante `#modalRegistro` que permite dar de alta una nueva cuenta con validaciones de campos.

![Modal Registro](./img/LoginPrueba2Registro.png)

---

### Paso 3: Panel Principal del Sistema (`index.html`)
Vista de bienvenida que se muestra al autenticarse correctamente.

![Panel Principal](./img/LoginPrueba3Principal.png)

---

### Paso 4: Navbar con Usuario Logueado
Barra superior fija que muestra el icono y nombre del usuario autenticado recuperado de `localStorage`.

![Navbar Usuario](./img/LoginPrueba4Navbar.png)

---

### Paso 5: Sidebar Lateral Animado
Menú lateral colapsable con submenú desplegable de "Usuarios" -> "Captura".

![Sidebar](./img/LoginPrueba5SideBar.png)

---

### Paso 6: Formulario de Captura de Alumnos
Formulario con validación de nombre, fecha de nacimiento y **Número de Control de exactamente 6 dígitos**.

![Captura Alumnos](./img/LoginPrueba6Captura.png)

---

### Paso 7: Modal de Resultado de Mayoría de Edad
Modal `#modalEdadAlumno` que calcula la edad del alumno y muestra el resultado con estilos dinámicos (`bg-success` o `bg-warning`).

![Modal Edad](./img/LoginPrueba7Modal.png)

---

### Paso 8: Menú del Usuario y Cierre de Sesión (Logout)
Dropdown desplegable en el navbar con el correo del usuario y la opción de cerrar sesión.

![LogOut](./img/LoginPrueba8LogOut.png)

---

## Capturas de Pantalla del Flujo Completo

1. **Pantalla de Inicio de Sesión:**  
   ![LoginPrueba1.png](./img/LoginPrueba1.png)

2. **Registro de Nueva Cuenta:**  
   ![LoginPrueba2Registro.png](./img/LoginPrueba2Registro.png)

3. **Panel Principal del Sistema:**  
   ![LoginPrueba3Principal.png](./img/LoginPrueba3Principal.png)

4. **Nombre de Usuario en el Navbar:**  
   ![LoginPrueba4Navbar.png](./img/LoginPrueba4Navbar.png)

5. **Menú Lateral (Sidebar) Desplegado:**  
   ![LoginPrueba5SideBar.png](./img/LoginPrueba5SideBar.png)

6. **Formulario de Registro y Validación de Alumno:**  
   ![LoginPrueba6Captura.png](./img/LoginPrueba6Captura.png)

7. **Modal Resultado de Mayoría de Edad:**  
   ![LoginPrueba7Modal.png](./img/LoginPrueba7Modal.png)

8. **Menú de Usuario y Cierre de Sesión:**  
   ![LoginPrueba8LogOut.png](./img/LoginPrueba8LogOut.png)

---

## Datos de la Asignatura e Integrantes

- **Materia:** Programación Web
- **Actividad:** Actividad 5
- **Grupo:** 7SC
- **Integrante:** Martinez Nieto Adelina
- **Tecnologías:** HTML5, CSS3, JavaScript (ES6+), Bootstrap 5.3.3, Font Awesome 6.5.1
