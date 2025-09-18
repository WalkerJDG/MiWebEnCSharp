# 📚 MiWebEnCSharp

Aplicación web desarrollada en **ASP.NET Core MVC (C#)** con front-end en **HTML, CSS y JavaScript**.  
Incluye sistema de **login, registro, dashboard de usuario y cursos interactivos** con consola virtual y quiz.

---

## 🚀 Características principales

- **Login y Registro**  
  - Formulario de autenticación con validación en cliente.  
  - Registro de nuevos usuarios con guardado en `localStorage`.  

- **Dashboard**  
  - Vista de bienvenida al usuario logueado.  
  - Listado de cursos disponibles.  
  - Gestión de cursos inscritos: abrir, cancelar, reanudar.  

- **Cursos interactivos**  
  - Teoría de **CSS Moderno**, **JavaScript Básico** y **Git & GitHub**.  
  - Consola virtual integrada para probar código.  
  - Quiz de preguntas por cada curso con feedback inmediato.  

- **Front-End optimizado**  
  - Estilos en `wwwroot/assets/css/`.  
  - Scripts organizados en `wwwroot/assets/js/`.  
  - Responsive y con diseño limpio.  

---

## 📂 Estructura del proyecto

MiWebEnCSharp/
│
├── Controllers/
│ └── HomeController.cs
│
├── Models/
│ └── ErrorViewModel.cs
│
├── Views/
│ ├── Home/
│ │ ├── Index.cshtml # Login
│ │ ├── Register.cshtml # Registro
│ │ ├── Dashboard.cshtml # Dashboard
│ │ └── Curso.cshtml # Curso interactivo
│ └── Shared/
│ ├── _Layout.cshtml
│ └── _ViewStart.cshtml
│
├── wwwroot/
│ ├── assets/
│ │ ├── css/
│ │ │ ├── auth.css
│ │ │ └── main.css
│ │ └── js/
│ │ ├── login.js
│ │ ├── register.js
│ │ ├── dashboard.js
│ │ └── curso.js
│ └── lib/ (Bootstrap, jQuery, etc.)
│
└── README.md

---

## ⚡ Instalación y ejecución

### 1️⃣ Clona el repositorio
```bash
git clone https://github.com/WalkerJDG/MiWebEnCSharp.git
cd MiWebEnCSharp

dotnet restore

dotnet run

Por defecto la app estará en:
👉 https://localhost:7161
👉 http://localhost:5161

🛠️ Tecnologías usadas

Backend: ASP.NET Core MVC 7+

Frontend: HTML5, CSS3, JavaScript

Framework CSS: Bootstrap 5

Gestión de usuarios: localStorage (solo demo)

Control de versiones: Git + GitHub

📸 Capturas de pantalla
🔐 Login

Pantalla de inicio de sesión personalizada.

📝 Registro

Formulario de registro de nuevos usuarios.

📊 Dashboard

Listado de cursos disponibles y mis cursos.

📘 Curso interactivo

Consola virtual y quiz para reforzar conocimientos.

👨‍💻 Autor

Proyecto creado por WalkerJDG

GitHub: WalkerJDG
