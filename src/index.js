const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");

const app = express();

// Configuración básica
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // ✅ corregido para que no busque src/src/views
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    secret: "cierre-perfecto-secret",
    resave: false,
    saveUninitialized: true
}));

// Middleware para pasar estado de login a las vistas
app.use((req, res, next) => {
    res.locals.usuarioLogueado = req.session.usuarioLogueado || null;
    next();
});

// Rutas principales
app.get("/", (req, res) => {
    res.render("index");
});

// Mostrar formulario de login
app.get("/login", (req, res) => {
    res.render("login", { mensaje: null }); // ✅ siempre define mensaje
});

// Procesar login
app.post("/login", (req, res) => {
    const { usuario, password } = req.body;
    if (usuario === "admin" && password === "1234") {
        req.session.usuarioLogueado = usuario;
        res.redirect("/");
    } else {
        res.render("login", { mensaje: "Usuario o contraseña incorrectos" });
    }
});

// Mostrar formulario de registro
app.get("/registro", (req, res) => {
    res.render("registro", { mensaje: null });
});

// Procesar registro
app.post("/registro", (req, res) => {
    const { usuario, password } = req.body;

    // Aquí podrías guardar el usuario en una base de datos.
    // Por ahora lo simulamos con un mensaje de éxito.
    console.log(`Nuevo usuario registrado: ${usuario}`);

    res.render("login", { mensaje: "✅ Usuario registrado con éxito. Ahora inicia sesión." });
});


// Logout
app.get("/logout", (req, res) => {
    req.session.destroy(() => res.redirect("/"));
});

// Contacto
app.get("/contacto", (req, res) => {
    res.render("contacto", { mensaje: null }); // ✅ define mensaje vacío
});

app.post("/contacto", (req, res) => {
    const { nombre, email, mensaje } = req.body;
    console.log(`Nuevo mensaje de ${nombre} (${email}): ${mensaje}`);
    res.render("contacto", { mensaje: "✅ Tu mensaje fue enviado con éxito." });
});

// Arrancar servidor
app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});

