/**
 *
 */
class Parser {

    /**
     *
     * @param {Object} options
     */
    constructor(options) {
        this.verbose = false;
        if (options && options.verbose) {
            this.verbose = options.verbose;
        }
    }

    /**
     * Раскрыть скобки
     * @param {String} expr
     * @return {*}
     */
    openBrackets(expr) {
        while (true) {
            // iterate till openBrackets modifies expr
            this.verbose && console.log(`start reduce: ${expr}`);
            let groups = expr.match(/\(([0-9\.\+\-\*\/\s]+?\))/g);
            if (groups && groups.length) {
                this.verbose && console.log(`found groups: ${groups}`);
                groups.forEach((group) => {
                    const subexpr = group.substr(1, group.length - 2);
                    const result = this.calculate(subexpr);
                    expr = expr.replace(group, result);
                    this.verbose && console.log(`replace: ${expr}`);
                });
            } else {
                // no more groups in expr
                break;
            }
        }

        this.verbose && console.log(`brackets opened: ${expr}`);
        return expr;
    }

    _calculateGroup(groups, expr) {
        if (groups && groups.length) {
            groups.forEach((group) => {
                this.verbose && console.log(`group: ${group}`);
                const result = eval(group);
                this.verbose && console.log(`group eval: ${result}`);
                expr = expr.replace(group, result);
            });
        }
        return expr;
    }

    /**
     * Рассчитать арифметическое выражение: +,-,*,/
     * @param {String} expr
     * @return {number}
     */
    calculate(expr) {
        let groups;

        groups = expr.match(/([\d\.]+?\*[\d\.]+)/g);
        expr = this._calculateGroup(groups, expr);

        groups = expr.match(/([\d\.]+?\/[\d\.]+)/g);
        expr = this._calculateGroup(groups, expr);

        groups = expr.match(/([\d\.]+?\+[\d\.]+)/g);
        expr = this._calculateGroup(groups, expr);

        groups = expr.match(/([\d\.]+?\-[\d\.]+)/g);
        expr = this._calculateGroup(groups, expr);

        this.verbose && console.log(`calculated: ${expr}`);
        return expr;
    }

    /**
     *
     * @param {String} input
     * @returns {{value: number, details: string}}
     * @throws Error
     */
    parse(input) {
        const trimmed = input.trim();
        const regexp = /^([0-9\.\+\-\*\/\s\(\)]+)/;
        const result = regexp.exec(trimmed);
        this.verbose && console.log(`parsed: ${result[0]}`);

        if (result === null) {
            throw new Error('Не удалось обнаружить сумму покупки в строке: ' + input);
        }

        const expr = result[0].replace(/\s+/g, '');
        const reduced  = this.openBrackets(expr);
        const value = this.calculate(reduced);
        const details = trimmed.substr(expr.length).trim();
        return { raw: result[0], value, details };
    }
}

module.exports = Parser;

// node src/Parser.js
if (require.main == module) {

    const assert = require('assert');

    let i = 0;
    const provider = [
        [ '137*2', 274 ], [ '260-137', 123 ], [ '2+2*2', 6 ], [ '(100-50)*2', 100 ],
        [ '11*22/2-100.50', 20.5 ]
    ];

    const verbose = true;
    const parser = new Parser({ verbose });
    provider.forEach((prov) => {
        console.log(`${++i}. ${'-'.repeat(10)}`);
        const result = parser.parse(prov[0] + '');
        assert.equal(result['value'], prov[1]);

    });
}
