/**
 * @todo write documentation
 */
class Parser {

    constructor(...options) {

    }

    /**
     * Раскрыть скобки
     * @param expr
     * @return {*}
     */
    openBrackets(expr) {
        while (true) {
            // iterate till openBrackets modifies expr
            console.log(`start reduce: ${expr}`);
            let groups = expr.match(/\(([0-9\.\+\-\*\/\s]+?\))/g);
            if (groups && groups.length) {
                console.log(`found groups: ${groups}`);
                groups.forEach((group) => {
                    const subexpr = group.substr(1, group.length - 2);
                    const result = this.calculate(subexpr);
                    expr = expr.replace(group, result);
                    console.log(`replace: ${expr}`);
                });
            } else {
                // no more groups in expr
                break;
            }
        }

        console.log(`brackets opened: ${expr}`);
        return expr;
    }

    /**
     * Рассчитать арифметическое выражение: +,-,*,/
     * @param {String} expr
     * @return {number}
     */
    calculate(expr) {
        let groups = null;

        groups = expr.match(/([\d\.](?:\*|\/)[\d\.])/g);
        if (groups && groups.length) {
            groups.forEach((group) => {
                const result = eval(group);
                expr = expr.replace(group, result);
            });
        }

        groups = expr.match(/([\d\.](?:\+|\-)[\d\.])/g);
        if (groups && groups.length) {
            groups.forEach((group) => {
                const result = eval(group);
                expr = expr.replace(group, result);
            });
        }

        console.log(`calculated: ${expr}`);
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
        console.log(result);

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
