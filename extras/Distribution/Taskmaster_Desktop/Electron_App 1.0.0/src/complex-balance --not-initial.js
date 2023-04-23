/**
 * @license Complex.js v2.1.1 12/05/2020
 *
 * Copyright (c) 2020, Robert Eisele (robert@xarg.org)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 **/

/**
 *
 * This class allows the manipulation of complex numbers.
 * You can pass a complex number in different formats. Either as object, double, string or two integer parameters.
 *
 * Object form
 * { re: <real>, im: <imaginary> }
 * { arg: <angle>, abs: <radius> }
 * { phi: <angle>, r: <radius> }
 *
 * Array / Vector form
 * [ real, imaginary ]
 *
 * Double form
 * 99.3 - Single double value
 *
 * String form
 * '23.1337' - Simple real number
 * '15+3i' - a simple complex number
 * '3-i' - a simple complex number
 *
 * Example:
 *
 * var c = new Complex('99.3+8i');
 * c.mul({r: 3, i: 9}).div(4.9).sub(3, 2);
 *
 */

(function(root) {

  'use strict';

  var cosh = Math.cosh || function(x) {
    return Math.abs(x) < 1e-9 ? 1 - x : (Math.exp(x) + Math.exp(-x)) * 0.5;
  };

  var sinh = Math.sinh || function(x) {
    return Math.abs(x) < 1e-9 ? x : (Math.exp(x) - Math.exp(-x)) * 0.5;
  };

  /**
   * Calculates cos(x) - 1 using Taylor series if x is small (-¼π ≤ x ≤ ¼π).
   *
   * @param {number} x
   * @returns {number} cos(x) - 1
   */
  var cosm1 = function(x) {

    var b = Math.PI / 4;
    if (-b > x || x > b) {
      return Math.cos(x) - 1.0;
    }

    /* Calculate horner form of polynomial of taylor series in Q
    var fac = 1, alt = 1, pol = {};
    for (var i = 0; i <= 16; i++) {
      fac*= i || 1;
      if (i % 2 == 0) {
        pol[i] = new Fraction(1, alt * fac);
        alt = -alt;
      }
    }
    console.log(new Polynomial(pol).toHorner()); // (((((((1/20922789888000x^2-1/87178291200)x^2+1/479001600)x^2-1/3628800)x^2+1/40320)x^2-1/720)x^2+1/24)x^2-1/2)x^2+1
    */

    var xx = x * x;
    return xx * (
      xx * (
        xx * (
          xx * (
            xx * (
              xx * (
                xx * (
                  xx / 20922789888000
                  - 1 / 87178291200)
                + 1 / 479001600)
              - 1 / 3628800)
            + 1 / 40320)
          - 1 / 720)
        + 1 / 24)
      - 1 / 2);
  };

  var hypot = function(x, y) {

    var a = Math.abs(x);
    var b = Math.abs(y);

    if (a < 3000 && b < 3000) {
      return Math.sqrt(a * a + b * b);
    }

    if (a < b) {
      a = b;
      b = x / y;
    } else {
      b = y / x;
    }
    return a * Math.sqrt(1 + b * b);
  };

  var parser_exit = function() {
    throw SyntaxError('Invalid Param');
  };

  /**
   * Calculates log(sqrt(a^2+b^2)) in a way to avoid overflows
   *
   * @param {number} a
   * @param {number} b
   * @returns {number}
   */
  function logHypot(a, b) {

    var _a = Math.abs(a);
    var _b = Math.abs(b);

    if (a === 0) {
      return Math.log(_b);
    }

    if (b === 0) {
      return Math.log(_a);
    }

    if (_a < 3000 && _b < 3000) {
      return Math.log(a * a + b * b) * 0.5;
    }

    /* I got 4 ideas to compute this property without overflow:
     *
     * Testing 1000000 times with random samples for a,b ∈ [1, 1000000000] against a big decimal library to get an error estimate
     *
     * 1. Only eliminate the square root: (OVERALL ERROR: 3.9122483030951116e-11)

     Math.log(a * a + b * b) / 2

     *
     *
     * 2. Try to use the non-overflowing pythagoras: (OVERALL ERROR: 8.889760039210159e-10)

     var fn = function(a, b) {
     a = Math.abs(a);
     b = Math.abs(b);
     var t = Math.min(a, b);
     a = Math.max(a, b);
     t = t / a;

     return Math.log(a) + Math.log(1 + t * t) / 2;
     };

     * 3. Abuse the identity cos(atan(y/x) = x / sqrt(x^2+y^2): (OVERALL ERROR: 3.4780178737037204e-10)

     Math.log(a / Math.cos(Math.atan2(b, a)))

     * 4. Use 3. and apply log rules: (OVERALL ERROR: 1.2014087502620896e-9)

     Math.log(a) - Math.log(Math.cos(Math.atan2(b, a)))

     */

     a = a / 2;
     b = b / 2;

    return 0.5 * Math.log(a * a + b * b) + Math.LN2;
  }

  var parse = function(a, b) {

    var z = { 're': 0, 'im': 0 };

    if (a === undefined || a === null) {
      z['re'] =
      z['im'] = 0;
    } else if (b !== undefined) {
      z['re'] = a;
      z['im'] = b;
    } else
      switch (typeof a) {

        case 'object':

          if ('im' in a && 're' in a) {
            z['re'] = a['re'];
            z['im'] = a['im'];
          } else if ('abs' in a && 'arg' in a) {
            if (!Number.isFinite(a['abs']) && Number.isFinite(a['arg'])) {
              return Complex['INFINITY'];
            }
            z['re'] = a['abs'] * Math.cos(a['arg']);
            z['im'] = a['abs'] * Math.sin(a['arg']);
          } else if ('r' in a && 'phi' in a) {
            if (!Number.isFinite(a['r']) && Number.isFinite(a['phi'])) {
              return Complex['INFINITY'];
            }
            z['re'] = a['r'] * Math.cos(a['phi']);
            z['im'] = a['r'] * Math.sin(a['phi']);
          } else if (a.length === 2) { // Quick array check
            z['re'] = a[0];
            z['im'] = a[1];
          } else {
            parser_exit();
          }
          break;

        case 'string':

          z['im'] = /* void */
          z['re'] = 0;

          var tokens = a.match(/\d+\.?\d*e[+-]?\d+|\d+\.?\d*|\.\d+|./g);
          var plus = 1;
          var minus = 0;

          if (tokens === null) {
            parser_exit();
          }

          for (var i = 0; i < tokens.length; i++) {

            var c = tokens[i];

            if (c === ' ' || c === '\t' || c === '\n') {
              /* void */
            } else if (c === '+') {
              plus++;
            } else if (c === '-') {
              minus++;
            } else if (c === 'i' || c === 'I') {

              if (plus + minus === 0) {
                parser_exit();
              }

              if (tokens[i + 1] !== ' ' && !isNaN(tokens[i + 1])) {
                z['im'] += parseFloat((minus % 2 ? '-' : '') + tokens[i + 1]);
                i++;
              } else {
                z['im'] += parseFloat((minus % 2 ? '-' : '') + '1');
              }
              plus = minus = 0;

            } else {

              if (plus + minus === 0 || isNaN(c)) {
                parser_exit();
              }

              if (tokens[i + 1] === 'i' || tokens[i + 1] === 'I') {
                z['im'] += parseFloat((minus % 2 ? '-' : '') + c);
                i++;
              } else {
                z['re'] += parseFloat((minus % 2 ? '-' : '') + c);
              }
              plus = minus = 0;
            }
          }

          // Still something on the stack
          if (plus + minus > 0) {
            parser_exit();
          }
          break;

        case 'number':
          z['im'] = 0;
          z['re'] = a;
          break;

        default:
          parser_exit();
      }

    if (isNaN(z['re']) || isNaN(z['im'])) {
      // If a calculation is NaN, we treat it as NaN and don't throw
      //parser_exit();
    }

    return z;
  };

  /**
   * @constructor
   * @returns {Complex}
   */
  function Complex(a, b) {

    if (!(this instanceof Complex)) {
      return new Complex(a, b);
    }

    var z = parse(a, b);

    this['re'] = z['re'];
    this['im'] = z['im'];
  }

  Complex.prototype = {

    're': 0,
    'im': 0,

    /**
     * Calculates the sign of a complex number, which is a normalized complex
     *
     * @returns {Complex}
     */
    'sign': function() {

      var abs = this['abs']();

      return new Complex(
        this['re'] / abs,
        this['im'] / abs);
    },

    /**
     * Adds two complex numbers
     *
     * @returns {Complex}
     */
    'add': function(a, b) {

      var z = new Complex(a, b);

      // Infinity + Infinity = NaN
      if (this['isInfinite']() && z['isInfinite']()) {
        return Complex['NAN'];
      }

      // Infinity + z = Infinity { where z != Infinity }
      if (this['isInfinite']() || z['isInfinite']()) {
        return Complex['INFINITY'];
      }

      return new Complex(
        this['re'] + z['re'],
        this['im'] + z['im']);
    },

    /**
     * Subtracts two complex numbers
     *
     * @returns {Complex}
     */
    'sub': function(a, b) {

      var z = new Complex(a, b);

      // Infinity - Infinity = NaN
      if (this['isInfinite']() && z['isInfinite']()) {
        return Complex['NAN'];
      }

      // Infinity - z = Infinity { where z != Infinity }
      if (this['isInfinite']() || z['isInfinite']()) {
        return Complex['INFINITY'];
      }

      return new Complex(
        this['re'] - z['re'],
        this['im'] - z['im']);
    },

    /**
     * Multiplies two complex numbers
     *
     * @returns {Complex}
     */
    'mul': function(a, b) {

      var z = new Complex(a, b);

      // Infinity * 0 = NaN
      if ((this['isInfinite']() && z['isZero']()) || (this['isZero']() && z['isInfinite']())) {
        return Complex['NAN'];
      }

      // Infinity * z = Infinity { where z != 0 }
      if (this['isInfinite']() || z['isInfinite']()) {
        return Complex['INFINITY'];
      }

      // Short circuit for real values
      if (z['im'] === 0 && this['im'] === 0) {
        return new Complex(this['re'] * z['re'], 0);
      }

      return new Complex(
        this['re'] * z['re'] - this['im'] * z['im'],
        this['re'] * z['im'] + this['im'] * z['re']);
    },

    /**
     * Divides two complex numbers
     *
     * @returns {Complex}
     */
    'div': function(a, b) {

      var z = new Complex(a, b);

      // 0 / 0 = NaN and Infinity / Infinity = NaN
      if ((this['isZero']() && z['isZero']()) || (this['isInfinite']() && z['isInfinite']())) {
        return Complex['NAN'];
      }

      // Infinity / 0 = Infinity
      if (this['isInfinite']() || z['isZero']()) {
        return Complex['INFINITY'];
      }

      // 0 / Infinity = 0
      if (this['isZero']() || z['isInfinite']()) {
        return Complex['ZERO'];
      }

      a = this['re'];
      b = this['im'];

      var c = z['re'];
      var d = z['im'];
      var t, x;

      if (0 === d) {
        // Divisor is real
        return new Complex(a / c, b / c);
      }

      if (Math.abs(c) < Math.abs(d)) {

        x = c / d;
        t = c * x + d;

        return new Complex(
          (a * x + b) / t,
          (b * x - a) / t);

      } else {

        x = d / c;
        t = d * x + c;

        return new Complex(
          (a + b * x) / t,
          (b - a * x) / t);
      }
    },

    /**
     * Calculate the power of two complex numbers
     *
     * @returns {Complex}
     */
    'pow': function(a, b) {

      var z = new Complex(a, b);

      a = this['re'];
      b = this['im'];

      if (z['isZero']()) {
        return Complex['ONE'];
      }

      // If the exponent is real
      if (z['im'] === 0) {

        if (b === 0 && a > 0) {

          return new Complex(Math.pow(a, z['re']), 0);

        } else if (a === 0) { // If base is fully imaginary

          switch ((z['re'] % 4 + 4) % 4) {
            case 0:
              return new Complex(Math.pow(b, z['re']), 0);
            case 1:
              return new Complex(0, Math.pow(b, z['re']));
            case 2:
              return new Complex(-Math.pow(b, z['re']), 0);
            case 3:
              return new Complex(0, -Math.pow(b, z['re']));
          }
        }
      }

      /* I couldn't find a good formula, so here is a derivation and optimization
       *
       * z_1^z_2 = (a + bi)^(c + di)
       *         = exp((c + di) * log(a + bi)
       *         = pow(a^2 + b^2, (c + di) / 2) * exp(i(c + di)atan2(b, a))
       * =>...
       * Re = (pow(a^2 + b^2, c / 2) * exp(-d * atan2(b, a))) * cos(d * log(a^2 + b^2) / 2 + c * atan2(b, a))
       * Im = (pow(a^2 + b^2, c / 2) * exp(-d * atan2(b, a))) * sin(d * log(a^2 + b^2) / 2 + c * atan2(b, a))
       *
       * =>...
       * Re = exp(c * log(sqrt(a^2 + b^2)) - d * atan2(b, a)) * cos(d * log(sqrt(a^2 + b^2)) + c * atan2(b, a))
       * Im = exp(c * log(sqrt(a^2 + b^2)) - d * atan2(b, a)) * sin(d * log(sqrt(a^2 + b^2)) + c * atan2(b, a))
       *
       * =>
       * Re = exp(c * logsq2 - d * arg(z_1)) * cos(d * logsq2 + c * arg(z_1))
       * Im = exp(c * logsq2 - d * arg(z_1)) * sin(d * logsq2 + c * arg(z_1))
       *
       */

      if (a === 0 && b === 0 && z['re'] > 0 && z['im'] >= 0) {
        return Complex['ZERO'];
      }

      var arg = Math.atan2(b, a);
      var loh = logHypot(a, b);

      a = Math.exp(z['re'] * loh - z['im'] * arg);
      b = z['im'] * loh + z['re'] * arg;
      return new Complex(
        a * Math.cos(b),
        a * Math.sin(b));
    },

    /**
     * Calculate the complex square root
     *
     * @returns {Complex}
     */
    'sqrt': function() {

      var a = this['re'];
      var b = this['im'];
      var r = this['abs']();

      var re, im;

      if (a >= 0) {

        if (b === 0) {
          return new Complex(Math.sqrt(a), 0);
        }

        re = 0.5 * Math.sqrt(2.0 * (r + a));
      } else {
        re = Math.abs(b) / Math.sqrt(2 * (r - a));
      }

      if (a <= 0) {
        im = 0.5 * Math.sqrt(2.0 * (r - a));
      } else {
        im = Math.abs(b) / Math.sqrt(2 * (r + a));
      }

      return new Complex(re, b < 0 ? -im : im);
    },

    /**
     * Calculate the complex exponent
     *
     * @returns {Complex}
     */
    'exp': function() {

      var tmp = Math.exp(this['re']);

      if (this['im'] === 0) {
        //return new Complex(tmp, 0);
      }
      return new Complex(
        tmp * Math.cos(this['im']),
        tmp * Math.sin(this['im']));
    },

    /**
     * Calculate the complex exponent and subtracts one.
     *
     * This may be more accurate than `Complex(x).exp().sub(1)` if
     * `x` is small.
     *
     * @returns {Complex}
     */
    'expm1': function() {

      /**
       * exp(a + i*b) - 1
       = exp(a) * (cos(b) + j*sin(b)) - 1
       = expm1(a)*cos(b) + cosm1(b) + j*exp(a)*sin(b)
       */

      var a = this['re'];
      var b = this['im'];

      return new Complex(
        Math.expm1(a) * Math.cos(b) + cosm1(b),
        Math.exp(a) * Math.sin(b));
    },

    /**
     * Calculate the natural log
     *
     * @returns {Complex}
     */
    'log': function() {

      var a = this['re'];
      var b = this['im'];

      if (b === 0 && a > 0) {
        //return new Complex(Math.log(a), 0);
      }

      return new Complex(
        logHypot(a, b),
        Math.atan2(b, a));
    },

    /**
     * Calculate the magnitude of the complex number
     *
     * @returns {number}
     */
    'abs': function() {

      return hypot(this['re'], this['im']);
    },

    /**
     * Calculate the angle of the complex number
     *
     * @returns {number}
     */
    'arg': function() {

      return Math.atan2(this['im'], this['re']);
    },

    /**
     * Calculate the sine of the complex number
     *
     * @returns {Complex}
     */
    'sin': function() {

      // sin(z) = ( e^iz - e^-iz ) / 2i 
      //        = sin(a)cosh(b) + i cos(a)sinh(b)

      var a = this['re'];
      var b = this['im'];

      return new Complex(
        Math.sin(a) * cosh(b),
        Math.cos(a) * sinh(b));
    },

    /**
     * Calculate the cosine
     *
     * @returns {Complex}
     */
    'cos': function() {

      // cos(z) = ( e^iz + e^-iz ) / 2 
      //        = cos(a)cosh(b) - i sin(a)sinh(b)

      var a = this['re'];
      var b = this['im'];

      return new Complex(
        Math.cos(a) * cosh(b),
        -Math.sin(a) * sinh(b));
    },

    /**
     * Calculate the tangent
     *
     * @returns {Complex}
     */
    'tan': function() {

      // tan(z) = sin(z) / cos(z) 
      //        = ( e^iz - e^-iz ) / ( i( e^iz + e^-iz ) )
      //        = ( e^2iz - 1 ) / i( e^2iz + 1 )
      //        = ( sin(2a) + i sinh(2b) ) / ( cos(2a) + cosh(2b) )

      var a = 2 * this['re'];
      var b = 2 * this['im'];
      var d = Math.cos(a) + cosh(b);

      return new Complex(
        Math.sin(a) / d,
        sinh(b) / d);
    },

    /**
     * Calculate the cotangent
     *
     * @returns {Complex}
     */
    'cot': function() {

      // cot(c) = i(e^(ci) + e^(-ci)) / (e^(ci) - e^(-ci))

      var a = 2 * this['re'];
      var b = 2 * this['im'];
      var d = Math.cos(a) - cosh(b);

      return new Complex(
        -Math.sin(a) / d,
        sinh(b) / d);
    },

    /**
     * Calculate the secant
     *
     * @returns {Complex}
     */
    'sec': function() {

      // sec(c) = 2 / (e^(ci) + e^(-ci))

      var a = this['re'];
      var b = this['im'];
      var d = 0.5 * cosh(2 * b) + 0.5 * Math.cos(2 * a);

      return new Complex(
        Math.cos(a) * cosh(b) / d,
        Math.sin(a) * sinh(b) / d);
    },

    /**
     * Calculate the cosecans
     *
     * @returns {Complex}
     */
    'csc': function() {

      // csc(c) = 2i / (e^(ci) - e^(-ci))

      var a = this['re'];
      var b = this['im'];
      var d = 0.5 * cosh(2 * b) - 0.5 * Math.cos(2 * a);

      return new Complex(
        Math.sin(a) * cosh(b) / d,
        -Math.cos(a) * sinh(b) / d);
    },

    /**
     * Calculate the complex arcus sinus
     *
     * @returns {Complex}
     */
    'asin': function() {

      // asin(c) = -i * log(ci + sqrt(1 - c^2))

      var a = this['re'];
      var b = this['im'];

      var t1 = new Complex(
        b * b - a * a + 1,
        -2 * a * b)['sqrt']();

      var t2 = new Complex(
        t1['re'] - b,
        t1['im'] + a)['log']();

      return new Complex(t2['im'], -t2['re']);
    },

    /**
     * Calculate the complex arcus cosinus
     *
     * @returns {Complex}
     */
    'acos': function() {

      // acos(c) = i * log(c - i * sqrt(1 - c^2))

      var a = this['re'];
      var b = this['im'];

      var t1 = new Complex(
        b * b - a * a + 1,
        -2 * a * b)['sqrt']();

      var t2 = new Complex(
        t1['re'] - b,
        t1['im'] + a)['log']();

      return new Complex(Math.PI / 2 - t2['im'], t2['re']);
    },

    /**
     * Calculate the complex arcus tangent
     *
     * @returns {Complex}
     */
    'atan': function() {

      // atan(c) = i / 2 log((i + x) / (i - x))

      var a = this['re'];
      var b = this['im'];

      if (a === 0) {

        if (b === 1) {
          return new Complex(0, Infinity);
        }

        if (b === -1) {
          return new Complex(0, -Infinity);
        }
      }

      var d = a * a + (1.0 - b) * (1.0 - b);

      var t1 = new Complex(
        (1 - b * b - a * a) / d,
        -2 * a / d).log();

      return new Complex(-0.5 * t1['im'], 0.5 * t1['re']);
    },

    /**
     * Calculate the complex arcus cotangent
     *
     * @returns {Complex}
     */
    'acot': function() {

      // acot(c) = i / 2 log((c - i) / (c + i))

      var a = this['re'];
      var b = this['im'];

      if (b === 0) {
        return new Complex(Math.atan2(1, a), 0);
      }

      var d = a * a + b * b;
      return (d !== 0)
        ? new Complex(
          a / d,
          -b / d).atan()
        : new Complex(
          (a !== 0) ? a / 0 : 0,
          (b !== 0) ? -b / 0 : 0).atan();
    },

    /**
     * Calculate the complex arcus secant
     *
     * @returns {Complex}
     */
    'asec': function() {

      // asec(c) = -i * log(1 / c + sqrt(1 - i / c^2))

      var a = this['re'];
      var b = this['im'];

      if (a === 0 && b === 0) {
        return new Complex(0, Infinity);
      }

      var d = a * a + b * b;
      return (d !== 0)
        ? new Complex(
          a / d,
          -b / d).acos()
        : new Complex(
          (a !== 0) ? a / 0 : 0,
          (b !== 0) ? -b / 0 : 0).acos();
    },

    /**
     * Calculate the complex arcus cosecans
     *
     * @returns {Complex}
     */
    'acsc': function() {

      // acsc(c) = -i * log(i / c + sqrt(1 - 1 / c^2))

      var a = this['re'];
      var b = this['im'];

      if (a === 0 && b === 0) {
        return new Complex(Math.PI / 2, Infinity);
      }

      var d = a * a + b * b;
      return (d !== 0)
        ? new Complex(
          a / d,
          -b / d).asin()
        : new Complex(
          (a !== 0) ? a / 0 : 0,
          (b !== 0) ? -b / 0 : 0).asin();
    },

    /**
     * Calculate the complex sinh
     *
     * @returns {Complex}
     */
    'sinh': function() {

      // sinh(c) = (e^c - e^-c) / 2

      var a = this['re'];
      var b = this['im'];

      return new Complex(
        sinh(a) * Math.cos(b),
        cosh(a) * Math.sin(b));
    },

    /**
     * Calculate the complex cosh
     *
     * @returns {Complex}
     */
    'cosh': function() {

      // cosh(c) = (e^c + e^-c) / 2

      var a = this['re'];
      var b = this['im'];

      return new Complex(
        cosh(a) * Math.cos(b),
        sinh(a) * Math.sin(b));
    },

    /**
     * Calculate the complex tanh
     *
     * @returns {Complex}
     */
    'tanh': function() {

      // tanh(c) = (e^c - e^-c) / (e^c + e^-c)

      var a = 2 * this['re'];
      var b = 2 * this['im'];
      var d = cosh(a) + Math.cos(b);

      return new Complex(
        sinh(a) / d,
        Math.sin(b) / d);
    },

    /**
     * Calculate the complex coth
     *
     * @returns {Complex}
     */
    'coth': function() {

      // coth(c) = (e^c + e^-c) / (e^c - e^-c)

      var a = 2 * this['re'];
      var b = 2 * this['im'];
      var d = cosh(a) - Math.cos(b);

      return new Complex(
        sinh(a) / d,
        -Math.sin(b) / d);
    },

    /**
     * Calculate the complex coth
     *
     * @returns {Complex}
     */
    'csch': function() {

      // csch(c) = 2 / (e^c - e^-c)

      var a = this['re'];
      var b = this['im'];
      var d = Math.cos(2 * b) - cosh(2 * a);

      return new Complex(
        -2 * sinh(a) * Math.cos(b) / d,
        2 * cosh(a) * Math.sin(b) / d);
    },

    /**
     * Calculate the complex sech
     *
     * @returns {Complex}
     */
    'sech': function() {

      // sech(c) = 2 / (e^c + e^-c)

      var a = this['re'];
      var b = this['im'];
      var d = Math.cos(2 * b) + cosh(2 * a);

      return new Complex(
        2 * cosh(a) * Math.cos(b) / d,
        -2 * sinh(a) * Math.sin(b) / d);
    },

    /**
     * Calculate the complex asinh
     *
     * @returns {Complex}
     */
    'asinh': function() {

      // asinh(c) = log(c + sqrt(c^2 + 1))

      var tmp = this['im'];
      this['im'] = -this['re'];
      this['re'] = tmp;
      var res = this['asin']();

      this['re'] = -this['im'];
      this['im'] = tmp;
      tmp = res['re'];

      res['re'] = -res['im'];
      res['im'] = tmp;
      return res;
    },

    /**
     * Calculate the complex acosh
     *
     * @returns {Complex}
     */
    'acosh': function() {

      // acosh(c) = log(c + sqrt(c^2 - 1))

      var res = this['acos']();
      if (res['im'] <= 0) {
        var tmp = res['re'];
        res['re'] = -res['im'];
        res['im'] = tmp;
      } else {
        var tmp = res['im'];
        res['im'] = -res['re'];
        res['re'] = tmp;
      }
      return res;
    },

    /**
     * Calculate the complex atanh
     *
     * @returns {Complex}
     */
    'atanh': function() {

      // atanh(c) = log((1+c) / (1-c)) / 2

      var a = this['re'];
      var b = this['im'];

      var noIM = a > 1 && b === 0;
      var oneMinus = 1 - a;
      var onePlus = 1 + a;
      var d = oneMinus * oneMinus + b * b;

      var x = (d !== 0)
        ? new Complex(
          (onePlus * oneMinus - b * b) / d,
          (b * oneMinus + onePlus * b) / d)
        : new Complex(
          (a !== -1) ? (a / 0) : 0,
          (b !== 0) ? (b / 0) : 0);

      var temp = x['re'];
      x['re'] = logHypot(x['re'], x['im']) / 2;
      x['im'] = Math.atan2(x['im'], temp) / 2;
      if (noIM) {
        x['im'] = -x['im'];
      }
      return x;
    },

    /**
     * Calculate the complex acoth
     *
     * @returns {Complex}
     */
    'acoth': function() {

      // acoth(c) = log((c+1) / (c-1)) / 2

      var a = this['re'];
      var b = this['im'];

      if (a === 0 && b === 0) {
        return new Complex(0, Math.PI / 2);
      }

      var d = a * a + b * b;
      return (d !== 0)
        ? new Complex(
          a / d,
          -b / d).atanh()
        : new Complex(
          (a !== 0) ? a / 0 : 0,
          (b !== 0) ? -b / 0 : 0).atanh();
    },

    /**
     * Calculate the complex acsch
     *
     * @returns {Complex}
     */
    'acsch': function() {

      // acsch(c) = log((1+sqrt(1+c^2))/c)

      var a = this['re'];
      var b = this['im'];

      if (b === 0) {

        return new Complex(
          (a !== 0)
            ? Math.log(a + Math.sqrt(a * a + 1))
            : Infinity, 0);
      }

      var d = a * a + b * b;
      return (d !== 0)
        ? new Complex(
          a / d,
          -b / d).asinh()
        : new Complex(
          (a !== 0) ? a / 0 : 0,
          (b !== 0) ? -b / 0 : 0).asinh();
    },

    /**
     * Calculate the complex asech
     *
     * @returns {Complex}
     */
    'asech': function() {

      // asech(c) = log((1+sqrt(1-c^2))/c)

      var a = this['re'];
      var b = this['im'];

      if (this['isZero']()) {
        return Complex['INFINITY'];
      }

      var d = a * a + b * b;
      return (d !== 0)
        ? new Complex(
          a / d,
          -b / d).acosh()
        : new Complex(
          (a !== 0) ? a / 0 : 0,
          (b !== 0) ? -b / 0 : 0).acosh();
    },

    /**
     * Calculate the complex inverse 1/z
     *
     * @returns {Complex}
     */
    'inverse': function() {

      // 1 / 0 = Infinity and 1 / Infinity = 0
      if (this['isZero']()) {
        return Complex['INFINITY'];
      }

      if (this['isInfinite']()) {
        return Complex['ZERO'];
      }

      var a = this['re'];
      var b = this['im'];

      var d = a * a + b * b;

      return new Complex(a / d, -b / d);
    },

    /**
     * Returns the complex conjugate
     *
     * @returns {Complex}
     */
    'conjugate': function() {

      return new Complex(this['re'], -this['im']);
    },

    /**
     * Gets the negated complex number
     *
     * @returns {Complex}
     */
    'neg': function() {

      return new Complex(-this['re'], -this['im']);
    },

    /**
     * Ceils the actual complex number
     *
     * @returns {Complex}
     */
    'ceil': function(places) {

      places = Math.pow(10, places || 0);

      return new Complex(
        Math.ceil(this['re'] * places) / places,
        Math.ceil(this['im'] * places) / places);
    },

    /**
     * Floors the actual complex number
     *
     * @returns {Complex}
     */
    'floor': function(places) {

      places = Math.pow(10, places || 0);

      return new Complex(
        Math.floor(this['re'] * places) / places,
        Math.floor(this['im'] * places) / places);
    },

    /**
     * Ceils the actual complex number
     *
     * @returns {Complex}
     */
    'round': function(places) {

      places = Math.pow(10, places || 0);

      return new Complex(
        Math.round(this['re'] * places) / places,
        Math.round(this['im'] * places) / places);
    },

    /**
     * Compares two complex numbers
     *
     * **Note:** new Complex(Infinity).equals(Infinity) === false
     *
     * @returns {boolean}
     */
    'equals': function(a, b) {

      var z = new Complex(a, b);

      return Math.abs(z['re'] - this['re']) <= Complex['EPSILON'] &&
        Math.abs(z['im'] - this['im']) <= Complex['EPSILON'];
    },

    /**
     * Clones the actual object
     *
     * @returns {Complex}
     */
    'clone': function() {

      return new Complex(this['re'], this['im']);
    },

    /**
     * Gets a string of the actual complex number
     *
     * @returns {string}
     */
    'toString': function() {

      var a = this['re'];
      var b = this['im'];
      var ret = "";

      if (this['isNaN']()) {
        return 'NaN';
      }

      if (this['isInfinite']()) {
        return 'Infinity';
      }

      if (Math.abs(a) < Complex['EPSILON']) {
        a = 0;
      }

      if (Math.abs(b) < Complex['EPSILON']) {
        b = 0;
      }

      // If is real number
      if (b === 0) {
        return ret + a;
      }

      if (a !== 0) {
        ret += a;
        ret += " ";
        if (b < 0) {
          b = -b;
          ret += "-";
        } else {
          ret += "+";
        }
        ret += " ";
      } else if (b < 0) {
        b = -b;
        ret += "-";
      }

      if (1 !== b) { // b is the absolute imaginary part
        ret += b;
      }
      return ret + "i";
    },

    /**
     * Returns the actual number as a vector
     *
     * @returns {Array}
     */
    'toVector': function() {

      return [this['re'], this['im']];
    },

    /**
     * Returns the actual real value of the current object
     *
     * @returns {number|null}
     */
    'valueOf': function() {

      if (this['im'] === 0) {
        return this['re'];
      }
      return null;
    },

    /**
     * Determines whether a complex number is not on the Riemann sphere.
     *
     * @returns {boolean}
     */
    'isNaN': function() {
      return isNaN(this['re']) || isNaN(this['im']);
    },

    /**
     * Determines whether or not a complex number is at the zero pole of the
     * Riemann sphere.
     *
     * @returns {boolean}
     */
    'isZero': function() {
      return this['im'] === 0 && this['re'] === 0;
    },

    /**
     * Determines whether a complex number is not at the infinity pole of the
     * Riemann sphere.
     *
     * @returns {boolean}
     */
    'isFinite': function() {
      return isFinite(this['re']) && isFinite(this['im']);
    },

    /**
     * Determines whether or not a complex number is at the infinity pole of the
     * Riemann sphere.
     *
     * @returns {boolean}
     */
    'isInfinite': function() {
      return !(this['isNaN']() || this['isFinite']());
    }
  };

  Complex['ZERO'] = new Complex(0, 0);
  Complex['ONE'] = new Complex(1, 0);
  Complex['I'] = new Complex(0, 1);
  Complex['PI'] = new Complex(Math.PI, 0);
  Complex['E'] = new Complex(Math.E, 0);
  Complex['INFINITY'] = new Complex(Infinity, Infinity);
  Complex['NAN'] = new Complex(NaN, NaN);
  Complex['EPSILON'] = 1e-15;

  if (typeof define === 'function' && define['amd']) {
    define([], function() {
      return Complex;
    });
  } else if (typeof exports === 'object') {
    Object.defineProperty(Complex, "__esModule", { 'value': true });
    Complex['default'] = Complex;
    Complex['Complex'] = Complex;
    module['exports'] = Complex;
  } else {
    root['Complex'] = Complex;
  }

})(this);

