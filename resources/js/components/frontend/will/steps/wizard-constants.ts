export const TOTAL_INTERNAL_STEPS = 13;

export const WIZARD_STEPS = [
    { key: 'get-started', title: 'Get Started' },
    { key: 'executor', title: 'Executor' },
    { key: 'children', title: 'Children' },
    { key: 'gifts', title: 'Gifts' },
    { key: 'remainder', title: 'Remainder' },
    { key: 'final-details', title: 'Final Details' },
    { key: 'signing', title: 'Signing' },
    { key: 'print-download', title: 'Print/Download' }
] as const;

export const UK_COUNTRY_OPTIONS = [
    'England',
    'Wales',
    'Scotland',
    'Northern Ireland',
    'United Kingdom'
] as const;
