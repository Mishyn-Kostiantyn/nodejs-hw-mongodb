import { PATH_DB } from '../constants/contacts.js';
import fs from 'node:fs/promises';
import { createFakeContact } from '../utils/createFakeContact.js';

export const addOneContact = async () => {
      let oldContacts = [];
    try {
        oldContacts = JSON.parse(await fs.readFile(PATH_DB));
        
     } catch (error) { console.log('Помилка зчитування існуючих контактів', error); }
    let newContact=createFakeContact();
   
    let allContacts =oldContacts.concat(newContact);
  
    try { await fs.writeFile(PATH_DB, JSON.stringify(allContacts)); console.log('Один контакт додано!'); } catch (error) { console.log('Помилка запису контактів', error); }
              finally {
        console.log("Загальна кількість контактів:", allContacts.length);
    }
};

await addOneContact();