/*
Complex.js v2.1.1 12/05/2020

Copyright (c) 2022, Robert Eisele (robert@xarg.org)
Dual licensed under the MIT or GPL Version 2 licenses.
*/
(function(q){function n(){throw SyntaxError("Invalid Param");}function p(a,b){var c=Math.abs(a),e=Math.abs(b);if(0===a)return Math.log(e);if(0===b)return Math.log(c);if(3E3>c&&3E3>e)return.5*Math.log(a*a+b*b);a/=2;b/=2;return.5*Math.log(a*a+b*b)+Math.LN2}function d(a,b){if(!(this instanceof d))return new d(a,b);var c={re:0,im:0};if(void 0===a||null===a)c.re=c.im=0;else if(void 0!==b)c.re=a,c.im=b;else switch(typeof a){case "object":"im"in a&&"re"in a?(c.re=a.re,c.im=a.im):"abs"in a&&"arg"in a?!Number.isFinite(a.abs)&&
Number.isFinite(a.arg)?c=d.INFINITY:(c.re=a.abs*Math.cos(a.arg),c.im=a.abs*Math.sin(a.arg)):"r"in a&&"phi"in a?!Number.isFinite(a.r)&&Number.isFinite(a.phi)?c=d.INFINITY:(c.re=a.r*Math.cos(a.phi),c.im=a.r*Math.sin(a.phi)):2===a.length?(c.re=a[0],c.im=a[1]):n();break;case "string":c.im=c.re=0;var e=a.match(/\d+\.?\d*e[+-]?\d+|\d+\.?\d*|\.\d+|./g),f=1,h=0;null===e&&n();for(var l=0;l<e.length;l++){var m=e[l];" "!==m&&"\t"!==m&&"\n"!==m&&("+"===m?f++:"-"===m?h++:("i"===m||"I"===m?(0===f+h&&n()," "===
e[l+1]||isNaN(e[l+1])?c.im+=parseFloat((h%2?"-":"")+"1"):(c.im+=parseFloat((h%2?"-":"")+e[l+1]),l++)):((0===f+h||isNaN(m))&&n(),"i"===e[l+1]||"I"===e[l+1]?(c.im+=parseFloat((h%2?"-":"")+m),l++):c.re+=parseFloat((h%2?"-":"")+m)),f=h=0))}0<f+h&&n();break;case "number":c.im=0;c.re=a;break;default:n()}this.re=c.re;this.im=c.im}var g=Math.cosh||function(a){return 1E-9>Math.abs(a)?1-a:.5*(Math.exp(a)+Math.exp(-a))},k=Math.sinh||function(a){return 1E-9>Math.abs(a)?a:.5*(Math.exp(a)-Math.exp(-a))};d.prototype=
{re:0,im:0,sign:function(){var a=this.abs();return new d(this.re/a,this.im/a)},add:function(a,b){var c=new d(a,b);return this.isInfinite()&&c.isInfinite()?d.NAN:this.isInfinite()||c.isInfinite()?d.INFINITY:new d(this.re+c.re,this.im+c.im)},sub:function(a,b){var c=new d(a,b);return this.isInfinite()&&c.isInfinite()?d.NAN:this.isInfinite()||c.isInfinite()?d.INFINITY:new d(this.re-c.re,this.im-c.im)},mul:function(a,b){var c=new d(a,b);return this.isInfinite()&&c.isZero()||this.isZero()&&c.isInfinite()?
d.NAN:this.isInfinite()||c.isInfinite()?d.INFINITY:0===c.im&&0===this.im?new d(this.re*c.re,0):new d(this.re*c.re-this.im*c.im,this.re*c.im+this.im*c.re)},div:function(a,b){var c=new d(a,b);if(this.isZero()&&c.isZero()||this.isInfinite()&&c.isInfinite())return d.NAN;if(this.isInfinite()||c.isZero())return d.INFINITY;if(this.isZero()||c.isInfinite())return d.ZERO;a=this.re;b=this.im;var e=c.re,f=c.im;if(0===f)return new d(a/e,b/e);if(Math.abs(e)<Math.abs(f))return c=e/f,e=e*c+f,new d((a*c+b)/e,(b*
c-a)/e);c=f/e;e=f*c+e;return new d((a+b*c)/e,(b-a*c)/e)},pow:function(a,b){var c=new d(a,b);a=this.re;b=this.im;if(c.isZero())return d.ONE;if(0===c.im){if(0===b&&0<a)return new d(Math.pow(a,c.re),0);if(0===a)switch((c.re%4+4)%4){case 0:return new d(Math.pow(b,c.re),0);case 1:return new d(0,Math.pow(b,c.re));case 2:return new d(-Math.pow(b,c.re),0);case 3:return new d(0,-Math.pow(b,c.re))}}if(0===a&&0===b&&0<c.re&&0<=c.im)return d.ZERO;var e=Math.atan2(b,a),f=p(a,b);a=Math.exp(c.re*f-c.im*e);b=c.im*
f+c.re*e;return new d(a*Math.cos(b),a*Math.sin(b))},sqrt:function(){var a=this.re,b=this.im,c=this.abs();if(0<=a){if(0===b)return new d(Math.sqrt(a),0);var e=.5*Math.sqrt(2*(c+a))}else e=Math.abs(b)/Math.sqrt(2*(c-a));a=0>=a?.5*Math.sqrt(2*(c-a)):Math.abs(b)/Math.sqrt(2*(c+a));return new d(e,0>b?-a:a)},exp:function(){var a=Math.exp(this.re);return new d(a*Math.cos(this.im),a*Math.sin(this.im))},expm1:function(){var a=this.re,b=this.im,c=Math.expm1(a)*Math.cos(b);var e=Math.PI/4;-e>b||b>e?e=Math.cos(b)-
1:(e=b*b,e*=e*(e*(e*(e*(e*(e*(e/20922789888E3-1/87178291200)+1/479001600)-1/3628800)+1/40320)-1/720)+1/24)-.5);return new d(c+e,Math.exp(a)*Math.sin(b))},log:function(){var a=this.re,b=this.im;return new d(p(a,b),Math.atan2(b,a))},abs:function(){var a=this.re;var b=this.im,c=Math.abs(a),e=Math.abs(b);3E3>c&&3E3>e?a=Math.sqrt(c*c+e*e):(c<e?(c=e,e=a/b):e=b/a,a=c*Math.sqrt(1+e*e));return a},arg:function(){return Math.atan2(this.im,this.re)},sin:function(){var a=this.re,b=this.im;return new d(Math.sin(a)*
g(b),Math.cos(a)*k(b))},cos:function(){var a=this.re,b=this.im;return new d(Math.cos(a)*g(b),-Math.sin(a)*k(b))},tan:function(){var a=2*this.re,b=2*this.im,c=Math.cos(a)+g(b);return new d(Math.sin(a)/c,k(b)/c)},cot:function(){var a=2*this.re,b=2*this.im,c=Math.cos(a)-g(b);return new d(-Math.sin(a)/c,k(b)/c)},sec:function(){var a=this.re,b=this.im,c=.5*g(2*b)+.5*Math.cos(2*a);return new d(Math.cos(a)*g(b)/c,Math.sin(a)*k(b)/c)},csc:function(){var a=this.re,b=this.im,c=.5*g(2*b)-.5*Math.cos(2*a);return new d(Math.sin(a)*
g(b)/c,-Math.cos(a)*k(b)/c)},asin:function(){var a=this.re,b=this.im,c=(new d(b*b-a*a+1,-2*a*b)).sqrt();a=(new d(c.re-b,c.im+a)).log();return new d(a.im,-a.re)},acos:function(){var a=this.re,b=this.im,c=(new d(b*b-a*a+1,-2*a*b)).sqrt();a=(new d(c.re-b,c.im+a)).log();return new d(Math.PI/2-a.im,a.re)},atan:function(){var a=this.re,b=this.im;if(0===a){if(1===b)return new d(0,Infinity);if(-1===b)return new d(0,-Infinity)}var c=a*a+(1-b)*(1-b);a=(new d((1-b*b-a*a)/c,-2*a/c)).log();return new d(-.5*a.im,
.5*a.re)},acot:function(){var a=this.re,b=this.im;if(0===b)return new d(Math.atan2(1,a),0);var c=a*a+b*b;return 0!==c?(new d(a/c,-b/c)).atan():(new d(0!==a?a/0:0,0!==b?-b/0:0)).atan()},asec:function(){var a=this.re,b=this.im;if(0===a&&0===b)return new d(0,Infinity);var c=a*a+b*b;return 0!==c?(new d(a/c,-b/c)).acos():(new d(0!==a?a/0:0,0!==b?-b/0:0)).acos()},acsc:function(){var a=this.re,b=this.im;if(0===a&&0===b)return new d(Math.PI/2,Infinity);var c=a*a+b*b;return 0!==c?(new d(a/c,-b/c)).asin():
(new d(0!==a?a/0:0,0!==b?-b/0:0)).asin()},sinh:function(){var a=this.re,b=this.im;return new d(k(a)*Math.cos(b),g(a)*Math.sin(b))},cosh:function(){var a=this.re,b=this.im;return new d(g(a)*Math.cos(b),k(a)*Math.sin(b))},tanh:function(){var a=2*this.re,b=2*this.im,c=g(a)+Math.cos(b);return new d(k(a)/c,Math.sin(b)/c)},coth:function(){var a=2*this.re,b=2*this.im,c=g(a)-Math.cos(b);return new d(k(a)/c,-Math.sin(b)/c)},csch:function(){var a=this.re,b=this.im,c=Math.cos(2*b)-g(2*a);return new d(-2*k(a)*
Math.cos(b)/c,2*g(a)*Math.sin(b)/c)},sech:function(){var a=this.re,b=this.im,c=Math.cos(2*b)+g(2*a);return new d(2*g(a)*Math.cos(b)/c,-2*k(a)*Math.sin(b)/c)},asinh:function(){var a=this.im;this.im=-this.re;this.re=a;var b=this.asin();this.re=-this.im;this.im=a;a=b.re;b.re=-b.im;b.im=a;return b},acosh:function(){var a=this.acos();if(0>=a.im){var b=a.re;a.re=-a.im;a.im=b}else b=a.im,a.im=-a.re,a.re=b;return a},atanh:function(){var a=this.re,b=this.im,c=1<a&&0===b,e=1-a,f=1+a,h=e*e+b*b;a=0!==h?new d((f*
e-b*b)/h,(b*e+f*b)/h):new d(-1!==a?a/0:0,0!==b?b/0:0);b=a.re;a.re=p(a.re,a.im)/2;a.im=Math.atan2(a.im,b)/2;c&&(a.im=-a.im);return a},acoth:function(){var a=this.re,b=this.im;if(0===a&&0===b)return new d(0,Math.PI/2);var c=a*a+b*b;return 0!==c?(new d(a/c,-b/c)).atanh():(new d(0!==a?a/0:0,0!==b?-b/0:0)).atanh()},acsch:function(){var a=this.re,b=this.im;if(0===b)return new d(0!==a?Math.log(a+Math.sqrt(a*a+1)):Infinity,0);var c=a*a+b*b;return 0!==c?(new d(a/c,-b/c)).asinh():(new d(0!==a?a/0:0,0!==b?-b/
0:0)).asinh()},asech:function(){var a=this.re,b=this.im;if(this.isZero())return d.INFINITY;var c=a*a+b*b;return 0!==c?(new d(a/c,-b/c)).acosh():(new d(0!==a?a/0:0,0!==b?-b/0:0)).acosh()},inverse:function(){if(this.isZero())return d.INFINITY;if(this.isInfinite())return d.ZERO;var a=this.re,b=this.im,c=a*a+b*b;return new d(a/c,-b/c)},conjugate:function(){return new d(this.re,-this.im)},neg:function(){return new d(-this.re,-this.im)},ceil:function(a){a=Math.pow(10,a||0);return new d(Math.ceil(this.re*
a)/a,Math.ceil(this.im*a)/a)},floor:function(a){a=Math.pow(10,a||0);return new d(Math.floor(this.re*a)/a,Math.floor(this.im*a)/a)},round:function(a){a=Math.pow(10,a||0);return new d(Math.round(this.re*a)/a,Math.round(this.im*a)/a)},equals:function(a,b){var c=new d(a,b);return Math.abs(c.re-this.re)<=d.EPSILON&&Math.abs(c.im-this.im)<=d.EPSILON},clone:function(){return new d(this.re,this.im)},toString:function(){var a=this.re,b=this.im,c="";if(this.isNaN())return"NaN";if(this.isInfinite())return"Infinity";
Math.abs(a)<d.EPSILON&&(a=0);Math.abs(b)<d.EPSILON&&(b=0);if(0===b)return c+a;0!==a?(c=c+a+" ",0>b?(b=-b,c+="-"):c+="+",c+=" "):0>b&&(b=-b,c+="-");1!==b&&(c+=b);return c+"i"},toVector:function(){return[this.re,this.im]},valueOf:function(){return 0===this.im?this.re:null},isNaN:function(){return isNaN(this.re)||isNaN(this.im)},isZero:function(){return 0===this.im&&0===this.re},isFinite:function(){return isFinite(this.re)&&isFinite(this.im)},isInfinite:function(){return!(this.isNaN()||this.isFinite())}};
d.ZERO=new d(0,0);d.ONE=new d(1,0);d.I=new d(0,1);d.PI=new d(Math.PI,0);d.E=new d(Math.E,0);d.INFINITY=new d(Infinity,Infinity);d.NAN=new d(NaN,NaN);d.EPSILON=1E-15;"function"===typeof define&&define.amd?define([],function(){return d}):"object"===typeof exports?(Object.defineProperty(d,"__esModule",{value:!0}),d["default"]=d,d.Complex=d,module.exports=d):q.Complex=d})(this);


