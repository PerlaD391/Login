document.addEventListener('DOMContentLoaded', function () {
    const esLogin = document.getElementById('loginForm') !== null;
    if (esLogin) inicializarLogin();
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
