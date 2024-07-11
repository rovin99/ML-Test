
import { Contact } from '../entity/Contact';
import { ContactRepository } from '../repositories/contactRepository';

export class IdentifyService {
    private contactRepository: ContactRepository;

    constructor() {
        this.contactRepository = new ContactRepository();
    }

    async identifyContact(email: string | null, phoneNumber: string | null) {
        let primaryContact: Contact | null = null;
        let secondaryContacts: Contact[] = [];

        // Find existing contacts
        const existingContacts = await this.contactRepository.findByEmailOrPhone(email, phoneNumber);

        if (existingContacts.length === 0) {
            // Create new primary contact
            primaryContact = await this.createPrimaryContact(email, phoneNumber);
        } else {
            // Find or create primary contact
            primaryContact = existingContacts.find(c => c.linkPrecedence === "primary") || existingContacts[0];

            // Create secondary contact if new information is provided
            if ((email && email !== primaryContact.email) || (phoneNumber && phoneNumber !== primaryContact.phoneNumber)) {
                await this.createSecondaryContact(email, phoneNumber, primaryContact.id);
            }

            // Update existing contacts
            await this.updateExistingContacts(existingContacts, primaryContact.id);

            // Get all secondary contacts
            secondaryContacts = await this.contactRepository.findSecondaryContacts(primaryContact.id);
        }

        // Prepare response
        const emails = [primaryContact.email, ...secondaryContacts.map(c => c.email)].filter((v, i, a) => v && a.indexOf(v) === i);
        const phoneNumbers = [primaryContact.phoneNumber, ...secondaryContacts.map(c => c.phoneNumber)].filter((v, i, a) => v && a.indexOf(v) === i);

        return {
            primaryContactId: primaryContact.id,
            emails,
            phoneNumbers,
            secondaryContactIds: secondaryContacts.map(c => c.id)
        };
    }

    private async createPrimaryContact(email: string | null, phoneNumber: string | null) {
        return this.contactRepository.createContact({
            email,
            phoneNumber,
            linkPrecedence: "primary"
        });
    }

    private async createSecondaryContact(email: string | null, phoneNumber: string | null, linkedId: number) {
        return this.contactRepository.createContact({
            email,
            phoneNumber,
            linkedId,
            linkPrecedence: "secondary"
        });
    }

    private async updateExistingContacts(contacts: Contact[], primaryId: number) {
        for (const contact of contacts) {
            if (contact.id !== primaryId && contact.linkPrecedence !== "secondary") {
                contact.linkedId = primaryId;
                contact.linkPrecedence = "secondary";
                await this.contactRepository.updateContact(contact);
            }
        }
    }
}