/**
 * @license GPS.js v0.6.1 26/01/2016
 *
 * Copyright (c) 2016, Robert Eisele (robert@xarg.org)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 **/


(function(root) {

  'use strict';

  var D2R = Math.PI / 180;

  var collectSats = {};
  var lastSeenSat = {};

  function updateState(state, data) {

    // TODO: can we really use RMC time here or is it the time of fix?
    if (data['type'] === 'RMC' || data['type'] === 'GGA' || data['type'] === 'GLL' || data['type'] === 'GNS') {
      state['time'] = data['time'];
      state['lat'] = data['lat'];
      state['lon'] = data['lon'];
    }

    if (data['type'] === 'ZDA') {
      state['time'] = data['time'];
    }

    if (data['type'] === 'GGA') {
      state['alt'] = data['alt'];
    }

    if (data['type'] === 'RMC'/* || data['type'] === 'VTG'*/) {
      // TODO: is rmc speed/track really interchangeable with vtg speed/track?
      state['speed'] = data['speed'];
      state['track'] = data['track'];
    }

    if (data['type'] === 'GSA') {
      state['satsActive'] = data['satellites'];
      state['fix'] = data['fix'];
      state['hdop'] = data['hdop'];
      state['pdop'] = data['pdop'];
      state['vdop'] = data['vdop'];
    }

    if (data['type'] === 'GSV') {

      var now = new Date().getTime();

      var sats = data['satellites'];
      for (var i = 0; i < sats.length; i++) {
        var prn = sats[i].prn;
        lastSeenSat[prn] = now;
        collectSats[prn] = sats[i];
      }

      var ret = [];
      for (var prn in collectSats) {
        if (now - lastSeenSat[prn] < 3000) // Sats are visible for 3 seconds
          ret.push(collectSats[prn])
      }
      state['satsVisible'] = ret;
    }
  }

  /**
   *
   * @param {String} time
   * @param {String=} date
   * @returns {Date}
   */
  function parseTime(time, date) {

    if (time === '') {
      return null;
    }

    var ret = new Date;

    if (date) {

      var year = date.slice(4);
      var month = date.slice(2, 4) - 1;
      var day = date.slice(0, 2);

      if (year.length === 4) {
        ret.setUTCFullYear(Number(year), Number(month), Number(day));
      } else {
        // If we need to parse older GPRMC data, we should hack something like
        // year < 73 ? 2000+year : 1900+year
        // Since GPS appeared in 1973
        ret.setUTCFullYear(Number('20' + year), Number(month), Number(day));
      }
    }

    ret.setUTCHours(Number(time.slice(0, 2)));
    ret.setUTCMinutes(Number(time.slice(2, 4)));
    ret.setUTCSeconds(Number(time.slice(4, 6)));

    // Extract the milliseconds, since they can be not present, be 3 decimal place, or 2 decimal places, or other?
    var msStr = time.slice(7);
    var msExp = msStr.length;
    var ms = 0;
    if (msExp !== 0) {
      ms = parseFloat(msStr) * Math.pow(10, 3 - msExp);
    }
    ret.setUTCMilliseconds(Number(ms));

    return ret;
  }

  function parseCoord(coord, dir) {

    // Latitude can go from 0 to 90; longitude can go from -180 to 180.

    if (coord === '')
      return null;

    var n, sgn = 1;

    switch (dir) {

      case 'S':
        sgn = -1;
      case 'N':
        n = 2;
        break;

      case 'W':
        sgn = -1;
      case 'E':
        n = 3;
        break;
    }
    /*
     * Mathematically, but more expensive and not numerical stable:
     *
     * raw = 4807.038
     * deg = Math.floor(raw / 100)
     *
     * dec = (raw - (100 * deg)) / 60
     * res = deg + dec // 48.1173
     */
    return sgn * (parseFloat(coord.slice(0, n)) + parseFloat(coord.slice(n)) / 60);
  }

  function parseNumber(num) {

    if (num === '') {
      return null;
    }
    return parseFloat(num);
  }

  function parseKnots(knots) {

    if (knots === '') {
      return null;
    }

    return parseFloat(knots) * 1.852;
  }

  function parseGSAMode(mode) {

    switch (mode) {
      case 'M':
        return 'manual';
      case 'A':
        return 'automatic';
      case '':
        return null;
    }
    throw new Error('INVALID GSA MODE: ' + mode);
  }

  function parseGGAFix(fix) {

    switch (fix) {
      case '':
      case '0':
        return null;
      case '1':
        return 'fix'; // valid SPS fix
      case '2':
        return 'dgps-fix'; // valid DGPS fix
      case '3':
        return 'pps-fix'; // valid PPS fix
      case '4':
        return 'rtk'; // valid (real time kinematic) RTK fix
      case '5':
        return 'rtk-float'; // valid (real time kinematic) RTK float
      case '6':
        return 'estimated'; // dead reckoning
      case '7':
        return 'manual';
      case '8':
        return 'simulated';
    }
    throw new Error('INVALID GGA FIX: ' + fix);
  }

  function parseGSAFix(fix) {

    switch (fix) {
      case '':
      case '1':
        return null;
      case '2':
        return '2D';
      case '3':
        return '3D';
    }
    throw new Error('INVALID GSA FIX: ' + fix);
  }

  function parseRMC_GLLStatus(status) {

    switch (status) {
      case '':
        return null;
      case 'A':
        return 'active';
      case 'V':
        return 'void';
    }
    throw new Error('INVALID RMC/GLL STATUS: ' + status);
  }

  function parseFAA(faa) {

    // Only A and D will correspond to an Active and reliable Sentence

    switch (faa) {
      case '':
        return null;
      case 'A':
        return 'autonomous';
      case 'D':
        return 'differential';
      case 'E':
        return 'estimated'; // dead reckoning
      case 'M':
        return 'manual input';
      case 'S':
        return 'simulated';
      case 'N':
        return 'not valid';
      case 'P':
        return 'precise';
      case 'R':
        return 'rtk'; // valid (real time kinematic) RTK fix
      case 'F':
        return 'rtk-float'; // valid (real time kinematic) RTK float
    }
    throw new Error('INVALID FAA MODE: ' + faa);
  }

  function parseRMCVariation(vari, dir) {

    if (vari === '' || dir === '')
      return null;

    var q = (dir === 'W') ? -1.0 : 1.0;

    return parseFloat(vari) * q;
  }

  function isValid(str, crc) {

    var checksum = 0;
    for (var i = 1; i < str.length; i++) {
      var c = str.charCodeAt(i);

      if (c === 42) // Asterisk: *
        break;

      checksum ^= c;
    }
    return checksum === parseInt(crc, 16);
  }

  function parseDist(num, unit) {

    if (unit === 'M' || unit === '') {
      return parseNumber(num);
    }
    throw new Error('Unknown unit: ' + unit);
  }

  /**
   *
   * @constructor
   */
  function GPS() {

    if (!(this instanceof GPS)) {
      return new GPS;
    }

    this['events'] = {};
    this['state'] = { 'errors': 0, 'processed': 0 };
  }

  GPS.prototype['events'] = null;
  GPS.prototype['state'] = null;

  GPS['mod'] = {
    // Global Positioning System Fix Data
    'GGA': function(str, gga) {

      if (gga.length !== 16 && gga.length !== 14) {
        throw new Error('Invalid GGA length: ' + str);
      }

      /*
       11
       1         2       3 4        5 6 7  8   9  10 |  12 13  14  15
       |         |       | |        | | |  |   |   | |   | |   |   |
       $--GGA,hhmmss.ss,llll.ll,a,yyyyy.yy,a,x,xx,x.x,x.x,M,x.x,M,x.x,xxxx*hh
       
       1) Time (UTC)
       2) Latitude
       3) N or S (North or South)
       4) Longitude
       5) E or W (East or West)
       6) GPS Quality Indicator,
       0 = Invalid, 1 = Valid SPS, 2 = Valid DGPS, 3 = Valid PPS
       7) Number of satellites in view, 00 - 12
       8) Horizontal Dilution of precision, lower is better
       9) Antenna Altitude above/below mean-sea-level (geoid)
       10) Units of antenna altitude, meters
       11) Geoidal separation, the difference between the WGS-84 earth
       ellipsoid and mean-sea-level (geoid), '-' means mean-sea-level below ellipsoid
       12) Units of geoidal separation, meters
       13) Age of differential GPS data, time in seconds since last SC104
       type 1 or 9 update, null field when DGPS is not used
       14) Differential reference station ID, 0000-1023
       15) Checksum
       */

      return {
        'time': parseTime(gga[1]),
        'lat': parseCoord(gga[2], gga[3]),
        'lon': parseCoord(gga[4], gga[5]),
        'alt': parseDist(gga[9], gga[10]),
        'quality': parseGGAFix(gga[6]),
        'satellites': parseNumber(gga[7]),
        'hdop': parseNumber(gga[8]), // dilution
        'geoidal': parseDist(gga[11], gga[12]), // aboveGeoid
        'age': gga[13] === undefined ? null : parseNumber(gga[13]), // dgps time since update
        'stationID': gga[14] === undefined ? null : parseNumber(gga[14]) // dgpsReference??
      };
    },
    // GPS DOP and active satellites
    'GSA': function(str, gsa) {

      if (gsa.length !== 19 && gsa.length !== 20) {
        throw new Error('Invalid GSA length: ' + str);
      }

      /*
       eg1. $GPGSA,A,3,,,,,,16,18,,22,24,,,3.6,2.1,2.2*3C
       eg2. $GPGSA,A,3,19,28,14,18,27,22,31,39,,,,,1.7,1.0,1.3*35
       
       
       1    = Mode:
       M=Manual, forced to operate in 2D or 3D
       A=Automatic, 3D/2D
       2    = Mode:
       1=Fix not available
       2=2D
       3=3D
       3-14 = PRNs of Satellite Vehicles (SVs) used in position fix (null for unused fields)
       15   = PDOP
       16   = HDOP
       17   = VDOP
       (18) = systemID NMEA 4.10
       18   = Checksum
       */

      var sats = [];
      for (var i = 3; i < 15; i++) {

        if (gsa[i] !== '') {
          sats.push(parseInt(gsa[i], 10));
        }
      }

      return {
        'mode': parseGSAMode(gsa[1]),
        'fix': parseGSAFix(gsa[2]),
        'satellites': sats,
        'pdop': parseNumber(gsa[15]),
        'hdop': parseNumber(gsa[16]),
        'vdop': parseNumber(gsa[17]),
        'systemId': gsa.length > 19 ? parseNumber(gsa[18]) : null
      };
    },
    // Recommended Minimum data for gps
    'RMC': function(str, rmc) {

      if (rmc.length !== 13 && rmc.length !== 14 && rmc.length !== 15) {
        throw new Error('Invalid RMC length: ' + str);
      }

      /*
       $GPRMC,hhmmss.ss,A,llll.ll,a,yyyyy.yy,a,x.x,x.x,ddmmyy,x.x,a*hh
       
       RMC  = Recommended Minimum Specific GPS/TRANSIT Data
       1    = UTC of position fix
       2    = Data status (A-ok, V-invalid)
       3    = Latitude of fix
       4    = N or S
       5    = Longitude of fix
       6    = E or W
       7    = Speed over ground in knots
       8    = Track made good in degrees True
       9    = UT date
       10   = Magnetic variation degrees (Easterly var. subtracts from true course)
       11   = E or W
       (12) = NMEA 2.3 introduced FAA mode indicator (A=Autonomous, D=Differential, E=Estimated, N=Data not valid)
       (13) = NMEA 4.10 introduced nav status
       12   = Checksum
       */

      return {
        'time': parseTime(rmc[1], rmc[9]),
        'status': parseRMC_GLLStatus(rmc[2]),
        'lat': parseCoord(rmc[3], rmc[4]),
        'lon': parseCoord(rmc[5], rmc[6]),
        'speed': parseKnots(rmc[7]),
        'track': parseNumber(rmc[8]), // heading
        'variation': parseRMCVariation(rmc[10], rmc[11]),
        'faa': rmc.length > 13 ? parseFAA(rmc[12]) : null,
        'navStatus': rmc.length > 14 ? rmc[13] : null
      };
    },
    // Track info
    'VTG': function(str, vtg) {

      if (vtg.length !== 10 && vtg.length !== 11) {
        throw new Error('Invalid VTG length: ' + str);
      }

      /*
       ------------------------------------------------------------------------------
       1  2  3  4  5  6  7  8 9   10
       |  |  |  |  |  |  |  | |   |
       $--VTG,x.x,T,x.x,M,x.x,N,x.x,K,m,*hh<CR><LF>
       ------------------------------------------------------------------------------
       
       1    = Track made good (degrees true)
       2    = Fixed text 'T' indicates that track made good is relative to true north
       3    = optional: Track made good (degrees magnetic)
       4    = optional: M: track made good is relative to magnetic north
       5    = Speed over ground in knots
       6    = Fixed text 'N' indicates that speed over ground in in knots
       7    = Speed over ground in kilometers/hour
       8    = Fixed text 'K' indicates that speed over ground is in kilometers/hour
       (9)   = FAA mode indicator (NMEA 2.3 and later)
       9/10 = Checksum
       */

      if (vtg[2] === '' && vtg[8] === '' && vtg[6] === '') {

        return {
          'track': null,
          'trackMagetic': null,
          'speed': null,
          'faa': null
        };
      }

      if (vtg[2] !== 'T') {
        throw new Error('Invalid VTG track mode: ' + str);
      }

      if (vtg[8] !== 'K' || vtg[6] !== 'N') {
        throw new Error('Invalid VTG speed tag: ' + str);
      }

      return {
        'track': parseNumber(vtg[1]), // heading
        'trackMagnetic': vtg[3] === '' ? null : parseNumber(vtg[3]), // heading uncorrected to magnetic north
        'speed': parseKnots(vtg[5]),
        'faa': vtg.length === 11 ? parseFAA(vtg[9]) : null
      };
    },
    // satellites in view
    'GSV': function(str, gsv) {

      if (gsv.length % 4 === 0) {
        // = 1 -> normal package
        // = 2 -> NMEA 4.10 extension
        // = 3 -> BeiDou extension?
        throw new Error('Invalid GSV length: ' + str);
      }

      /*
       $GPGSV,1,1,13,02,02,213,,03,-3,000,,11,00,121,,14,13,172,05*67
       
       1    = Total number of messages of this type in this cycle
       2    = Message number
       3    = Total number of SVs in view
       repeat [
       4    = SV PRN number
       5    = Elevation in degrees, 90 maximum
       6    = Azimuth, degrees from true north, 000 to 359
       7    = SNR (signal to noise ratio), 00-99 dB (null when not tracking, higher is better)
       ]
       N+1   = signalID NMEA 4.10
       N+2   = Checksum
       */

      var sats = [];

      for (var i = 4; i < gsv.length - 3; i += 4) {

        var prn = parseNumber(gsv[i]);
        var snr = parseNumber(gsv[i + 3]);
        /*
         Plot satellites in Radar chart with north on top
         by linear map elevation from 0° to 90° into r to 0
         
         centerX + cos(azimuth - 90) * (1 - elevation / 90) * radius
         centerY + sin(azimuth - 90) * (1 - elevation / 90) * radius
         */
        sats.push({
          'prn': prn,
          'elevation': parseNumber(gsv[i + 1]),
          'azimuth': parseNumber(gsv[i + 2]),
          'snr': snr,
          'status': prn !== null ? (snr !== null ? 'tracking' : 'in view') : null
        });
      }

      return {
        'msgNumber': parseNumber(gsv[2]),
        'msgsTotal': parseNumber(gsv[1]),
        'satsInView': parseNumber(gsv[3]),
        'satellites': sats,
        'signalId': gsv.length % 4 === 2 ? parseNumber(gsv[gsv.length - 2]) : null // NMEA 4.10 addition
      };
    },
    // Geographic Position - Latitude/Longitude
    'GLL': function(str, gll) {

      if (gll.length !== 9 && gll.length !== 8) {
        throw new Error('Invalid GLL length: ' + str);
      }

      /*
       ------------------------------------------------------------------------------
       1       2 3        4 5         6 7   8
       |       | |        | |         | |   |
       $--GLL,llll.ll,a,yyyyy.yy,a,hhmmss.ss,a,m,*hh<CR><LF>
       ------------------------------------------------------------------------------
       
       1. Latitude
       2. N or S (North or South)
       3. Longitude
       4. E or W (East or West)
       5. Universal Time Coordinated (UTC)
       6. Status A - Data Valid, V - Data Invalid
       7. FAA mode indicator (NMEA 2.3 and later)
       8. Checksum
       */

      return {
        'time': parseTime(gll[5]),
        'status': parseRMC_GLLStatus(gll[6]),
        'lat': parseCoord(gll[1], gll[2]),
        'lon': parseCoord(gll[3], gll[4]),
        'faa': gll.length === 9 ? parseFAA(gll[7]) : null
      };
    },
    // UTC Date / Time and Local Time Zone Offset
    'ZDA': function(str, zda) {

      /*
       1    = hhmmss.ss = UTC
       2    = xx = Day, 01 to 31
       3    = xx = Month, 01 to 12
       4    = xxxx = Year
       5    = xx = Local zone description, 00 to +/- 13 hours
       6    = xx = Local zone minutes description (same sign as hours)
       */

      // TODO: incorporate local zone information

      return {
        'time': parseTime(zda[1], zda[2] + zda[3] + zda[4])
        //'delta': time === null ? null : (Date.now() - time) / 1000
      };
    },
    'GST': function(str, gst) {

      if (gst.length !== 10) {
        throw new Error('Invalid GST length: ' + str);
      }

      /*
       1    = Time (UTC)
       2    = RMS value of the pseudorange residuals; includes carrier phase residuals during periods of RTK (float) and RTK (fixed) processing
       3    = Error ellipse semi-major axis 1 sigma error, in meters
       4    = Error ellipse semi-minor axis 1 sigma error, in meters
       5    = Error ellipse orientation, degrees from true north
       6    = Latitude 1 sigma error, in meters
       7    = Longitude 1 sigma error, in meters
       8    = Height 1 sigma error, in meters
       9    = Checksum
       */

      return {
        'time': parseTime(gst[1]),
        'rms': parseNumber(gst[2]),
        'ellipseMajor': parseNumber(gst[3]),
        'ellipseMinor': parseNumber(gst[4]),
        'ellipseOrientation': parseNumber(gst[5]),
        'latitudeError': parseNumber(gst[6]),
        'longitudeError': parseNumber(gst[7]),
        'heightError': parseNumber(gst[8])
      };
    },

    // add HDT
    'HDT': function(str, hdt) {

      if (hdt.length !== 4) {
        throw new Error('Invalid HDT length: ' + str);
      }

      /*
       ------------------------------------------------------------------------------
       1      2  3
       |      |  |
       $--HDT,hhh.hhh,T*XX<CR><LF>
       ------------------------------------------------------------------------------
       
       1. Heading in degrees
       2. T: indicates heading relative to True North
       3. Checksum
       */

      return {
        'heading': parseFloat(hdt[1]),
        'trueNorth': hdt[2] === 'T'
      };
    },

    'GRS': function(str, grs) {

      if (grs.length !== 18) {
        throw new Error('Invalid GRS length: ' + str);
      }

      var res = [];
      for (var i = 3; i <= 14; i++) {
        var tmp = parseNumber(grs[i]);
        if (tmp !== null)
          res.push(tmp);
      }

      return {
        'time': parseTime(grs[1]),
        'mode': parseNumber(grs[2]),
        'res': res
      };
    },
    'GBS': function(str, gbs) {

      if (gbs.length !== 10 && gbs.length !== 12) {
        throw new Error('Invalid GBS length: ' + str);
      }

      /*
       0      1   2   3   4   5   6   7   8
       |      |   |   |   |   |   |   |   |
       $--GBS,hhmmss.ss,x.x,x.x,x.x,x.x,x.x,x.x,x.x*hh<CR><LF>
       
       1. UTC time of the GGA or GNS fix associated with this sentence
       2. Expected error in latitude (meters)
       3. Expected error in longitude (meters)
       4. Expected error in altitude (meters)
       5. PRN (id) of most likely failed satellite
       6. Probability of missed detection for most likely failed satellite
       7. Estimate of bias in meters on most likely failed satellite
       8. Standard deviation of bias estimate
       --
       9. systemID (NMEA 4.10)
       10. signalID (NMEA 4.10)
       */

      return {
        'time': parseTime(gbs[1]),
        'errLat': parseNumber(gbs[2]),
        'errLon': parseNumber(gbs[3]),
        'errAlt': parseNumber(gbs[4]),
        'failedSat': parseNumber(gbs[5]),
        'probFailedSat': parseNumber(gbs[6]),
        'biasFailedSat': parseNumber(gbs[7]),
        'stdFailedSat': parseNumber(gbs[8]),
        'systemId': gbs.length === 12 ? parseNumber(gbs[9]) : null,
        'signalId': gbs.length === 12 ? parseNumber(gbs[10]) : null
      };
    },
    'GNS': function(str, gns) {

      if (gns.length !== 14 && gns.length !== 15) {
        throw new Error('Invalid GNS length: ' + str);
      }

      return {
        'time': parseTime(gns[1]),
        'lat': parseCoord(gns[2], gns[3]),
        'lon': parseCoord(gns[4], gns[5]),
        'mode': gns[6],
        'satsUsed': parseNumber(gns[7]),
        'hdop': parseNumber(gns[8]),
        'alt': parseNumber(gns[9]),
        'sep': parseNumber(gns[10]),
        'diffAge': parseNumber(gns[11]),
        'diffStation': parseNumber(gns[12]),
        'navStatus': gns.length === 15 ? gns[13] : null  // NMEA 4.10
      };
    }
  };

  GPS['Parse'] = function(line) {

    if (typeof line !== 'string')
      return false;

    var nmea = line.split(',');

    var last = nmea.pop();

    // HDT is 2 items length
    if (nmea.length < 2 || line.charAt(0) !== '$' || last.indexOf('*') === -1) {
      return false;
    }

    last = last.split('*');
    nmea.push(last[0]);
    nmea.push(last[1]);

    // Remove $ character and first two chars from the beginning
    nmea[0] = nmea[0].slice(3);

    if (GPS['mod'][nmea[0]] !== undefined) {
      // set raw data here as well?
      var data = this['mod'][nmea[0]](line, nmea);
      data['raw'] = line;
      data['valid'] = isValid(line, nmea[nmea.length - 1]);
      data['type'] = nmea[0];

      return data;
    }
    return false;
  };

  // Heading (N=0, E=90, S=189, W=270) from point 1 to point 2
  GPS['Heading'] = function(lat1, lon1, lat2, lon2) {

    var dlon = (lon2 - lon1) * D2R;

    lat1 = lat1 * D2R;
    lat2 = lat2 * D2R;

    var sdlon = Math.sin(dlon);
    var cdlon = Math.cos(dlon);

    var slat1 = Math.sin(lat1);
    var clat1 = Math.cos(lat1);

    var slat2 = Math.sin(lat2);
    var clat2 = Math.cos(lat2);

    var y = sdlon * clat2;
    var x = clat1 * slat2 - slat1 * clat2 * cdlon;

    var head = Math.atan2(y, x) * 180 / Math.PI;

    return (head + 360) % 360;
  };

  GPS['Distance'] = function(lat1, lon1, lat2, lon2) {

    // Haversine Formula
    // R.W. Sinnott, "Virtues of the Haversine", Sky and Telescope, vol. 68, no. 2, 1984, p. 159

    // Because Earth is no exact sphere, rounding errors may be up to 0.5%.
    // var RADIUS = 6371; // Earth radius average
    // var RADIUS = 6378.137; // Earth radius at equator
    var RADIUS = 6372.8; // Earth radius in km

    var hLat = (lat2 - lat1) * D2R * 0.5; // Half of lat difference
    var hLon = (lon2 - lon1) * D2R * 0.5; // Half of lon difference

    lat1 = lat1 * D2R;
    lat2 = lat2 * D2R;

    var shLat = Math.sin(hLat);
    var shLon = Math.sin(hLon);
    var clat1 = Math.cos(lat1);
    var clat2 = Math.cos(lat2);

    var tmp = shLat * shLat + clat1 * clat2 * shLon * shLon;

    //return RADIUS * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1.0 - a));
    return RADIUS * 2 * Math.asin(Math.sqrt(tmp));
  };

  GPS['TotalDistance'] = function(path) {

    if (path.length < 2)
      return 0;

    var len = 0;
    for (var i = 0; i < path.length - 1; i++) {
      var c = path[i];
      var n = path[i + 1];
      len += GPS['Distance'](c['lat'], c['lon'], n['lat'], n['lon']);
    }
    return len;
  };

  GPS.prototype['update'] = function(line) {

    var parsed = GPS['Parse'](line);

    this['state']['processed']++;

    if (parsed === false) {
      this['state']['errors']++;
      return false;
    }

    updateState(this['state'], parsed);

    this['emit']('data', parsed);
    this['emit'](parsed.type, parsed);

    return true;
  };

  GPS.prototype['partial'] = "";

  GPS.prototype['updatePartial'] = function(chunk) {

    this['partial'] += chunk;

    while (true) {

      var pos = this['partial'].indexOf("\r\n");

      if (pos === -1)
        break;

      var line = this['partial'].slice(0, pos);

      if (line.charAt(0) === '$') {
        try {
          this['update'](line);
        } catch (err) {
          this['partial'] = "";
          throw new Error(err);
        }
      }
      this['partial'] = this['partial'].slice(pos + 2);
    }
  };

  GPS.prototype['on'] = function(ev, cb) {

    if (this['events'][ev] === undefined) {
      this['events'][ev] = cb;
      return this;
    }
    return null;
  };

  GPS.prototype['off'] = function(ev) {

    if (this['events'][ev] !== undefined) {
      this['events'][ev] = undefined;
    }
    return this;
  };

  GPS.prototype['emit'] = function(ev, data) {
    if (this['events'][ev] !== undefined) {
      this['events'][ev].call(this, data);
    }
  };

  if (typeof exports === 'object') {
    Object.defineProperty(GPS, "__esModule", { 'value': true });
    GPS['default'] = GPS;
    GPS['GPS'] = GPS;
    module['exports'] = GPS;
  } else {
    root['GPS'] = GPS;
  }

})(this);