using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

public class FlagCheck
{
    public int challengeId { get; set; }
    public string flag { get; set; }
}
[Authorize] // Ensure that the user is authenticated to access this page
public class ChallsModel : PageModel
{
    private readonly AppDbContext _dbContext;
    private readonly IUserScoreService _userScoreService;

    public ChallsModel(AppDbContext dbContext, IUserScoreService userScoreService)
    {
        _dbContext = dbContext;
        _userScoreService = userScoreService;
    }
    public bool HasSolvedChallenge(int challengeId)
    {
        // Check if the current user has solved the challenge with the specified ID.
        // You will need to implement your logic here to query the database or any other data source
        // to determine if the user has solved the challenge.

        // Example logic (you should replace this with your actual implementation):
        var userName = User.FindFirst(ClaimTypes.Name)?.Value;
        if (userName == null)
        {
            return false; // User not authenticated
        }
        var userId = _dbContext.Users.Where(u => u.Username == userName).Select(u => u.Id).FirstOrDefault();
        // Check if there is a record in your database that represents the user's solve for the challenge
        var solveForChallenge = _dbContext.Solves
            .Where(s => s.UserId == userId && s.ChallengeId == challengeId)
            .FirstOrDefault();

        return solveForChallenge != null;
    }

    public List<Challenge> Challenges { get; set; }

    public async Task OnGetAsync()
    {
        // Retrieve the challenges from the database
        Challenges = await _dbContext.Challenges.ToListAsync();
    }

    public async Task<IActionResult> OnPostCheckAnswerAsync([FromBody] FlagCheck flagcheck)
    {
        var challengeId = flagcheck.challengeId;
        var flag = flagcheck.flag;
        var challenge = await _dbContext.Challenges.FindAsync(challengeId);

        if (challenge == null)
        {
            return NotFound();
        }

        // Retrieve the current user's identity from the HttpContext
        var userIdClaim = HttpContext.User.FindFirst(ClaimTypes.Name);

        if (userIdClaim == null)
        {
            return Unauthorized(); // Handle the case when the user is not authenticated
        }

        // Extract the user ID from the claim
        var userName = userIdClaim.Value;
        if (userName == null)
        {
            return Unauthorized(); // Handle the case when the user ID is not found
        }
        var userId = await _dbContext.Users.Where(u => u.Username == userName).Select(u => u.Id).FirstOrDefaultAsync();
        if (string.Equals(flag, challenge.Flag, StringComparison.OrdinalIgnoreCase))
        {
            // Flag matches, add a Solve to the database
            var solve = new Solve
            {
                ChallengeId = challengeId,
                UserId = userId, // Associate the solve with the current user
                PointsEarned = challenge.Points, // You can adjust the points earned here
                SolvedTime = DateTime.UtcNow // Use UTC time to store the solve time
            };

            _dbContext.Solves.Add(solve);
            await _dbContext.SaveChangesAsync();
            var score = _userScoreService.GetUserTotalScore(userName);
            // Return a success message
            return new JsonResult(new { success = true, score = score });
        }

        // Incorrect flag, return an error message
        return new JsonResult(new { success = false });
    }

}
