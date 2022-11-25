import crypto from 'crypto'

export const ID = function () {
/*
 * 32byte hashes are unwieldy to print, especially as hexstrings
 * so we use the geoID alphabet, which also allows us to shorten them a lot in printing while preserving uniqueness in the set
 * Mongo allows for other ID types than 24byte ObjectIDs, but just using strings here would would almost double the memory usage of the ID
 * so we write those two helper functions to parse and write to and from 32byte buffers that are then used as IDs
 */
  
  const alphabet = '0123456789bcdefghjkmnpqrstuvwxyz'
  function cv(s) { return alphabet.indexOf(s) }
  return {
    hash: function(o) {
      // canonical document form is just the passed domain fields, not the internal mongo fields, so only those must be passed
      const s = Buffer.isBuffer(o) ? o: typeof o === 'string' ? o : JSON.stringify(o)
      const h = crypto.createHash('sha256').update(s).digest()
      return [...h]
    },
    buffer: function(idString) {
      const s = idString
      const buf = new Array(32)
      
      for(let i = 0, j=0;i<30; i+=5, j+=8) {
        const v0 = cv(s[j+0])
        const v1 = cv(s[j+1])
        const v2 = cv(s[j+2])
        const v3 = cv(s[j+3])
        const v4 = cv(s[j+4])
        const v5 = cv(s[j+5])
        const v6 = cv(s[j+6])
        const v7 = cv(s[j+7])
        buf[i+0] = (v0<<3) + (v1>>2)               // 5bits from 0 and 3bits from 1
        buf[i+1] = ((v1&3)<<6) + (v2<<1) + (v3>>4) // 2bits from 1, 5bits from 2, 1bit from 3
        buf[i+2] = ((v3&15)<<4) + (v4>>1)          // 4bits from 3, 4bits from 4
        buf[i+3] = ((v4&1)<<7) + (v5<<2) + (v6>>3) // 1bit from 4, 5bits from 5, 2bits from 6
        buf[i+4] = ((v6&7)<<5)+v7                  // 3bits from 6, 5bits from 7
      }

      const p0 = cv(s[48])
      const p1 = cv(s[49])
      const p2 = cv(s[50])
      const p3 = cv(s[51])

      buf[30] = (p0<<3) + (p1>>2)
      buf[31] = ((p1&3)<<6) + (p2<<1) + (p3&1)

      return buf;
    },
    string: function(idBin) {
      var id = "";
      // we use sha256 hashes, 32bytes and a 32 digit alphabet
      // each digit takes 5bits, so we shift 5 8bit bytes around to get 8 5bit digits
      // do that 6 times for 30bytes, and then 2bytes are left
      
      //  so first 6×5 bytes

      for(let i = 0;i<30; i+=5) {
        id += alphabet[idBin[i]>>3];                           // 3bits left in 0
        id += alphabet[((idBin[i]&7)<<2) + (idBin[i+1]>>6)];   // 6bits left in 1
        id += alphabet[(idBin[i+1]>>1)&31];                    // 1bit left in 1
        id += alphabet[((idBin[i+1]&1)<<4) + (idBin[i+2]>>4)]; // 4bit left in 2
        id += alphabet[((idBin[i+2]&15)<<1) + (idBin[i+3]>>7)] // 7bits left in 3
        id += alphabet[(idBin[i+3]>>2)&31];                    // 2bits left in 3
        id += alphabet[((idBin[i+3]&3)<<3) + (idBin[i+4]>>5)]; // 5bits left in 4
        id += alphabet[idBin[i+4]&31]                          // nothing left in 4
        //id += ' '
      }

      // now the last two bytes to 4 digits
      id += alphabet[idBin[30]>>3];                          // 3bits left in 30
      id += alphabet[((idBin[30]&7)<<2) + (idBin[31]>>6)];   // 6bits left in 31
      id += alphabet[(idBin[31]>>1)&31];                     // 1bit left in 31
      id += alphabet[idBin[31]&1]
      return id
    }
  }
}()
