

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
       
        return undefined;
    }
};
 
export const parseFilterParams = (query) => { 
    const { type, isFavourite } = query;
   
    const parsedContactType = parseContactType(type);
    const parsedIsFavourite = parseIsFavourite(isFavourite);

    return {contactType:parsedContactType, isFavourite:parsedIsFavourite };  
};
