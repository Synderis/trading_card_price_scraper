export type Row = {
    card_name: string;
    card_id: string;
    reverse_holo?: boolean;
    first_edition: boolean;
    card_count: number | null;
    variant: boolean;
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
    card_count_invalid?: boolean;
    isInvalid?: boolean;
};