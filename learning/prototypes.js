{
    // Короткое свойство
    let width = 100;
    let height = 200;

    let props = {
        width, height
    };

    console.log(props.width, props.height);
}

{
    // Вычисляемые свойства
    let key = "name";
    let props = {
        [key.toUpperCase()]: "value"
    };
    console.log(props);
}

{
    // Мердж объектов
    // Object.assign
    let user = { name: "Вася" };
    let visitor = { isAdmin: false, visits: true };
    let admin = { isAdmin: true };

    Object.assign(user, visitor, admin);

    console.log(user);

    // Его также можно использовать для 1-уровневого клонирования объекта:
    let clone = Object.assign({}, user);
    clone.name = "Никита";
    console.log(clone);
}

{
    // Метод объекта + super

    let animal = {
        // оформление метода объекта
        // (это не свойство-функция, в которой нет [[HomeObject]]!)
        walk() {
            return "I'm walking";
        }
    };

    let rabbit = {
        __proto__: animal,
        walk() {
            return super.walk() + " and jumping";
        }
    };

    console.log('animal', animal.walk());
    console.log('rabbit', rabbit.walk());

    let fox = {};
    Object.setPrototypeOf(fox, animal);
    console.log('fox', fox.walk());
}