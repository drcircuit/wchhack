using Microsoft.EntityFrameworkCore;
using YamlDotNet.Serialization;
using YamlDotNet.Serialization.NamingConventions;

public class AppDbContext : DbContext
{
    private readonly ILogger<AppDbContext> _logger;
    public AppDbContext(DbContextOptions<AppDbContext> options, ILogger<AppDbContext> logger) : base(options)
    {
        _logger = logger;
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Challenge> Challenges { get; set; }
    public DbSet<Solve> Solves { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Define relationships between User, Challenge, and Solve
        modelBuilder.Entity<Solve>()
            .HasOne(s => s.User)
            .WithMany(u => u.Solves)
            .HasForeignKey(s => s.UserId);

        modelBuilder.Entity<Solve>()
            .HasOne(s => s.Challenge)
            .WithMany(c => c.Solves)
            .HasForeignKey(s => s.ChallengeId);
    }

    public void LoadChallengesFromYaml()
    {
        // Path to the YAML file
        var yamlFilePath = Path.Combine(Directory.GetCurrentDirectory(), "challenges.yaml");
        _logger.LogInformation($"Loading challenges from YAML file: {yamlFilePath}");
        if (!File.Exists(yamlFilePath))
        {
            // Handle the case when the YAML file does not exist
            _logger.LogError($"YAML file not found: {yamlFilePath}");
            return;
        }

        var deserializer = new DeserializerBuilder()
            .WithNamingConvention(PascalCaseNamingConvention.Instance)
            .Build();

        using (var reader = new StreamReader(yamlFilePath))
        {
            var challenges = deserializer.Deserialize<List<Challenge>>(reader);
            _logger.LogInformation($"Loaded {challenges.Count} challenges from YAML file.");
            foreach (var challenge in challenges)
            {
                if (!Challenges.Any(c => c.Title == challenge.Title))
                {
                    Challenges.Add(challenge);
                }
            }

            SaveChanges();
            _logger.LogInformation($"Added {challenges.Count} challenges to the database.");

        }
    }
}
