import { PATH_DB} from '../constants/contacts.js';
import fs from 'node:fs/promises';
import { createFakeContact } from '../utils/createFakeContact.js';


const generateContacts = async (number) => {
    let oldContacts = [];
    try { oldContacts = JSON.parse(await fs.readFile(PATH_DB)); } catch (error) { console.log('Помилка зчитування існуючих контактів', error); }
    let newContacts=[];
    for (let i = 0; i < number; i += 1) {
         newContacts.push(createFakeContact());
    };
    let allContacts=oldContacts.concat(newContacts);
    try { await fs.writeFile(PATH_DB, JSON.stringify(allContacts)); console.log(`Додано контактів：${number} `); } catch (error) { console.log('Помилка запису контактів', error); }
        finally {
        console.log("Загальна кількість контактів:", allContacts.length);
    }
};

await generateContacts(3);
