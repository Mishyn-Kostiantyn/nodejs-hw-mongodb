import { PATH_DB } from '../constants/contacts.js';
import fs from 'node:fs/promises';


export const removeAllContacts = async () => {
    try {
        await fs.writeFile(PATH_DB, '[]');
      
        console.log('Контакти видалено!');
    } catch (error) { console.log('Помилка видалення контактів', error); }
    
};

await removeAllContacts();
