import { Repository } from 'typeorm';
import { Contact } from '../entity/Contact';
import { AppDataSource } from "../config/data-source";

export class ContactRepository {
    private repository: Repository<Contact>;

    constructor() {
        this.repository = AppDataSource.getRepository(Contact);
    }

    async findByEmailOrPhone(email: string | null, phoneNumber: string | null): Promise<Contact[]> {
        return this.repository.find({
            where: [
                { email },
                { phoneNumber }
            ]
        });
    }

    async findSecondaryContacts(linkedId: number): Promise<Contact[]> {
        return this.repository.find({
            where: { linkedId }
        });
    }

    async createContact(data: Partial<Contact>): Promise<Contact> {
        const contact = this.repository.create(data);
        return this.repository.save(contact);
    }

    async updateContact(contact: Contact): Promise<Contact> {
        return this.repository.save(contact);
    }
}
