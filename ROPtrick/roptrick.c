#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void pwned() {
    printf("Congratulations! You've successfully exploited the vulnerability.\n");
    printf("Here's the flag:\n");
    // read flag.txt into buffer and print it
    FILE *f = fopen("/flag.txt", "r");
    if (f == NULL) {
        printf("Flag file not found.\n");
        exit(1);
    }
    char buffer[64];
    fread(buffer, 1, 64, f);
    printf("%s\n", buffer);
    fclose(f);

    return;
    
}

void vulnerable_function() {
    char buffer[64];
    printf("Enter some text: ");
    fflush(stdout);
    gets(buffer); // This is vulnerable to buffer overflow
    printf("You entered: %s\n", buffer);
    return;
}

int main() {
    printf("Run me: %p\n", pwned);
    vulnerable_function();
    return 0;
}