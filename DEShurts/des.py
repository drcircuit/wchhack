from Crypto.Cipher import DES
import base64
FLAG="$$$$$$$$$$$$$$$$$$$$"


def pad(plaintext):
    while len(plaintext) % 8 != 0:
        plaintext += "*"
    return plaintext

def enc(plaintext,key):
    cipher = DES.new(key, DES.MODE_ECB)
    return base64.b64encode(cipher.encrypt(bytearray(plaintext,"ASCII")))


key = b'x?x?x?x?x?x?x?x?'
plaintext = pad(FLAG)
print(enc(plaintext,key))