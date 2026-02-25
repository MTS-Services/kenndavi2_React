import { jsPDF } from 'jspdf';
import type { AdditionalClause, Beneficiary, Executor, Guardian, Pet, SpecificGift, WillData } from './steps/will-types';

const MARGIN_X = 56;
const MARGIN_Y = 64;
const LINE_HEIGHT = 16;

const buildName = (parts: Array<string | undefined>): string =>
    parts
        .map((part) => part?.trim())
        .filter((part): part is string => Boolean(part?.length))
        .join(' ')
        .trim();

const getTestatorName = (data: WillData): string =>
    buildName([data.personalInfo.title, data.personalInfo.firstName, data.personalInfo.middleName, data.personalInfo.lastName]) || '________________';

const formatDate = (value: string): string => {
    if (!value) {
        return '__________';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

const describeExecutors = (executors: Executor[], spouseName: string, spouseIsExecutor: boolean): string => {
    if (executors.length === 0) {
        return 'I have not yet appointed an Executor for this Will and reserve the right to do so by future amendment.';
    }

    const formattedExecutors = executors
        .map((executor, index) => {
            const name = buildName([executor.title, executor.firstName, executor.lastName]) || 'Unnamed Executor';
            const relationship = executor.relationship ? ` (${executor.relationship})` : '';

            return `${index + 1}. ${name}${relationship}`;
        })
        .join('; ');

    if (spouseIsExecutor && spouseName.trim()) {
        return `I appoint my ${spouseName} as my primary Executor. Should they be unable or unwilling to act, the following Executors shall serve: ${formattedExecutors}.`;
    }

    if (executors.length === 1) {
        return `I appoint ${formattedExecutors} as the sole Executor of this Will.`;
    }

    return `I appoint the following individuals to serve jointly as Executors of this Will: ${formattedExecutors}.`;
};

const describeBeneficiaries = (beneficiaries: Beneficiary[]): string => {
    if (beneficiaries.length === 0) {
        return 'To receive any gift under this Will a beneficiary must survive me for at least thirty (30) full days. I have not yet designated specific beneficiaries for my residuary estate.';
    }

    const summary = beneficiaries
        .map((beneficiary, index) => {
            if (beneficiary.type === 'charity') {
                return `${index + 1}. ${beneficiary.charityName || 'Unnamed Charity'}${beneficiary.percentage ? ` — ${beneficiary.percentage}%` : ''}`;
            }

            const name = buildName([beneficiary.title, beneficiary.firstName, beneficiary.lastName]) || 'Unnamed Beneficiary';
            return `${index + 1}. ${name}${beneficiary.relationship ? ` (${beneficiary.relationship})` : ''}${beneficiary.percentage ? ` — ${beneficiary.percentage}%` : ''}`;
        })
        .join(' ');

    return `To receive any gift under this Will a beneficiary must survive me for at least thirty (30) full days. My designated beneficiaries are: ${summary}`;
};

const describeAlternatePlan = (strategy: WillData['totalFailureStrategy'], alternates: Beneficiary[], partnerLabel: string): string => {
    if (strategy === 'alternate' && alternates.length > 0) {
        const alternateSummary = alternates
            .map((beneficiary, index) => {
                const name = beneficiary.type === 'charity'
                    ? beneficiary.charityName || 'Unnamed Charity'
                    : buildName([beneficiary.firstName, beneficiary.lastName]) || 'Unnamed Individual';

                return `${index + 1}. ${name}`;
            })
            .join('; ');

        return `Should all of my primary beneficiaries predecease me or fail to survive for thirty (30) full days, I direct that my estate residue be divided equally among the following alternate beneficiaries: ${alternateSummary}.`;
    }

    return `Should any wipeout event occur whereby my primary beneficiaries predecease me or fail to survive for thirty (30) full days, I direct that my estate residue be divided equally between my parents and siblings, and my ${partnerLabel}'s parents and siblings, for their own use absolutely, to the extent they are then living.`;
};

const encodeSpecificGifts = (gifts: SpecificGift[]): string[] => {
    if (!gifts.length) {
        return ['No specific gifts have been recorded.'];
    }

    return gifts.map((gift, index) => {
        const recipient = gift.recipientName || 'Unnamed Recipient';
        const description = gift.description || 'No description provided';
        const location = buildName([gift.city, gift.country]) || 'Location not provided';
        return `${index + 1}. ${description} to ${recipient} (${location}).`;
    });
};

const encodeChildren = (children: WillData['children']): string => {
    if (!children.length) {
        return 'I do not have any living children.';
    }

    const names = children.map((child) => `${child.fullName}${child.isMinor ? ' (minor)' : ''}`).join('; ');
    return `I have the following children: ${names}.`;
};

const encodeGuardians = (guardians: Guardian[]): string[] => {
    if (!guardians.length) {
        return ['No guardians have been nominated at this time.'];
    }

    return guardians.map((guardian, index) => `${index + 1}. ${guardian.fullName || 'Unnamed Guardian'} — ${buildName([guardian.city, guardian.country]) || 'Location not provided'}`);
};

const encodePets = (pets: Pet[]): string[] => {
    if (!pets.length) {
        return ['No pets have been referenced for ongoing care.'];
    }

    return pets.map((pet, index) => `${index + 1}. ${pet.name || 'Unnamed Pet'} — ${pet.description || 'No description provided'}${pet.fundAmount ? ` (Fund: ${pet.fundAmount})` : ''}`);
};

const encodeClauses = (clauses: AdditionalClause[]): string[] => {
    if (!clauses.length) {
        return ['No additional clauses have been supplied.'];
    }

    return clauses.map((clause, index) => `${index + 1}. ${clause.text || 'Clause text pending.'}`);
};

const addWatermark = (doc: jsPDF): void => {
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        const width = doc.internal.pageSize.getWidth();
        const height = doc.internal.pageSize.getHeight();
        doc.setFont('Times', 'Bold');
        doc.setFontSize(110);
        doc.setTextColor(230, 230, 230);
        doc.text('DRAFT', width / 2, height / 2, { align: 'center', angle: 45 });
    }
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(12);
};

interface GenerateWillPdfOptions {
    preview?: boolean;
}

export const generateWillPdf = (data: WillData, options: GenerateWillPdfOptions = {}): void => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let cursorY = MARGIN_Y;
    let clauseCounter = 1;

    const drawDraftWatermark = (): void => {
        const width = doc.internal.pageSize.getWidth();
        const height = doc.internal.pageSize.getHeight();
        doc.setFont('Times', 'Bold');
        doc.setFontSize(110);
        doc.setTextColor(230, 230, 230);
        doc.text('DRAFT', width / 2, height / 2, { align: 'center', angle: 45 });
        doc.setTextColor(30, 30, 30);
        doc.setFontSize(12);
    };

    drawDraftWatermark();

    const ensureSpace = (extra = 0): void => {
        if (cursorY + extra > pageHeight - MARGIN_Y) {
            doc.addPage();
            drawDraftWatermark();
            cursorY = MARGIN_Y;
        }
    };

    const addHeading = (text: string, options: { size?: number; uppercase?: boolean } = {}): void => {
        ensureSpace(30);
        doc.setFont('Times', 'Bold');
        doc.setFontSize(options.size ?? 14);
        const content = options.uppercase ? text.toUpperCase() : text;
        doc.text(content, pageWidth / 2, cursorY, { align: 'center' });
        cursorY += 28;
        doc.setFont('Times', 'Normal');
        doc.setFontSize(12);
    };

    const addSubheading = (text: string): void => {
        ensureSpace(24);
        doc.setFont('Times', 'Bold');
        doc.text(text.toUpperCase(), MARGIN_X, cursorY);
        cursorY += 18;
        doc.setFont('Times', 'Normal');
    };

    const addParagraph = (text: string, options: { numbered?: boolean; prefix?: string; italic?: boolean; indent?: number } = {}): void => {
        if (!text) {
            return;
        }

        ensureSpace(20);
        const indent = options.indent ?? 0;
        const availableWidth = pageWidth - MARGIN_X * 2 - indent;
        const prefix = options.numbered ? `${clauseCounter++}. ` : options.prefix ?? '';
        const lines = doc.splitTextToSize(`${prefix}${text}`, availableWidth);
        doc.setFont('Times', options.italic ? 'Italic' : 'Normal');
        lines.forEach((line: string) => {
            doc.text(line, MARGIN_X + indent, cursorY);
            cursorY += LINE_HEIGHT;
            ensureSpace();
        });
        cursorY += 4;
        doc.setFont('Times', 'Normal');
    };

    const addSubClause = (label: string, text: string): void => {
        ensureSpace(20);
        const lines = doc.splitTextToSize(`${label}. ${text}`, pageWidth - MARGIN_X * 2 - 20);
        lines.forEach((line: string) => {
            doc.text(line, MARGIN_X + 20, cursorY);
            cursorY += LINE_HEIGHT;
            ensureSpace();
        });
        cursorY += 4;
    };

    const addList = (items: string[], title: string): void => {
        addSubheading(title);
        items.forEach((item) => {
            const lines = doc.splitTextToSize(`• ${item}`, pageWidth - MARGIN_X * 2);
            lines.forEach((line: string) => {
                doc.text(line, MARGIN_X, cursorY);
                cursorY += LINE_HEIGHT;
                ensureSpace();
            });
            cursorY += 2;
        });
        cursorY += 6;
    };

    const addWitnessTable = (): void => {
        addSubheading('Witnesses');
        const labels = ['Signature', 'Name', 'Address', 'City/Town', 'Postcode'];
        labels.forEach((label) => {
            const line = `${label}  ____________________          ${label}  ____________________`;
            doc.text(line, MARGIN_X, cursorY);
            cursorY += LINE_HEIGHT + 2;
            ensureSpace();
        });
    };

    const partnerLabel = data.personalInfo.maritalStatus === 'civil-partner' ? 'civil partner' : 'spouse';
    const testatorName = getTestatorName(data);
    const spouseName = data.spouse.fullName || '________________';
    const addressLine = buildName([data.personalInfo.address, data.personalInfo.city, data.personalInfo.postcode, data.personalInfo.country]) || '________________';
    const signingCity = data.signingCity || '__________';
    const signingDate = formatDate(data.signingDate);

    addHeading(`Last Will and Testament of ${testatorName}`, { uppercase: true });
    addParagraph(
        `I, ${testatorName}, presently of ${addressLine}, ${data.personalInfo.country || 'England'}, hereby revoke all former testamentary dispositions made by me and declare this to be my last Will.`,
        { numbered: false }
    );

    addSubheading('Preliminary Declarations');
    addParagraph('I revoke all prior Wills and Codicils.', { numbered: true });
    addParagraph(
        data.personalInfo.maritalStatus
            ? `I am ${data.personalInfo.maritalStatus === 'single' ? 'currently single' : `in a ${partnerLabel} relationship with ${spouseName}`}.`
            : 'I have not disclosed my current marital status.',
        { numbered: true }
    );
    addParagraph(encodeChildren(data.children), { numbered: true });

    addSubheading('Executor');
    addParagraph(
        'The expression “my Executor” used throughout this Will includes either the singular or plural number, or the masculine or feminine gender as appropriate wherever the fact or context so requires. The term “executor” in this Will is synonymous with and includes the term “executrix” and “personal representative”.',
        { numbered: true }
    );
    addParagraph(describeExecutors(data.executors, spouseName, data.spouseIsExecutor), { numbered: true });

    addSubheading('Powers of My Executor');
    addParagraph('I give and appoint to my Executor the following duties and powers with respect to my estate:', { numbered: true });
    const executorPowers: string[] = [
        'To pay my legally enforceable debts, funeral expenses, and expenses connected with the administration of my estate and the trusts created by this Will as soon as convenient after my death.',
        'To take all legal actions to have the probate of my Will completed as quickly and simply as possible, and as free as possible from any court supervision.',
        'To retain, exchange, or dispose of any personal property without liability for loss or depreciation.',
        'To invest, let, rent, exchange, mortgage, sell, dispose of, or give options regarding any real or personal property belonging to my estate and to insure, repair, improve, add to, remove from, or demolish or otherwise deal with such property.',
        'To purchase, maintain, convert, and liquidate investments or securities, and to exercise voting rights in connection with any shareholding.',
        'To open or close bank accounts.',
        'To maintain, continue, dissolve, change, or sell any business which is part of my estate, or to purchase any business if deemed necessary or beneficial to my estate.',
        'To maintain, settle, abandon, make a claim against or defend, or otherwise deal with any claims or actions against my estate.',
        'To employ any solicitor, accountant, or other professional.',
        'Except as otherwise provided, to act as my Trustee by holding in trust the share of any minor beneficiary and to keep such share invested and to transfer the capital or income as deemed advisable for their welfare.'
    ];
    executorPowers.forEach((power, index) => addSubClause(String.fromCharCode(97 + index), power));

    addSubheading('Disposition of Estate');
    addParagraph(describeBeneficiaries(data.beneficiaries), { numbered: true });
    addParagraph(
        data.personalInfo.maritalStatus === 'single'
            ? 'The entire residue of my estate shall be transferred outright to my designated beneficiaries, to be shared equally unless otherwise stated above.'
            : `The entire residue of my estate will be transferred to my ${partnerLabel}, ${spouseName}, provided they survive me for thirty (30) full days; otherwise, my estate shall pass to the beneficiaries listed above for their own use absolutely.`,
        { numbered: true }
    );
    addParagraph(describeAlternatePlan(data.totalFailureStrategy, data.totalFailureBeneficiaries, partnerLabel), { numbered: true });
    addParagraph('If I have omitted to leave property in this Will to one or more of my heirs as named above or have provided them with zero shares of a bequest, the failure to do so is intentional.', { numbered: true });

    addSubheading('General Provisions');
    addParagraph('If any beneficiary under this Will contests in any court any of the provisions of this Will, then each and all such persons shall not be entitled to any devises, legacies, bequests, or benefits under this Will or any codicil hereto, and such interest or share in my estate shall be disposed of as if that contesting beneficiary had not survived me.', { numbered: true });
    addParagraph('If any provisions of this Will are deemed unenforceable, the remaining provisions will remain in full force and effect.', { numbered: true });

    addSubheading('Signature');
    addParagraph(
        `I, ${testatorName}, the within-named Testator, have to this my last Will contained on this and the preceding pages set my hand at the City of ${signingCity}, ${data.signingCountry || 'England'}, this ${signingDate}. I declare that this instrument is my last Will, that I am of the legal age in this jurisdiction to make a Will, that I am under no constraint or undue influence, and that I sign this Will freely and voluntarily.`,
        { numbered: true }
    );

    addParagraph('____________________', { numbered: false });
    addParagraph(testatorName, { italic: true });

    addParagraph('This instrument was signed on the above written date by ____________________, and in our presence the Testator declared this instrument to be their last Will. At the Testator’s request and in the presence of the Testator, we subscribe our names as witnesses hereto. Each of us observed the signing of this Will and affirm that each signature is the true signature of the person whose name was signed. Each of us is now the age of majority, a competent witness and resides at the address set forth after our names.', { numbered: false });
    addParagraph('To the best of our knowledge, the Testator is of the age of majority or otherwise legally empowered to make a Will, is mentally competent and under no constraint or undue influence.', { numbered: false });
    addParagraph(`We declare under penalty of perjury under the laws of the United Kingdom of Great Britain and Northern Ireland that the foregoing is true and correct this ${signingDate} at ${signingCity}, ${data.signingCountry || 'England'}.`, { numbered: false });

    addParagraph('Signed by ____________________ in our presence and then by us in their presence.', { numbered: false });
    addWitnessTable();

    addList(encodeSpecificGifts(data.specificGifts), 'Specific Gifts');

    addList(
        [
            data.hasChildren ? 'Children have been listed above.' : 'No children recorded.',
            data.wantsDelayInheritance
                ? `Inheritance for minors shall be delayed until age ${data.inheritanceAge}.`
                : 'No delayed inheritance preference has been selected.'
        ],
        'Children & Inheritance Preferences'
    );

    if (data.wantsGuardian) {
        addList(encodeGuardians(data.guardians), 'Guardian Appointments');
    }

    if (data.hasPets) {
        addList(encodePets(data.pets), 'Pet Care Wishes');
    }

    if (data.wantsAdditionalClauses) {
        addList(encodeClauses(data.additionalClauses), 'Additional Clauses');
    }

    addList(
        data.beneficiaries.length
            ? data.beneficiaries.map((beneficiary) => {
                const name = beneficiary.type === 'charity'
                    ? beneficiary.charityName || 'Unnamed Charity'
                    : buildName([beneficiary.firstName, beneficiary.lastName]) || 'Unnamed Beneficiary';
                const percentage = beneficiary.percentage ? `${beneficiary.percentage}% share` : 'share amount pending';
                return `${name} — ${percentage}`;
            })
            : ['Beneficiaries have not been detailed.'],
        'Residue Beneficiaries'
    );

    addList(
        data.executors.length
            ? data.executors.map((executor) => `${buildName([executor.title, executor.firstName, executor.lastName]) || 'Unnamed Executor'} — ${executor.relationship || 'Relationship not provided'}`)
            : ['Executors pending selection.'],
        'Executors'
    );

    const safeFileName = `${testatorName || 'last-will'}.pdf`.replace(/[^a-z0-9\-_.]+/gi, '_');
    const fileName = safeFileName;

    if (options.preview) {
        const blobUrl = doc.output('bloburl');
        window.open(blobUrl, '_blank', 'noopener,noreferrer');
        return;
    }

    doc.save(fileName);
};

export default generateWillPdf;
