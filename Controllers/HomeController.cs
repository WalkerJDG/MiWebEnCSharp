using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using MiWebEnCSharp.Models;

namespace MiWebEnCSharp.Controllers
{
    public class HomeController : Controller
    {
        // Página principal (Login)
        public IActionResult Index()
        {
            return View();
        }

        // Registro
        public IActionResult Register()
        {
            return View();
        }

        // Dashboard
        public IActionResult Dashboard()
        {
            return View();
        }

        // Curso
        public IActionResult Curso()
        {
            return View();
        }

        // Acción de error (deja esta tal cual, la usa ASP.NET internamente)
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
