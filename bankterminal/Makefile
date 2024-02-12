CC=gcc
CFLAGS=-Wall -Wextra -m32

.PHONY: all clean

all: bankterminal

bankterminal: bankterminal.c
	$(CC) $(CFLAGS) $^ -o $@
	#mv $@ $@_`sha1sum $@`

clean:
	rm -vf bankterminal