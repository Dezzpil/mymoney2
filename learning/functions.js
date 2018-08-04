
// При передаче любого значения, кроме undefined, включая пустую строку, ноль или null, параметр считается переданным,
// и значение по умолчанию не используется.

function sayHi(who = getCurrentUser().toUpperCase()) {
    console.log('Hello, ' + who);
}

function getCurrentUser() {
    return 'Nikita';
}

sayHi();
sayHi('Dezz');

function sayHiToAll(...people) {
    if (people.length) {
        for (let i = 0; i < people.length; i++) {
            sayHi(people[i]);
        }
    }
}

sayHiToAll("Nikita", "Anrey", "Anton", "Polina");
sayHiToAll("Moisey");

// оператор spread (...) очень удобен!
let people = ["Sergey", "David", "Alexandr"];
sayHiToAll(...people);

// Формально говоря, эти два вызова делают одно и то же:
// Math.max(...numbers);
// Math.max.apply(Math, numbers);
// Похоже, что первый – короче и красивее.


function showMenu({title="Заголовок", width:w=100, height:h=200} = {}) {
    console.log(title + ' ' + w + ' ' + h);
}

showMenu(); // Заголовок 100 200
showMenu({width: 500});