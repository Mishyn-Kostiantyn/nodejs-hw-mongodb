

const parseContactType = (contactType) => { 
    const isString = typeof contactType === 'string';
    if (!isString) return undefined;
    const isContactType = Object.values(['work', 'home', 'personal']).includes(contactType);
    if (!isContactType) return undefined;
    return contactType;
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
    const { contactType, isFavourite } = query;
    // console.log('isFavourite в утилитах:', isFavourite);
    const parsedContactType = parseContactType(contactType);
    const parsedIsFavourite = parseIsFavourite(isFavourite);
    // console.log('parsedIsFavourite:',parsedIsFavourite);
    return {contactType:parsedContactType, isFavourite:parsedIsFavourite };  
};
// const test = true;
// const testResult = parseIsFavourite(test);
// console.log('testResult:',testResult);