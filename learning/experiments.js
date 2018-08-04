'use strict';

let a = 'Hello, let!';
console.log(a);

function makeArmy() {

    let shooters = [];

    for (let i = 0; i < 10; i++) {
        shooters.push(function() {
            console.log(i);
        });
    }

    return shooters;
}

var army = makeArmy();

army[0]();
army[3]();
army[7]();

// Деструктуризация
// destructuring assignment
// это особоый синтаксис присваивания, при котором можно присвоить массив
// или объект сразу нескольким переменным, разбив его на части

let [hello, world, word] = "Hello world desctructuring!".split(" ");
console.log(hello + ", " + word);

// spread - ...

let [last, ...rest1] = [1, 2, 3, 4];
console.log(rest1);

// by default

let [one = "One", two = "Two", ...rest] = [];
console.log(one, two, rest);

// object destructuration

let options = {
    title: "Menu",
    width: 100,
    height: 200
};
let {prop1:propA = "A", prop2:propB = "B", ...restO} = options;
console.log(propA, propB, restO);

// let {prop : varName = default, ...} = object
// Здесь двоеточие : задаёт отображение свойства prop в переменную varName, а равенство =default задаёт выражение,
// которое будет использовано, если значение отсутствует (не указано или undefined).

// Для массивов имеет значение порядок, поэтому нельзя использовать :, но значение по умолчанию – можно

