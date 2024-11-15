import React from 'react';
import { Row } from '../Utils/types';

interface RowOptionsProps {
    row: Row;
    index: number;
    magicCardChecked: boolean;
    handleChange: (index: number, field: keyof Row, value: string | boolean | number) => void;
}

const RowOptions: React.FC<RowOptionsProps> = ({ row, index, magicCardChecked, handleChange }) => {
    return (
        <>
            {magicCardChecked && (
                <>
                    <span className={`row ${row.foil_invalid ? 'invalid-label' : ''}`}>
                        <label>
                            Foil:
                            <input type="checkbox" checked={row.foil} onChange={e => handleChange(index, 'foil', e.target.checked)} />
                        </label>
                    </span>
                    <span className={`row ${row.surgefoil_invalid ? 'invalid-label' : ''}`}>
                        <label>
                            Surgefoil:
                            <input type="checkbox" checked={row.surgefoil} onChange={e => handleChange(index, 'surgefoil', e.target.checked)} />
                        </label>
                    </span>
                    <span className={`row ${row.etched_invalid ? 'invalid-label' : ''}`}>
                        <label>
                            Etched:
                            <input type="checkbox" checked={row.etched} onChange={e => handleChange(index, 'etched', e.target.checked)} />
                        </label>
                    </span>
                    <span className={`row ${row.extended_art_invalid ? 'invalid-label' : ''}`}>
                        <label>
                            Extended Art:
                            <input type="checkbox" checked={row.extended_art} onChange={e => handleChange(index, 'extended_art', e.target.checked)} />
                        </label>
                    </span>
                    <span className={`row ${row.full_art_invalid ? 'invalid-label' : ''}`}>
                        <label>
                            Full Art:
                            <input type="checkbox" checked={row.full_art} onChange={e => handleChange(index, 'full_art', e.target.checked)} />
                        </label>
                    </span>
                </>
            )}
            {!magicCardChecked && (
                <>
                    <span className={`row ${row.reverse_holo_invalid ? 'invalid-label' : ''}`}>
                        <label>
                            Reverse Holo:
                            <input type="checkbox" checked={row.reverse_holo} onChange={e => handleChange(index, 'reverse_holo', e.target.checked)} />
                        </label>
                    </span>
                    <span className={`row ${row.first_edition_invalid ? 'invalid-label' : ''}`}>
                        <label>
                            First Edition:
                            <input type="checkbox" checked={row.first_edition} onChange={e => handleChange(index, 'first_edition', e.target.checked)} />
                        </label>
                    </span>
                </>
            )}
        </>
    );
};

export default RowOptions;