using System.ComponentModel.DataAnnotations;
using YamlDotNet.Serialization;

public class Challenge
{
    public int Id { get; set; }

    [Required]
    public string Title { get; set; }

    [Required]
    public string Description { get; set; }

    [Required]
    public string Link { get; set; }

    public int Points { get; set; }

    [Required]
    public string Hint { get; set; }

    [Required]
    public string Flag { get; set; }

    public List<Solve> Solves { get; set; }
}
