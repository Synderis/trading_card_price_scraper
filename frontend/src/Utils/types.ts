export type Row = {
    card_name: string;
    card_id: string;
    reverse_holo?: boolean;
    first_edition: boolean;
    card_count: number | null;
    variant_type: string | null;
    source_image: string;
    card_name_id_invalid?: boolean;
    foil?: boolean;
    non_foil?: boolean;
    surgefoil?: boolean,
    etched?: boolean,
    extended_art?: boolean,
    full_art?: boolean,
    non_foil_invalid?: boolean;
    foil_invalid?: boolean;
    surgefoil_invalid?: boolean;
    etched_invalid?: boolean;
    extended_art_invalid?: boolean;
    full_art_invalid?: boolean;
    reverse_holo_invalid?: boolean;
    first_edition_invalid?: boolean;
    yugioh_invalid?: boolean;
    card_count_invalid?: boolean;
    isInvalid?: boolean;
};

export const defaultRows: Row = {
    card_name: '',
    card_id: '',
    reverse_holo: false,
    first_edition: false,
    card_count: 1,
    variant_type: '',
    source_image: '',
    card_name_id_invalid: false,
    foil: false,
    non_foil: false,
    surgefoil: false,
    etched: false,
    extended_art: false,
    full_art: false,
    non_foil_invalid: false,
    foil_invalid: false,
    surgefoil_invalid: false,
    etched_invalid: false,
    extended_art_invalid: false,
    full_art_invalid: false,
    reverse_holo_invalid: false,
    first_edition_invalid: false,
    yugioh_invalid: false,
    card_count_invalid: false,
    isInvalid: false,
};

export interface ResultData {
    card: string;
    id: string;
    card_count: string;
    Ungraded: string;
    grades: {
        [key: string]: string;
    };
    final_link: string;
    img_link: string;
    estimatedGrades?: string[];
    isAdvanced?: boolean;
    variant_type?: string;
    isExcluded?: boolean;
}

export interface MagicResultData {
    card: string;
    id: string;
    set: string;
    card_count: string;
    prices: {
        [key: string]: string;
    };
    final_link: string;
    img_link: string;
    historic_price_link: string;
    estimatedGrades?: string[];
    isAdvanced?: boolean;
    variant_type?: string;
    isExcluded?: boolean;
}

export interface Grade {
        grade: number;
        images: string[];
        description: string;
    }

export interface Totals {
    [key: string]: number;
}