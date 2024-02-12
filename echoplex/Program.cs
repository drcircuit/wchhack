using System;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace EchoServer
{
    class Program
    {
        static int pointer = -1;
        static string[] phrases = new string[]
        {
            "Reality is an illusion",
            "It is better to be feared than loved",
            "What I cannot create, I cannot understand",
            "Prediction is very difficult, especially about the future",
            "All science is either physics or stamp collecting",
            "${TheCakeIsNotALie}"
        };

        static async Task Main(string[] args)
        {
            int port = Environment.GetEnvironmentVariable("ECHOPORT") != null ? int.Parse(Environment.GetEnvironmentVariable("ECHOPORT")) : 42;

            var listener = new TcpListener(IPAddress.Any, port);
            listener.Start();
            Console.WriteLine($"Echoplex is up on [{port}]");

            try
            {
                while (true)
                {
                    var client = await listener.AcceptTcpClientAsync();
                    _ = Task.Run(() => HandleClient(client));
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"something terrible happened.. {ex}");
            }
        }

        static async Task HandleClient(TcpClient client)
        {
            string clientEndPoint = client.Client.RemoteEndPoint.ToString();
            Console.WriteLine($"Connected to {clientEndPoint}");

            NetworkStream stream = client.GetStream();
            StreamReader reader = new StreamReader(stream, Encoding.UTF8);
            StreamWriter writer = new StreamWriter(stream, Encoding.UTF8) { AutoFlush = true };

            while (client.Connected)
            {
                try
                {
                    string data = await reader.ReadLineAsync();
                    if (data != null)
                    {
                        await Task.Delay(300); // Simulate delay
                        
                        if (pointer < 0)
                        {
                            pointer++;
                        }
                        else
                        {
                            if (data.Trim() == phrases[pointer])
                            {
                                pointer++;
                            }
                            else
                            {
                                pointer = -1;
                                await writer.WriteLineAsync("That is not the quote you're looking for...");
                                continue;
                            }
                        }

                        if (pointer == phrases.Length)
                        {
                            pointer = -1;
                            await writer.WriteLineAsync("Sure you didn't find the answer?");
                            continue;
                        }

                        Console.WriteLine($"Echoing: [{phrases[pointer]}]");
                        await writer.WriteLineAsync(phrases[pointer]);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error: {ex}");
                    break;
                }
            }

            client.Close();
            Console.WriteLine($"Disconnected from {clientEndPoint}");
        }
    }
}
