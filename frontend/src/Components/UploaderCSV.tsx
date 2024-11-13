// // csvUploader.tsx
// import React, { useState, useRef } from 'react';
// import Papa from 'papaparse';
// import { Row } from './Types';
// import { validateCSVRow } from './ValidatorCSV';

// interface CSVUploaderProps {
//   onCSVUpload: (rows: Row[], magicCardChecked: boolean) => void;
// }

// const truth_values = (value: any): boolean => {
//   return ['true', true, 1, 'y', 'Y', 't', 'T', 'True', 'TRUE'].includes(value);
// };

// const false_values = (value: any): boolean => {
//   return ['false', false, 0, 'n', 'N', 'f', 'F', 'False', 'FALSE', null].includes(value);
// };

// const CSVUploader: React.FC<CSVUploaderProps> = ({ onCSVUpload, ...props }) => {
//   const [csvFileName, setCsvFileName] = useState('No file chosen');
//   const csvInputRef = useRef<HTMLInputElement>(null);

//   const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setCsvFileName(file.name);
//       Papa.parse(file, {
//         header: true,
//         dynamicTyping: true,
//         complete: (results) => {
//           const parsedRows: Row[] = results.data.map((row: any) => {
//             const card_name_id_invalid = !magicCardChecked && row.card_name !== null && (row.card_id === null || row.card_id === '');
//             const foil_invalid = !((truth_values(row.foil)) || false_values(row.foil));
//             const reverse_holo_invalid = !((truth_values(row.reverse_holo)) || false_values(row.reverse_holo));
//             const first_edition_invalid = !((truth_values(row.first_edition)) || false_values(row.first_edition));
//             const surgefoil_invalid = !((truth_values(row.surgefoil)) || false_values(row.surgefoil));
//             const etched_invalid = !((truth_values(row.etched)) || false_values(row.etched));
//             const extended_art_invalid = !((truth_values(row.extended_art)) || false_values(row.extended_art));
//             const full_art_invalid = !((truth_values(row.full_art)) || false_values(row.full_art));
//             const card_count_invalid = !(row.card_count === null || row.card_count > 0);

//             const isInvalid = validateCSVRow(row, magicCardChecked);

//             console.log(
//               card_name_id_invalid,
//               foil_invalid,
//               surgefoil_invalid,
//               etched_invalid,
//               extended_art_invalid,
//               full_art_invalid,
//               reverse_holo_invalid,
//               first_edition_invalid,
//               card_count_invalid,
//               isInvalid
//             )
//             return {
//               card_name: row.card_name || '',
//               card_id: row.card_id || '',
//               foil: truth_values(row.foil),
//               surgefoil: truth_values(row.surgefoil),
//               etched: truth_values(row.etched),
//               extended_art: truth_values(row.extended_art),
//               full_art: truth_values(row.full_art),
//               reverse_holo: truth_values(row.reverse_holo),
//               first_edition: truth_values(row.first_edition),
//               card_count: row.card_count === null || row.card_count === '' ? 1 : row.card_count,
//               variant: truth_values(row.variant),
//               variant_type: row.variant_type || '',
//               source_image: row.source_image || '',
//               card_name_id_invalid,
//               foil_invalid,
//               surgefoil_invalid,
//               etched_invalid,
//               extended_art_invalid,
//               full_art_invalid,
//               reverse_holo_invalid,
//               first_edition_invalid,
//               card_count_invalid,
//               isInvalid,
//             }
//           });
//           onCSVUpload(parsedRows);
//         },
//         error: (error) => {
//           console.error('CSV parsing error:', error);
//           console.log('magicCardChecked:', magicCardChecked);
//         },

//       }); 
//     } else {
//       setCsvFileName('No file chosen');
//     }
//   };

//   return (
//     <div>
//       <input
//         type="file"
//         accept=".csv"
//         ref={csvInputRef}
//         onChange={handleCSVUpload}
//       />
//       <span>{csvFileName}</span>
//     </div>
//   );
// };

// export default CSVUploader;