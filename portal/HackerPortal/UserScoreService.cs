public interface IUserScoreService
{
    int GetUserTotalScore(string userId);
}

public class UserScoreService : IUserScoreService
{
    private readonly AppDbContext _dbContext;

    public UserScoreService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public int GetUserTotalScore(string userName)
    {
        // Implement logic to calculate the user's total score based on the userId
        // You can use the dbContext to query the database and sum up the scores
        // Return the calculated total score
        var userId = _dbContext.Users.Where(u => u.Username == userName).Select(u => u.Id).FirstOrDefault();
        return _dbContext.Solves.Where(s => s.UserId == userId).Sum(s => s.PointsEarned);
    }
}
