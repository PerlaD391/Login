document.addEventListener('DOMContentLoaded', function () {
    const esLogin = document.getElementById('loginForm') !== null;
    const esSistema = document.getElementById('sidebar') !== null;

    if (esLogin) inicializarLogin();
    if (esSistema) inicializarSistema();
});

const moduloAutenticacion = (function () {

    const CLAVE_USUARIOS = 'usuariosRegistrados';
    const CLAVE_SESION = 'usuarioSesion';

    function obtenerUsuarios() {
        const datos = localStorage.getItem(CLAVE_USUARIOS);
        return datos ? JSON.parse(datos) : [];
    }

    function guardarUsuarios(usuarios) {
        localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
    }

    function buscarPorCorreo(correo) {
        return obtenerUsuarios().find(function (u) {
            return u.correo.toLowerCase() === correo.toLowerCase();
        });
    }

    return {
        registrar: function (correo, password, nombre) {
            const usuarios = obtenerUsuarios();

            if (buscarPorCorreo(correo)) {
                return { exito: false, mensaje: 'Ya existe un usuario con ese correo.' };
            }

            const nuevoUsuario = {
                id: Date.now(),
                nombre: nombre || correo.split('@')[0],
                correo: correo,
                password: password,
                fechaRegistro: new Date().toISOString()
            };

            usuarios.push(nuevoUsuario);
            guardarUsuarios(usuarios);
            return { exito: true, mensaje: 'Usuario registrado exitosamente.', usuario: nuevoUsuario };
        },

        validarCredenciales: function (correo, password) {
            const usuario = buscarPorCorreo(correo);
            if (!usuario) return { exito: false, motivo: 'no-existe' };
            if (usuario.password !== password) return { exito: false, motivo: 'password-incorrecta' };
            return { exito: true, usuario: usuario };
        },

        establecerSesion: function (usuario) {
            localStorage.setItem(CLAVE_SESION, JSON.stringify({
                id: usuario.id,
                correo: usuario.correo,
                nombre: usuario.nombre,
                fechaLogin: new Date().toISOString()
            }));
        },

        obtenerSesion: function () {
            const datos = localStorage.getItem(CLAVE_SESION);
            return datos ? JSON.parse(datos) : null;
        },

        cerrarSesion: function () {
            localStorage.removeItem(CLAVE_SESION);
        }
    };
})();

