#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>
#include <stdbool.h>

struct account
{
    char name[128];
    int balance;
    bool is_gold_customer;
} __attribute__((packed));

int main()
{
    struct account customer;
    customer.is_gold_customer = 0;
    customer.balance = 1000;
    setvbuf(stdout, NULL, _IONBF, 0);
    printf("Welcome to DNB. Introduce yourself!Enter name: \n");
    read(STDIN_FILENO, customer.name, 256);
    if (customer.balance > 0 && customer.is_gold_customer == 1)
    {
        printf("You are a gold customer, here is your bank shell:\n");
        system("/bin/bash");
    }
    else
    {
        printf("Sorry, this service is for gold customers only..\n");
    }
    return 0;
}
