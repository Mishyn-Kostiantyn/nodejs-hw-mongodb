import { PATH_DB } from '../constants/contacts.js';
import fs from 'node:fs/promises';

export const getAllContacts = async () => {     let exsistingContacts = [];
    try {
        exsistingContacts = JSON.parse(await fs.readFile(PATH_DB));
        if (exsistingContacts.length === 0) { console.log('Немає контактів для відображення!'); return; } 
        
     } catch (error) { console.log('Помилка зчитування існуючих контактів', error); }
   return exsistingContacts;};


console.log(await getAllContacts());
