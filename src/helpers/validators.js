import { allPass, compose, curry } from "ramda"

/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */
const countQuanityColors = ( targets, colors ) => {
    const solution = new Object(null)

    for ( const target of targets ) {
        solution[target] = 0
        for ( const color of colors ) {
            if ( target === color ) solution[target]++
        }
    }
    return solution
}
const verifyColors = ( rules, figures ) => {
    const rulesYesKeys = Object.keys(rules.yes)

    for ( const [key, value] of Object.entries(figures) ) {
        if ( rulesYesKeys.includes(key) ) {
            if ( !rules.yes[key].includes(value) ) return false
        }
        else if ( rules.no[key].includes(value) ) return false
    }
    return true
}
const allFigureHaveColor = (color, figures) => {
    const allFigures = curry(countQuanityColors)([color])

    return allFigures(figures)[color] === figures.length
}
// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = (figures) => {
    const redStarGreenSquareAndOtherWhite = curry(verifyColors)({
        yes: {
            star: ['red'],
            square: ['green'],
            triangle: ['white'],
            circle: ['white']
        }
    })

    return redStarGreenSquareAndOtherWhite(figures)
};

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = ({star, square, triangle, circle}) => {
    const countGreen = curry(countQuanityColors)(['green']),
     {green} = countGreen([star, square, triangle, circle])

    return green >= 2
}

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = ({star, square, triangle, circle}) => {
    const countRedAndBlue = curry(countQuanityColors)(['red', 'blue']),
     {red, blue} = countRedAndBlue([star, square, triangle, circle])

    return red === blue
}

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = ({star, square, circle}) => {
    const blueCircleRedStarOrangeSquare = curry(verifyColors)({
        yes: {
            circle: ['blue'],
            star: ['red'],
            square: ['orange']
        }
    })

    return blueCircleRedStarOrangeSquare({star, square, circle})
}

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = ({star, square, triangle, circle}) => {
    const countQuanityAllColors = curry(countQuanityColors)(['white', 'red', 'blue', 'green', 'orange']),
     figuresNotWhite = ({white}) => white < 2,
     threeFiguresOfTheSameColor = figures => Object.values(figures).includes(3) || Object.values(figures).includes(4),
     checkСonditions = quanityColors => figuresNotWhite(quanityColors) && threeFiguresOfTheSameColor(quanityColors)

    return compose(
        checkСonditions,
        countQuanityAllColors
    )([ star, square, triangle, circle ])
}

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = ({star, square, triangle, circle}) => {
    const triangleGreen = () => triangle === 'green',
     countRedAndGreen = curry(countQuanityColors)(['red', 'green']),
     checkСonditions = ({red, green}) => red === 1 && green === 2

    return allPass(
        [triangleGreen,
        checkСonditions]
    )(countRedAndGreen([star, square, triangle, circle]))
}

// 7. Все фигуры оранжевые.
export const validateFieldN7 = (figures) => {
    const allFigureHaveColorOrange = curry(allFigureHaveColor)('orange')

    return allFigureHaveColorOrange(Object.values(figures))
}

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = ({star}) => {
    const notRedAndNotWhiteStart = curry(verifyColors)({
        yes: {},
        no: {
            star: [ 'red', 'white' ]
        }
    })

    return notRedAndNotWhiteStart({star})
}

// 9. Все фигуры зеленые.
export const validateFieldN9 = figures => {
    const allFigureHaveColorGreen = curry(allFigureHaveColor)('green')

    return allFigureHaveColorGreen(Object.values(figures))
}

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = ({square, triangle}) => triangle === square && triangle !== 'white'