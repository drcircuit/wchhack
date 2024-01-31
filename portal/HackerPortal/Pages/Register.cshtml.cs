using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

public class RegisterModel : PageModel
{
    private readonly AppDbContext _dbContext;

    public RegisterModel(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [BindProperty]
    public InputModel Input { get; set; }

    public class InputModel
    {
        [Required]
        [StringLength(50, MinimumLength = 3)]
        public string Username { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [StringLength(100, MinimumLength = 6)]
        public string Password { get; set; }
    }

    public void OnGet()
    {
        // This is the page load handler for GET requests
    }

    public async Task<IActionResult> OnPostAsync()
    {
        if (!ModelState.IsValid)
        {
            return Page();
        }

        // Check if the username is already in use
        if (await _dbContext.Users.AnyAsync(u => u.Username == Input.Username))
        {
            ModelState.AddModelError(string.Empty, "Username is already taken.");
            return Page();
        }

        // Create a new user and save it to the database
        var user = new User
        {
            Username = Input.Username,
            Password = Input.Password
        };

        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync();

        // Redirect to a login page or another page after successful registration
        return RedirectToPage("/Login");
    }
}
