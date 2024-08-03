import type {Stage} from "@/types/Stage";

export type Interview = {
    id: string,
    company: string,
    vacancyLink: string,
    hrName: string,
    contactTelegram?: string,
    contactWhatsApp?: string,
    contactPhone?: string
    createdAt: Date,
    salaryFrom?: number,
    salaryTo?: number,
    stages?: Stage[],
    result?: 'Refusal' | 'Offer'
}