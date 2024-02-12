import binascii
import gmpy2
import base64

def fermat_factorization(n):
    a = gmpy2.isqrt(n)
    b2 = gmpy2.square(a) - n
    while not gmpy2.is_square(b2):
        a += 1
        b2 = gmpy2.square(a) - n
    p = a + gmpy2.isqrt(b2)
    q = a - gmpy2.isqrt(b2)
    return int(p), int(q)

def rsa_decrypt(p, q, e, cipher):
    n = p * q
    phi = (p - 1) * (q - 1)
    d = gmpy2.invert(e, phi)
    return pow(cipher, d, n)

def rsa_number_to_string(n):
    return binascii.unhexlify(hex(n)[2:]).decode('utf-8')
# read output.txt as cipher text base64 decode it 
f = open('output.txt', 'rb')
# base64 decode into base 2
ciphertext = f.read()
ciphertext = ciphertext.replace(b'\n', b'')
f.close()
# read key from pubkey.txt

# read key from pubkey.txt
with open('pubkey.txt', 'r') as f:
    key = f.read().strip()
    f.close()

# remove key boundaries and newlines
key = key.replace('-----BEGIN PUBLIC KEY-----', '')
key = key.replace('-----END PUBLIC KEY-----', '')
key = key.replace('\n', '')
# convert key to base 10
n = int.from_bytes(base64.b64decode(key), 'big')
cipher = int.from_bytes(base64.b64decode(ciphertext), 'big')
# factorize n
p, q = fermat_factorization(n)
# decrypt cipher using rsa_decrypt
plain = rsa_decrypt(p, q, 65537, cipher)
# convert plain to string
plain = rsa_number_to_string(plain)
print(plain)



