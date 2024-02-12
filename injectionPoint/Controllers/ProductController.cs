using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Logging;

namespace injectionPoint.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProductsController
    {
        [HttpGet]
        public IEnumerable<Product> GetProducts([FromQuery] string search){
            var q = $"SELECT * FROM products WHERE product like '%{search}%'";
            System.Console.WriteLine(q);
            var products = new List<Product>();
            using(var c =  new SqliteConnection("Data Source=web.db")){
                c.Open();
                var cmd = c.CreateCommand();
                cmd.CommandText = q;
                using(var r = cmd.ExecuteReader()){
                    while(r.Read()){
                        var p = new Product{
                            Id = r.GetInt32(0),
                            Name = r.GetString(2),
                            Description = r.GetString(1),
                            Price = r.GetString(3),
                            Category = r.GetString(4)
                        };
                        products.Add(p);
                    }
                }
            }
            return products;
        }
    }
    public class Product{
        public int Id{get;set;}
        public string Name{get;set;}
        public string Description{get;set;}
        public string Price{get;set;}
        public string Category{get;set;}

    }
}