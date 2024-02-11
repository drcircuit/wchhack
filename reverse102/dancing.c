#include <stdio.h>

long flag = 0xd15c0babe;
void printFlag(){
    printf("The flag is${%lx}", flag);
}
void main(){
    printf("Can you figure out the flag?");
}