import { PATH_DB } from '../constants/contacts.js';
import fs from 'node:fs/promises';

export const thanos = async () => {
    let oldContacts = [];
    try { 
        oldContacts = JSON.parse(await fs.readFile(PATH_DB)); 
        if (oldContacts.length === 0) { 
            console.log('Немає контактів для видалення половини з них. Спочатку додайте хоча б два контакти!'); 
            return; 
        }
    } catch (error) { 
        console.log('Помилка зчитування існуючих контактів', error); 
    }
    
    try {
        const slicedContacts = oldContacts.slice(0, Math.round(oldContacts.length / 2));
        await fs.writeFile(PATH_DB, JSON.stringify(slicedContacts));
        console.log(`Видалено контактів: ${oldContacts.length - slicedContacts.length}`);
    } catch (error) { 
        console.log('Помилка видалення контактів', error); 
    } 
    let exsistingContacts = [];
    try {
        exsistingContacts = JSON.parse(await fs.readFile(PATH_DB));
        
     } catch (error) { console.log('Помилка зчитування існуючих контактів', error); }
   console.log( `Загальна кількість контактів: ${ exsistingContacts.length}`);

};

await thanos();
