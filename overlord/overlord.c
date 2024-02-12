#include <stdio.h>
#include <string.h>
void vulnerable()
{
    char buffer[64];
    int boolval = 0;
    printf("Enter your name: ");
    fflush(stdout);
    gets(buffer);
    if (!boolval)
    {
        printf("No access!\n");
    }
    else
    {
        // open and print ./flag.txt

        FILE *f = fopen("/flag.txt", "r");
        if (f == NULL)
        {
            printf("Flag file not found.\n");
            exit(1);
        }
        char buffer[64];
        fread(buffer, 1, 64, f);
        printf("%s\n", buffer);
        fclose(f);
    }
}

int main()
{
    vulnerable();
    return 0;
}