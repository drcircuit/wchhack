using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

public class User
{
    public int Id { get; set; }

    [Required]
    public string Username { get; set; }

    [Required]
    public string Password { get; set; }

    public DateTime RegistrationTime { get; set; }

    public List<Solve> Solves { get; set; }
}
