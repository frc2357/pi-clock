# Builds nfc support code
#

TEST := nfc_get_uid
CC := gcc
CFLAGS := -fPIC -O3 -g -Wall -Werror
TEST_OBJECTS := nfc_get_uid.o

MAJOR := 0
MINOR := 1
NAME := nfcutils
VERSION := $(MAJOR).$(MINOR)

INSTALL_PREFIX := /usr

.PHONY: default all clean lib install

default: $(TEST) lib
all: default

lib: lib$(NAME).so

lib$(NAME).so: lib$(NAME).so.$(VERSION)
	ldconfig -v -n .
	ln -s lib$(NAME).so.$(MAJOR) lib$(NAME).so

lib$(NAME).so.$(VERSION): $(NAME).o
	$(CC) -fPIC -O3 -shared -Wl,-soname,lib$(NAME).so.$(MAJOR) $^ -o $@ -lnfc

%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

.PRECIOUS: $(TEST) $(TEST_OBJECTS)

$(TEST): $(TEST_OBJECTS) lib$(NAME).so
	$(CC) $(TEST_OBJECTS) -o $@ -L. -l$(NAME) -lnfc

test: $(TEST)
	LD_LIBRARY_PATH=. ./$(TEST) -v

install: lib
	install -m 0755 *.so* -D -t $(INSTALL_PREFIX)/lib

clean:
	-rm -f *.o *.so*
	-rm -f nfc_get_uid
