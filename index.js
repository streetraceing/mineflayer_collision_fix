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
