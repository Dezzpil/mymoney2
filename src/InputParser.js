/**
 * @todo write documentation
 */
class InputParser {

    constructor(...options) {

    }

    /**
     * Рассчитать выражение типа x-y
     * @param {String} expression
     * @return {number}
     */
    calculate(expression) {
        return 0;
    }

    /**
     *
     * @param {String} input
     * @returns {{value: number, details: string}}
     * @throws Error
     */
    parse(input) {
        let trimmed = input.trim();
        let regexp = /^([0-9\.]+)/i;
        let result = regexp.exec(trimmed);

        if (result !== null) {
            return {
                value: parseFloat(result[0]),
                details: trimmed.substr(result[0].length).trim()
            }
        } else {
            throw new Error('Не удалось обнаружить сумму покупки в строке: ' + input);
        }
    }
}

module.exports = InputParser;