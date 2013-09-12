/* crypto helpers */


function pwhash(pass) {
    /* get the clear text password, generate a salt
       and hash them together. return the hash */
    var salt = CryptoJS.lib.WordArray.random(128/8);
    console.log("key: %s, salt: %s", pass, salt);
    var key512iter32 = CryptoJS.PBKDF2(pass, salt,{ keySize: 512/32, iterations: 32, hasher: CryptoJS.algo.SHA512 });
    return key512iter32;
}
