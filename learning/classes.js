'use strict';

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

let parser = new InputParser();


try {
    parser.parse("a joke 300.5");
} catch (e) {
    console.log('Ошибка формата строки');
}

let purchase = parser.parse("125 винстон");
console.log(purchase);


// Class Expression - это УЖАС
// http://learn.javascript.ru/es-class
// объявления класса инлайн - это извращение

// В ES-2015 появились новые типы коллекций в JavaScript: Set, Map, WeakSet и WeakMap.