function inicializarLogin() {

    const inputCorreo = document.getElementById('correo');
    const inputPassword = document.getElementById('password');
    const btnLogin = document.getElementById('btnLogin');
    const btnTogglePassword = document.getElementById('togglePassword');
    const toggleIcon = document.getElementById('toggleIcon');
    const mensaje = document.getElementById('mensajeLogin');

    const linkRegistro = document.getElementById('linkRegistro');
    const modalRegistro = new bootstrap.Modal(document.getElementById('modalRegistro'));
    const btnRegistrar = document.getElementById('btnRegistrar');
    const mensajeRegistro = document.getElementById('mensajeRegistro');
    const formRegistro = document.getElementById('formRegistro');

    /* ---- Toggle contraseña login ---- */
    btnTogglePassword.addEventListener('click', function () {
        if (inputPassword.type === 'password') {
            inputPassword.type = 'text';
            toggleIcon.classList.remove('fa-eye');
            toggleIcon.classList.add('fa-eye-slash');
        } else {
            inputPassword.type = 'password';
            toggleIcon.classList.remove('fa-eye-slash');
            toggleIcon.classList.add('fa-eye');
        }
    });

    const btnToggleRegPass = document.getElementById('toggleRegistroPassword');
    const toggleIconReg = document.getElementById('toggleIconRegistro');
    const inputRegPass = document.getElementById('registroPassword');
    if (btnToggleRegPass) {
        btnToggleRegPass.addEventListener('click', function () {
            if (inputRegPass.type === 'password') {
                inputRegPass.type = 'text';
                toggleIconReg.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                inputRegPass.type = 'password';
                toggleIconReg.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    }

    const btnToggleConfirm = document.getElementById('toggleRegistroConfirm');
    const toggleIconConfirm = document.getElementById('toggleIconConfirm');
    const inputRegConfirm = document.getElementById('registroPasswordConfirm');
    if (btnToggleConfirm) {
        btnToggleConfirm.addEventListener('click', function () {
            if (inputRegConfirm.type === 'password') {
                inputRegConfirm.type = 'text';
                toggleIconConfirm.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                inputRegConfirm.type = 'password';
                toggleIconConfirm.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    }

    linkRegistro.addEventListener('click', function (e) {
        e.preventDefault();
        mensajeRegistro.textContent = '';
        mensajeRegistro.className = 'mensaje';
        formRegistro.reset();
        modalRegistro.show();
    });

    btnRegistrar.addEventListener('click', function () {
        mensajeRegistro.textContent = '';
        mensajeRegistro.className = 'mensaje';

        const correo = document.getElementById('registroCorreo').value.trim();
        const password = document.getElementById('registroPassword').value;
        const passwordConfirm = document.getElementById('registroPasswordConfirm').value;

        if (correo === '' || password === '' || passwordConfirm === '') {
            mensajeRegistro.textContent = 'Por favor, completa todos los campos.';
            mensajeRegistro.classList.add('error');
            return;
        }

        if (!validarCorreo(correo)) {
            mensajeRegistro.textContent = 'El correo no tiene un formato válido.';
            mensajeRegistro.classList.add('error');
            return;
        }

        if (!validarPassword(password)) {
            mensajeRegistro.textContent = 'La contraseña debe tener mayúscula, minúscula, número, símbolo y mínimo 8 caracteres.';
            mensajeRegistro.classList.add('error');
            return;
        }

        if (password !== passwordConfirm) {
            mensajeRegistro.textContent = 'Las contraseñas no coinciden.';
            mensajeRegistro.classList.add('error');
            return;
        }

        const resultado = moduloAutenticacion.registrar(correo, password);

        if (!resultado.exito) {
            mensajeRegistro.textContent = resultado.mensaje;
            mensajeRegistro.classList.add('error');
            return;
        }

        mensajeRegistro.textContent = '¡Cuenta creada! Ahora puedes iniciar sesión.';
        mensajeRegistro.classList.add('exito');

        setTimeout(function () {
            modalRegistro.hide();
            inputCorreo.value = correo;
            inputPassword.focus();
        }, 1500);
    });

    btnLogin.addEventListener('click', function () {
        mensaje.textContent = '';
        mensaje.className = 'mensaje';

        const correo = inputCorreo.value.trim();
        const password = inputPassword.value;

        if (correo === '' || password === '') {
            mensaje.textContent = 'Por favor, completa todos los campos.';
            mensaje.classList.add('error');
            return;
        }

        if (!validarCorreo(correo)) {
            mensaje.textContent = 'El correo no tiene un formato válido.';
            mensaje.classList.add('error');
            return;
        }

        if (!validarPassword(password)) {
            mensaje.textContent = 'La contraseña debe tener mayúscula, minúscula, número, símbolo y mínimo 8 caracteres.';
            mensaje.classList.add('error');
            return;
        }

        const resultado = moduloAutenticacion.validarCredenciales(correo, password);

        if (!resultado.exito) {
            if (resultado.motivo === 'no-existe') {
                mensaje.innerHTML = 'Usuario no registrado. <a href="#" id="linkRegistroInline" class="link-registro">Crea una cuenta aquí</a>.';
                mensaje.classList.add('error');

                setTimeout(function () {
                    const linkInline = document.getElementById('linkRegistroInline');
                    if (linkInline) {
                        linkInline.addEventListener('click', function (e) {
                            e.preventDefault();
                            mensaje.textContent = '';
                            formRegistro.reset();
                            modalRegistro.show();
                        });
                    }
                }, 100);
            } else if (resultado.motivo === 'password-incorrecta') {
                mensaje.textContent = 'Contraseña incorrecta. Intenta de nuevo.';
                mensaje.classList.add('error');
            }
            return;
        }

        moduloAutenticacion.establecerSesion(resultado.usuario);

        mensaje.textContent = '¡Bienvenido, ' + resultado.usuario.nombre + '! Redirigiendo...';
        mensaje.classList.add('exito');

        setTimeout(function () {
            window.location.href = 'index.html';
        }, 1000);
    });

    inputPassword.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') btnLogin.click();
    });
}

function inicializarSistema() {

    const usuario = moduloAutenticacion.obtenerSesion();
    if (!usuario) {
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('nombreUsuarioNavbar').textContent = usuario.nombre;
    document.getElementById('correoUsuarioNavbar').textContent = usuario.correo;

    const btnToggleSidebar = document.getElementById('btnToggleSidebar');
    const sidebar = document.getElementById('sidebar');
    const contenidoPrincipal = document.getElementById('contenidoPrincipal');

    btnToggleSidebar.addEventListener('click', function () {
        sidebar.classList.toggle('abierto');
        sidebar.classList.toggle('cerrado');
        contenidoPrincipal.classList.toggle('desplazado');
        contenidoPrincipal.classList.toggle('completo');
    });

    const toggleUsuarios = document.getElementById('toggleUsuarios');
    const submenuUsuarios = document.getElementById('submenuUsuarios');

    toggleUsuarios.addEventListener('click', function (e) {
        e.preventDefault();
        submenuUsuarios.classList.toggle('abierto');
        toggleUsuarios.classList.toggle('abierto');
    });

    const seccionBienvenida = document.getElementById('seccionBienvenida');
    const seccionCaptura = document.getElementById('seccionCaptura');
    const linkCaptura = document.getElementById('linkCaptura');

    if (linkCaptura) {
        linkCaptura.addEventListener('click', function (e) {
            e.preventDefault();
            if (seccionBienvenida) seccionBienvenida.style.display = 'none';
            if (seccionCaptura) seccionCaptura.style.display = 'block';

            if (window.innerWidth < 992) {
                sidebar.classList.remove('abierto');
            }
        });
    }

    document.getElementById('btnSalir').addEventListener('click', function (e) {
        e.preventDefault();
        if (confirm('¿Estás seguro que deseas salir del sistema?')) {
            moduloAutenticacion.cerrarSesion();
            window.location.href = 'login.html';
        }
    });
    /* ---- Inicializar formularios ---- */
    inicializarFormUsuario();
    inicializarFormAlumno();
}
/* FORMULARIO: Captura de Usuario */
function inicializarFormUsuario() {
    const formUsuario = document.getElementById('formCapturaUsuario');
    if (!formUsuario) return;

    const inputNombre = document.getElementById('nombreUsuarioCaptura');
    const inputCorreo = document.getElementById('correoUsuarioCaptura');
    const inputPass = document.getElementById('passUsuarioCaptura');

    const errNombre = document.getElementById('errNombreCaptura');
    const errCorreo = document.getElementById('errCorreoCaptura');
    const errPass = document.getElementById('errPassCaptura');

    formUsuario.addEventListener('submit', function (e) {
        e.preventDefault();

        const nombre = inputNombre.value.trim();
        const correo = inputCorreo.value.trim();
        const pass = inputPass.value;
        let valido = true;

        if (!soloLetras(nombre)) {
            errNombre.style.setProperty('display', 'block', 'important');
            inputNombre.classList.add('is-invalid');
            valido = false;
        } else {
            errNombre.style.setProperty('display', 'none', 'important');
            inputNombre.classList.remove('is-invalid');
        }

        if (!validarCorreo(correo)) {
            errCorreo.style.setProperty('display', 'block', 'important');
            inputCorreo.classList.add('is-invalid');
            valido = false;
        } else {
            errCorreo.style.setProperty('display', 'none', 'important');
            inputCorreo.classList.remove('is-invalid');
        }

        if (!validarPassword(pass)) {
            errPass.style.setProperty('display', 'block', 'important');
            inputPass.classList.add('is-invalid');
            valido = false;
        } else {
            errPass.style.setProperty('display', 'none', 'important');
            inputPass.classList.remove('is-invalid');
        }

        if (valido) {
            const resultado = moduloAutenticacion.registrar(correo, pass, nombre);
            if (!resultado.exito) {
                mostrarAlerta(resultado.mensaje, 'danger');
                return;
            }
            mostrarAlerta('Usuario <strong>' + nombre + '</strong> guardado correctamente.', 'success');
            formUsuario.reset();
        }
    });
}

/*FORMULARIO: Alumnos + Modal de Edad*/
function inicializarFormAlumno() {
    const formAlumno = document.getElementById('formAlumno');
    if (!formAlumno) return;

    const inputNombre = document.getElementById('nombreAlumno');
    const inputNumControl = document.getElementById('numControlAlumno');
    const inputNacimiento = document.getElementById('nacimientoAlumno');

    const errNombre = document.getElementById('errNombreAlumno');
    const errNumControl = document.getElementById('errNumControl');
    const errNacimiento = document.getElementById('errNacimientoAlumno');

    formAlumno.addEventListener('submit', function (e) {
        e.preventDefault();

        const nombre = inputNombre.value.trim();
        const numControl = inputNumControl.value.trim();
        const fecha = inputNacimiento.value;
        let valido = true;

        if (!soloLetras(nombre)) {
            errNombre.style.setProperty('display', 'block', 'important');
            inputNombre.classList.add('is-invalid');
            valido = false;
        } else {
            errNombre.style.setProperty('display', 'none', 'important');
            inputNombre.classList.remove('is-invalid');
        }

        const soloDigitos = /^\d+$/.test(numControl);
        if (!soloDigitos || numControl.length !== 6) {
            errNumControl.style.setProperty('display', 'block', 'important');
            inputNumControl.classList.add('is-invalid');
            valido = false;
        } else {
            errNumControl.style.setProperty('display', 'none', 'important');
            inputNumControl.classList.remove('is-invalid');
        }

        if (!fecha || calcularEdad(fecha) < 0) {
            errNacimiento.style.setProperty('display', 'block', 'important');
            inputNacimiento.classList.add('is-invalid');
            valido = false;
        } else {
            errNacimiento.style.setProperty('display', 'none', 'important');
            inputNacimiento.classList.remove('is-invalid');
        }

        if (valido) {
            const edad = calcularEdad(fecha);
            const esMayor = esMayorDeEdad(fecha);

            const modalHeader = document.getElementById('modalHeaderBg');
            const modalIcono = document.getElementById('modalIcono');
            const modalTitulo = document.getElementById('modalTituloEdad');
            const modalDetalle = document.getElementById('modalDetalleEdad');

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

            const modalBootstrap = new bootstrap.Modal(document.getElementById('modalEdadAlumno'));
            modalBootstrap.show();
        }
    });
}

/* UTILIDAD: Alerta flotante del sistema */
function mostrarAlerta(mensaje, tipo) {
    const alerta = document.getElementById('alertaSistema');
    const alertaTexto = document.getElementById('alertaSistemaTexto');
    if (!alerta || !alertaTexto) return;

    alerta.className = 'alert alert-' + (tipo || 'success') + ' alert-dismissible fade show';
    alertaTexto.innerHTML = mensaje;
    alerta.classList.remove('d-none');
}
