/* eslint-disable operator-linebreak */
/* eslint-disable lines-between-class-members */
/* eslint-disable nonblock-statement-body-position */
/* eslint-disable comma-dangle */
/* eslint-disable curly */
/* eslint-disable prefer-template */
/* eslint-disable object-shorthand */
/* eslint-disable prefer-const */
/* eslint-disable no-useless-constructor */
/* eslint-disable no-use-before-define */
/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
/* eslint-disable func-names */
/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */

/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
}
Rectangle.prototype.getArea = function () {
  return this.width * this.height;
};

/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}

/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  Object.setPrototypeOf(obj, proto);
  return obj;
}

/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class CssBuilder {
  constructor(value = '') {
    this.combineResult = '';
    if (value) {
      this.combineResult += value;
    }
    this.cssElement = '';
    this.cssId = '';
    this.cssClass = '';
    this.cssAttr = '';
    this.cssPseudoClass = '';
    this.cssPseudoElement = '';
    this.countElem = 0;
    this.countId = 0;
    this.countPseudoElem = 0;
    this.order = [];
  }

  element(value) {
    if (this.countElem === 1) {
      throw new Error(
        'Element, id and pseudo-element should not occur more then one time inside the selector'
      );
    }

    if (this.order.length === 0) {
      this.order.push(1);
    } else {
      throw new Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element'
      );
    }

    this.cssElement = value;
    this.countElem += 1;
    return this;
  }

  id(value) {
    if (this.countId === 1) {
      throw new Error(
        'Element, id and pseudo-element should not occur more then one time inside the selector'
      );
    }

    if (this.order.length === 0) {
      this.order.push(2);
    }
    if (this.order[this.order.length - 1] > 2) {
      throw new Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element'
      );
    } else {
      this.order.push(2);
    }

    this.cssId = `#${value}`;
    this.countId += 1;
    return this;
  }

  class(value) {
    if (this.order.length === 0) {
      this.order.push(3);
    }
    if (this.order[this.order.length - 1] > 3) {
      throw new Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element'
      );
    } else {
      this.order.push(3);
    }

    this.cssClass += `.${value}`;
    return this;
  }

  attr(value) {
    if (this.order.length === 0) {
      this.order.push(4);
    }
    if (this.order[this.order.length - 1] > 4) {
      throw new Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element'
      );
    } else {
      this.order.push(4);
    }

    this.cssAttr = `[${value}]`;
    return this;
  }

  pseudoClass(value) {
    if (this.order.length === 0) {
      this.order.push(5);
    }
    if (this.order[this.order.length - 1] > 5) {
      throw new Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element'
      );
    } else {
      this.order.push(5);
    }
    this.cssPseudoClass += `:${value}`;
    return this;
  }

  pseudoElement(value) {
    if (this.countPseudoElem === 1) {
      throw new Error(
        'Element, id and pseudo-element should not occur more then one time inside the selector'
      );
    }

    if (this.order.length === 0) {
      this.order.push(6);
    }

    this.cssPseudoElement = `::${value}`;
    this.countPseudoElem += 1;
    return this;
  }

  stringify() {
    const result = `${this.cssElement}${this.cssId}${this.cssClass}${this.cssAttr}${this.cssPseudoClass}${this.cssPseudoElement}${this.combineResult}`;
    return result;
  }
}

const cssSelectorBuilder = {
  element(value) {
    const tmp = new CssBuilder();
    tmp.element(value);
    return tmp;
  },

  id(value) {
    const tmp = new CssBuilder();
    tmp.id(value);
    return tmp;
  },

  class(value) {
    const tmp = new CssBuilder();
    tmp.class(value);
    return tmp;
  },

  attr(value) {
    const tmp = new CssBuilder();
    tmp.attr(value);
    return tmp;
  },

  pseudoClass(value) {
    const tmp = new CssBuilder();
    tmp.pseudoClass(value);
    return tmp;
  },

  pseudoElement(value) {
    const tmp = new CssBuilder();
    tmp.pseudoElement(value);
    return tmp;
  },

  stringify() {
    const tmp = new CssBuilder();
    return tmp;
  },

  combine(selector1, combinator, selector2) {
    const result = new CssBuilder(
      `${selector1.stringify()} ${combinator} ${selector2.stringify()}`
    );
    return result;
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
