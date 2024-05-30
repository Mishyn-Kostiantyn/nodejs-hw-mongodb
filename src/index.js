import { setupServer } from "./server.js";
import { initMongoConnection } from "./db/initMongoConnection.js";
import { Contacts } from "./db/models/contact.js";
const bootstrap = async () => {
    await initMongoConnection();
    const contacts = await Contacts.find();
    console.log("Contacts fetched from database:", contacts);
    setupServer();
};

bootstrap();
