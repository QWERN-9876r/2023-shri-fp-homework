/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import { allPass, compose } from 'ramda';
import Api from '../tools/api';

const api = new Api();

const converteToBinaryNumberSystem = number => new Promise((res) => {
    api.get('https://api.tech/numbers/base', {from: 10, to: 2, number})
    .then(res)
    .catch(() => res(converteToBinaryNumberSystem(number)))
}),
 getAnimal = id => new Promise((res) => {
    api.get(`https://animals.tech/${id}`, {})
    .then(res)
    .catch(() => res(getAnimal(id)))
}),
 isValid = n => {
    const validLength = n => n.length > 2 && n.length < 10,
     validNumber = n => !isNaN(Number(n)) && Number(n) >= 0
    return allPass([
        validLength,
        validNumber
    ])(n)
}

const processSequence = async ({value, writeLog, handleSuccess, handleError}) => {
    if ( !isValid(value) ) return handleError('ValidationError')

        writeLog(Math.round(Number(value)))
        const binaryValue = (await converteToBinaryNumberSystem(value)).result

        writeLog(binaryValue)
        writeLog(binaryValue.length)
    compose(
        writeLog,
        Math.sqrt,
        Number
    )(binaryValue)
    writeLog(value % 3)
    handleSuccess((await getAnimal(value % 3)).result)
}

export default processSequence;
