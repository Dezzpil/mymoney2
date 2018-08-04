/**
 *
 */
class InputParser {

    constructor(...options) {

    }

    render(input) {
        console.log(input);
    }

    /**
     *
     * @param input
     * @returns {{value: number, details: string}}
     * @throws Error
     */
    parse(input) {
        let regexp = /^([0-9\.]+)/i;
        let result = regexp.exec(input);

        if (result !== null) {
            return {
                value: parseFloat(result[0]),
                details: input.substr(result[0].length).trim()
            }
        } else {
            throw new Error('Не удалось обнаружить сумму покупки в строке: ' + input);
        }
    }
}

module.exports = InputParser;