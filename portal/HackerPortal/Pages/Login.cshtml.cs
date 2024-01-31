using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
namespace HackerPortal.Pages;
public class LoginModel : PageModel
{
    private readonly AppDbContext _dbContext;

    public LoginModel(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    public IActionResult OnGet()
    {
        if (User.Identity.IsAuthenticated)
        {
            // User is already authenticated, redirect to the challenge pages
            return RedirectToPage("/Challs");
        }

        return Page();
    }
    public int GetUserTotalScore()
    {
        var userName = User.FindFirst(ClaimTypes.Name)?.Value;
        if (userName == null)
        {
            return 0; // User not authenticated
        }
        var userId = _dbContext.Users.Where(u => u.Username == userName).Select(u => u.Id).FirstOrDefault();
        var solves = _dbContext.Solves.Where(s => s.UserId == userId).ToList();
        int totalScore = 0;
        foreach (var solve in solves)
        {
            totalScore += solve.PointsEarned;
        }
        return totalScore;
    }

    [BindProperty]
    public InputModel Input { get; set; }

    public class InputModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }


    public async Task<IActionResult> OnPostAsync()
    {
        if (!ModelState.IsValid)
        {
            return Page();
        }

        var user = await _dbContext.Users.SingleOrDefaultAsync(u => u.Username == Input.Username && u.Password == Input.Password);

        if (user == null)
        {
            ModelState.AddModelError(string.Empty, "Invalid username or password.");
            return Page();
        }

        // Create claims for authentication
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.Username)
            // Add more claims as needed
        };

        var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        var authProperties = new AuthenticationProperties
        {
            // Configure authentication properties if needed
        };

        // Sign in the user
        await HttpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme,
            new ClaimsPrincipal(claimsIdentity),
            authProperties);

        // Redirect to the protected page after successful login
        return RedirectToPage("/Challs");
    }
}
