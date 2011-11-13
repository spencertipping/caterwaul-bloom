// Variable-size Bloom filters | Spencer Tipping
// Licensed under the terms of the MIT source code license

// Introduction.
// This Bloom filter implementation is motivated by Havoc, which needs a way to partition trees into hashed sets as well as quickly rejecting impossible rewrites. The use case there is that there
// are syntax trees with constants and variables. The Bloom filter represents the set of constants present in the syntax tree. The subset relation can be checked by the usual A & B = A (if B
// contains everything in A), which fails quickly even for large filters and is computationally inexpensive.

// Ever since reading a paper about the latency of various arithmetic operations on x86, I've been reluctant to use things like division and modulus. So all of these filters are power-of-two
// sizes and use bitwise operations for modulus. This has the interesting benefit that all Bloom filter sizes differ by an integer multiple, which means that they can be dynamically rehashed to
// compare across sizes. For instance, suppose you've got an 8-filter and a 16-filter. You can do subset comparisons by OR-ing the two halves of the 16-filter, like this:

// | (f8[0] & (f16[0] | f16[8])) === f8[0] && (f8[1] & (f16[1] | f16[9])) === f8[1] && ...

caterwaul.js_all()(function ($) {

// Implementation.
// Caterwaul Bloom filters are implemented as bit-vectors stuffed into 32-bit signed integer values. When you build a filter, you specify the array of hash functions (which map stuff to
// arbitrarily large numbers, preferably unsigned integers) and the number of 32-bit words you want to use for the table. The bit counting algorithm was retrieved from
// http://graphics.stanford.edu/~seander/bithacks.html#CountBitsSetParallel.

  $.bloom(hash_functions, words) = words === 1 ? new $.bloom.single(hash_functions) : new $.bloom.array(hash_functions, words),

  $.bloom.array(hs, words) = this -se [it.table = words instanceof Array ? +words -seq : n[words] *[0] -seq,
                                       it.size  = words instanceof Array ? words.length : words,
                                       it.mask  = it.size - 1 -se [raise [new Error('Caterwaul Bloom filter: #{it.size} is not a power of two')] -when [it.size & (it.size - 1)]],
                                       it.hs    = hs],

  $.bloom.array.prototype /-$.merge/ capture [set_bit(n) = this.table[n >>> 5 & this.mask] |= (1 << (n & 31)),
                                              get_bit(n) = this.table[n >>> 5 & this.mask] & (1 << (n & 31)),
                                              hash()     = this.table /[x ^ x0] -seq,
                                              density()  = this.table /[0][x0 + (x -= x >>> 1 & 0x55555555, x = (x & 0x33333333) + ((x >>> 2) & 0x33333333),
                                                                                 (x + (x >>> 4) & 0xf0f0f0f) * 0x1010101 >>> 24)] -seq,

                                              add(xs = arguments) = xs *!~item[this.hs *![this.set_bit(x(item))]] -seq -re- this,
                                              contains(item)      = !(this.hs |[!this.get_bit(x(item))] |seq),

                                              union(f)        = $.bloom(this.hs, this.table *[x | ft[xi]] -seq) -where [ft = f.table],
                                              intersect(f)    = $.bloom(this.hs, this.table *[x & ft[xi]] -seq) -where [ft = f.table],
                                              subset(f)       = !(this.table |[(x & ft[xi]) !== x] |seq)   -where [ft = f.table],
                                              reduce_to(size) = $.bloom(this.hs, n[size] *[0] -seq -se [this.table *![it[xi & mask] |= x] -seq] -where [mask = size - 1])],

// Unboxed implementation.
// This implementation doesn't allocate the array, instead using a flat integer for the value. As such, it has a fixed size of 32 bits. It is automatically created when you request a filter of
// size one.

  $.bloom.single(hs, v) = this -se [it.value = v || 0, it.size = 1, it.hs = hs],

  $.bloom.single.prototype /-$.merge/ capture [set_bit(n)              = this.value |= 1 << (n & 31),
                                               get_bit(n)              = this.value & 1 << (n & 31),
                                               hash()                  = this.value,
                                               density(x = this.value) = (x -= x >>> 1 & 0x55555555, x = (x & 0x33333333) + ((x >>> 2) & 0x33333333),
                                                                          (x + (x >>> 4) & 0xf0f0f0f) * 0x1010101 >>> 24),

                                               add(xs = arguments) = xs *!~item[this.hs *![this.set_bit(x(item))]] -seq -re- this,
                                               contains(item)      = !(this.hs |[!this.get_bit(x(item))] |seq),

                                               union(f)     = new $.bloom.single(this.hs, this.value | f.value),
                                               intersect(f) = new $.bloom.single(this.hs, this.value & f.value),
                                               subset(f)    = (this.value & f.value) === this.value],

// Standard hash functions.
// These are just for convenience; you can also define your own. These functions are optimized to avoid allocating memory.

  $.bloom /-$.merge/ wcapture [jenkins_string_hash(key)             = function (s) {for (var h = key, i = 0, l = s.length; i < l; ++i) h += s.charCodeAt(i), h += h << 10, h ^= h >>> 6;
                                                                                    return h += h << 3, h ^= h >>> 11, h += h << 15},
                               jenkins_string(xs = arguments)       = +xs *jenkins_string_hash -seq]})(caterwaul);

// Generated by SDoc 
