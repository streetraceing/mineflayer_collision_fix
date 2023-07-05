## Исправление коллизии игроков для Mineflayer

### Описание

Более хороший вариант для фикса коллизии **(толкания ботов)** на библиотеку Mineflayer. 
Работает **стабильно**, **гибко настраивается**, но лучше ничего не изменять, так как мои значения более правдивые к настоящей коллизии.

### Видеоролик
[![Видео не удалось загрузить :(](https://i.ytimg.com/vi/su7cRxITYMI/hqdefault.jpg?sqp=-oaymwE9CPYBEIoBSFryq4qpAy8IARUAAAAAGAElAADIQj0AgKJDeAHwAQH4Af4JgALQBYoCDAgAEAEYLiBlKBgwDw==&rs=AOn4CLDUj-vspsRO6V6eB0-yNe53prsv4g)](https://www.youtube.com/watch?v=su7cRxITYMI&t=15s)

### Информация по значениям

```js
if(x < 0.3 && xz < 0.8 || z < 0.3 && xz < 0.8) { // Расстояние, с которого действует коллизия
```
Хоть это и написано тут, но более подробно:
**XZ** - сумма модулей расстояний, если мы будем делать условие только x < 0.3 или z < 0.3, то это будет работать довольно кривовато (если мы будем от бота стоять далеко по X, и близко по Z, то это будет считаться в условие и правило коллизии будет совершаться, что не должно быть так.
Вообщем, лучше его вообще не трогать, однако можно попробывать сделать его меньше.

**X** - при каком растоянии X будет действовать толкание ботов

**Z** - то же самое, что и X, только Z (при каком растоянии Z будет действовать толкание ботов)

____

```js
let RX = x*0.1 ; let RZ = z*0.1
```
**RX** - это значение, на которое бот передвинется при толкании со стороны X. Изменять его можно, меня коэффицент 0.1, чем он больше - чем дальше бот толкается, а чем меньше - тем короче.

**RZ** - то же самое, что и RX, только со стороны Z.

### Основной код
```js
const mineflayer = require("mineflayer")

function BotInit(username, host, port, version) {
    const bot = mineflayer.createBot({
        username: username ?? 'bot',
        host: host ?? 'localhost',
        port: port ?? 25565,
        version: version ?? '1.16.5',  
        hideErrors: true // Скрываем разные ошибки, засоряющие консоль (если необходимо)
    })
    return bot
}

const bot = BotInit('bot', 'localhost')

function MoveBot(x, y, z) {
    bot.entity.position.translate(x,y,z) // Передвижение бота на нужное количество блоков
}

function CollisionRule(xz, x, z) {
    if(x < 0.3 && xz < 0.8 || z < 0.3 && xz < 0.8) { // Расстояние, с которого действует коллизия
    let RX = x*0.1 ; let RZ = z*0.1 // Умножение на конкретное число, меняет модификатор,
                                    // на сколько толкается бот.
    MoveBot(RX, 0, RZ) // Изменение позиции бота
    // return [RX, RZ] // Если необходимо (дебаг, на сколько блоков сдвигается бот)
    }
}

function MathCoords(p1,p2) {
    var X = p1.x - p2.x ; var Z = p1.z - p2.z // Простое расстояние
    var AbsX = Math.abs(X) ; var AbsZ = Math.abs(Z) // Модуль расстояние
    var XZ = AbsX + AbsZ // Суммы модулей расстояний
    return [XZ, AbsX, AbsZ, X, Z]
}

bot.on('physicTick', () => { // Мы ставим physicTick, потому что entityMoved сильно нагружает бота, когда рядом много игроков
    const entity =  bot.nearestEntity(entity => entity.name === "player") // Ищем ближайшего игрока к боту
    if(!entity) { return } // Если энтити не найден, то отменяем
    let distance = MathCoords(bot.entity.position, entity.position) // Считаем расстояние между ботом и другим игроком
    let collision = CollisionRule(distance[0], distance[3], distance[4]) // Вызываем правило коллизии, которое и двигает бота
    //                              | XZ |       | X |         | Z |
})
```
