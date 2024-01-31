using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

public class IndexModel : PageModel
{
    private readonly AppDbContext _dbContext;

    public IndexModel(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public bool UserExists { get; set; }

    public async Task<IActionResult> OnGetAsync()
    {
        UserExists = await _dbContext.Users.AnyAsync();

        return Page();
    }
}
