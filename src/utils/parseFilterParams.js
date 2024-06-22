

const parseContactType = (type) => { 
    const isString = typeof type === 'string';
    if (!isString) return undefined;
    const isContactType = Object.values(['work', 'home', 'personal']).includes(type);
    if (!isContactType) return undefined;
    return type;
};
const parseIsFavourite = (value) => {
    if (value === 'true') {
        return true;
    } else if (value === 'false') {
        return false;
    } else if (typeof value === 'boolean') {
        return value;
    } else {
        console.warn('Некоректний тип данных для isFavourite:', typeof value);
        return undefined;
    }
};
 
export const parseFilterParams = (query) => { 
    const { type, isFavourite } = query;
    // console.log('isFavourite в утилитах:', isFavourite);
    const parsedContactType = parseContactType(type);
    const parsedIsFavourite = parseIsFavourite(isFavourite);
    // console.log('parsedIsFavourite:',parsedIsFavourite);
    return {contactType:parsedContactType, isFavourite:parsedIsFavourite };  
};
// const test = true;
// const testResult = parseIsFavourite(test);
// console.log('testResult:',testResult);