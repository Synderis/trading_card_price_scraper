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