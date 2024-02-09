#include <stdio.h>
#include <string.h>
const char *pass = "deadc0de";
int main() {
    char password[8];
    char flag[64];
    FILE *f;

    printf("Enter the password: ");
    fflush(stdout);
    scanf("%s", password);

    if (strcmp(password, pass) == 0) {
        f = fopen("/flag.txt", "r");
        if (f == NULL) {
            printf("flag.txt not found\n");
            return 1;
        }
        fgets(flag, 64, f);
        printf("%s\n", flag);
    } else {
        printf("Wrong password\n");
    }

    return 0;
}