#include <stdio.h>
#include <stdlib.h>

char *obiFlag = "${TheseAreNotTheVARSYoureLookingFor...}";
char *lukeFlag = "${ButIWantedToGoToTochiStationAndPickupEnvironmentConverters!}";
char *vaderFlag = "${IFindYourLackOfPrintingDisturbing...}";
char *palpatineFlag = "${StrikeMeDownWithThePowerOfStrings!}";
char *yodaFlag = "${BufferOverflowThisIsNot...}";

void main()
{
    char name[280];
    char *flags[] = {obiFlag, lukeFlag, vaderFlag, palpatineFlag, yodaFlag};
    int n;
    time_t t;
    srand(time(&t));
    n = rand() % 5;
    printf("Please enter your name: ");
    fflush(stdout);
    fgets(name, 0x100, stdin);
    printf("\nHello there, ");
    printf(name);
    printf("%s\n", flags[n]);
}