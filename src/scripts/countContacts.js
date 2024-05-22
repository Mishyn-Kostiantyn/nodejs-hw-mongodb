import { PATH_DB } from '../constants/contacts.js';
import fs from 'node:fs/promises';

export const countContacts = async () => { let exsistingContacts = [];
    try {
        exsistingContacts = JSON.parse(await fs.readFile(PATH_DB));
        
     } catch (error) { console.log('Помилка зчитування існуючих контактів', error); }
   return `Загальна кількість контактів: ${ exsistingContacts.length}`;};

console.log(await countContacts());
