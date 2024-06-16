import { SORT_ORDER } from "../constants/index.js";
const parseSortOrder = (sortOrder) => { 
    const isKnownOrder = Object.values(SORT_ORDER).includes(sortOrder);
    if (isKnownOrder) 
        return sortOrder;
    return SORT_ORDER.ASC;
};
const parseSortBy = (sortBy) => {
    const keysOfContacts = [
        '_id',
        'name',
        'email',
        'phoneNumber',
        'contactType',
        'isFavourite',
    ];
    
    if (keysOfContacts.includes(sortBy)) return sortBy;
    return 'name';
     };
    
export const parseSortParams = (query) => {
    const { sortBy, sortOrder } = query;
    const parsedSortBy = parseSortBy(sortBy);
    const parsedSortOrder = parseSortOrder(sortOrder);
    console.log('parsedSortBy:',parsedSortBy);
    return { sortBy:parsedSortBy, sortOrder:parsedSortOrder, };
};