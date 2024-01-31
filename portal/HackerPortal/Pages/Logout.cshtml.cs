using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Authentication;
namespace HackerPortal.Pages;
public class LogoutModel : PageModel
{
    public void OnGet()
    {
    }
    public async Task<IActionResult> OnPostAsync()
    {
        // Sign the user out
        // Clear the existing external cookie
        await HttpContext.SignOutAsync(
            CookieAuthenticationDefaults.AuthenticationScheme);

        // Redirect to a specific page after logout (e.g., Home page)
        return RedirectToPage("/Index");
    }
}
