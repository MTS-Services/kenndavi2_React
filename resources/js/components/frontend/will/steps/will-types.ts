export type MaritalStatus = 'single' | 'married' | 'civil-partner' | '';

export interface PersonalInfo {
    title: string;
    firstName: string;
    middleName: string;
    lastName: string;
    dateOfBirth: string;
    maritalStatus: MaritalStatus;
    address: string;
    city: string;
    postcode: string;
    country: string;
}

export interface Beneficiary {
    id: string;
    type: 'person' | 'charity';
    title?: string;
    firstName?: string;
    lastName?: string;
    relationship?: string;
    charityName?: string;
    charityNumber?: string;
    percentage?: number;
    specificGift?: string;
    city?: string;
    country?: string;
    allowAlternate?: boolean;
    alternateName?: string;
    alternateCity?: string;
    alternateCountry?: string;
}

export interface Executor {
    id: string;
    title: string;
    firstName: string;
    lastName: string;
    relationship: string;
    address: string;
    dateOfBirth: string;
    city: string;
    country: string;
}

export interface Child {
    id: string;
    fullName: string;
    isMinor: boolean;
}

export interface Guardian {
    id: string;
    fullName: string;
    city: string;
    country: string;
}

export interface SpecificGift {
    id: string;
    giftType: 'individual' | 'charity';
    description: string;
    recipientName: string;
    city: string;
    country: string;
    allowAlternate: boolean;
    alternateRecipientName: string;
    alternateCity: string;
    alternateCountry: string;
}

export interface Pet {
    id: string;
    name: string;
    description: string;
    fundAmount: string;
    executorAppointCaretaker: boolean;
}

export interface AdditionalClause {
    id: string;
    text: string;
}

export interface WillData {
    personalInfo: PersonalInfo;
    spouse: {
        fullName: string;
        executorId: string | null;
    };
    spouseIsExecutor: boolean;
    hasPets: boolean;
    pets: Pet[];
    wantsAdditionalClauses: boolean;
    additionalClauses: AdditionalClause[];
    hasChildren: boolean;
    children: Child[];
    wantsGuardian: boolean;
    guardians: Guardian[];
    wantsDelayInheritance: boolean;
    inheritanceAge: string;
    wantsSpecificGifts: boolean;
    executors: Executor[];
    wantsAlternateExecutor: boolean;
    alternateExecutors: Executor[];
    beneficiaries: Beneficiary[];
    totalFailureStrategy: 'family' | 'alternate';
    totalFailureBeneficiaries: Beneficiary[];
    distributionType: 'percentage' | 'specific' | 'residuary';
    specificGifts: SpecificGift[];
    signingTimeline: 'today' | 'this-month' | 'unsure' | 'specific-date';
    signingDate: string;
    signingCity: string;
    signingCountry: string;
}
