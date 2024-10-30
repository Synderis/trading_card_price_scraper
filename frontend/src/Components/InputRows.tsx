// import React, { useState, useRef, useEffect } from 'react';
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import '../CSS Sheets/InputRows.css';

type Row = {
  card_name: string;
  card_id: string;
  holo: boolean;
  reverse_holo: boolean;
  first_edition: boolean;
  card_count: number | null;
  variant: boolean;
  variant_type: string | null;
  card_name_id_invalid?: boolean;
  holo_invalid?: boolean;
  reverse_holo_invalid?: boolean;
  first_edition_invalid?: boolean;
  card_count_invalid?: boolean;
  isInvalid?: boolean;
};

const InputRows: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [toggleVariants, setToggleVariants] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [magicCardChecked, setMagicCardChecked] = useState(false);
  const [fileName, setFileName] = useState('No file chosen');



  const initialRowState = Array.from({ length: 10 }, () => ({
    card_name: '',
    card_id: '',
    holo: false,
    reverse_holo: false,
    first_edition: false,
    card_count: 1,
    variant: true,
    variant_type: '',
    card_name_id_invalid: false,
    holo_invalid: false,
    reverse_holo_invalid: false,
    first_edition_invalid: false,
    card_count_invalid: false,
    isInvalid: false,
  }));

  const [rows, setRows] = useState<Row[]>(initialRowState);

  const toggleAdvancedFields = () => {
    setShowAdvanced(!showAdvanced);
  };
  
  // const handleChange = (index: number, field: keyof Row, value: string | boolean | number) => {
  //   const newRows = [...rows];
  
  //   if (field === 'card_name' || field === 'card_id' || field === 'variant_type') {
  //     newRows[index][field] = value as string;
  //   } else if (field === 'holo' || field === 'reverse_holo' || field === 'first_edition' || field === 'variant') {
  //     newRows[index][field] = value as boolean;
  //   } else if (field === 'card_count') {
  //     newRows[index][field] = value === '' ? 1 : Number(value);
  //   }
  
  //   // Check only the specific row for invalid data
  //   newRows[index].isInvalid = checkInvalidRow(newRows[index]);

  
  //   setRows(newRows);
  // };

  // useEffect(() => {
  //   const revalidateRows = rows.map(row => ({
  //     ...row,
  //     card_name_id_invalid: !magicCardChecked && row.card_name !== null && row.card_id === null,
  //     holo_invalid: !(row.holo === true || row.holo === false),
  //     reverse_holo_invalid: !(row.reverse_holo === true || row.reverse_holo === false),
  //     first_edition_invalid: !(row.first_edition === true || row.first_edition === false),
  //     card_count_invalid: !(row.card_count === null || row.card_count > 0),
  //     isInvalid: (!magicCardChecked && row.card_name !== null && row.card_id === null) ||
  //           !(row.holo === true || row.holo === false) ||
  //           !(row.reverse_holo === true || row.reverse_holo === false) ||
  //           !(row.first_edition === true || row.first_edition === false) ||
  //           !(row.card_count === null || row.card_count > 0)
  //   }));
  //   setRows(revalidateRows);
  // }, [magicCardChecked, rows]);

  const handleChange = (index: number, field: keyof Row, value: string | boolean | number) => {
    const newRows = [...rows];
  
    if (field === 'card_name' || field === 'card_id' || field === 'variant_type') {
      newRows[index][field] = value as string;
    } else if (field === 'holo' || field === 'reverse_holo' || field === 'first_edition' || field === 'variant') {
      newRows[index][field] = value as boolean;
    } else if (field === 'card_count') {
      newRows[index][field] = value === '' ? 1 : Number(value);
    }
  
    // Check and update invalid states
    const row = newRows[index];
    row.card_name_id_invalid = !magicCardChecked && row.card_name !== null && (row.card_id === null || row.card_id === '');
    row.holo_invalid = !(row.holo === true || row.holo === false);
    row.reverse_holo_invalid = !(row.reverse_holo === true || row.reverse_holo === false);
    row.first_edition_invalid = !(row.first_edition === true || row.first_edition === false);
    row.card_count_invalid = !(row.card_count === null || row.card_count > 0);
  
    // Update isInvalid based on all invalid flags
    row.isInvalid = row.card_name_id_invalid || row.holo_invalid || row.reverse_holo_invalid || row.first_edition_invalid || row.card_count_invalid;
  
    setRows(newRows);
  };
  

  const handleAddRows = () => {
    const newRowsToAdd: Row[] = Array.from({ length: 10 }, () => ({
      card_name: '',
      card_id: '',
      holo: false,
      reverse_holo: false,
      first_edition: false,
      card_count: 1,
      variant: true,
      variant_type: '',
      card_name_id_invalid: false,
      holo_invalid: false,
      reverse_holo_invalid: false,
      first_edition_invalid: false,
      card_count_invalid: false,
      isInvalid: false, // Initialize isInvalid
    }));
    setRows(prevRows => [...prevRows, ...newRowsToAdd]);
  };

  const handleClearRow = (index: number) => {
    const newRows = [...rows];
    newRows[index] = {
      card_name: '',
      card_id: '',
      holo: false,
      reverse_holo: false,
      first_edition: false,
      card_count: 1,
      variant: true,
      variant_type: '',
      card_name_id_invalid: false,
      holo_invalid: false,
      reverse_holo_invalid: false,
      first_edition_invalid: false,
      card_count_invalid: false,
      isInvalid: false,
    };
    setRows(newRows);
  };

  const handleClearAllRows = () => {
    setRows(initialRowState);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setFileName('No file chosen');
  };

  const handleToggleVariants = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setToggleVariants(isChecked);
    setRows(prevRows => prevRows.map(row => ({ ...row, variant: isChecked })));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const invalidRows = rows.some(row => row.isInvalid);
    
    if (invalidRows) {
      alert('Please fix the invalid rows before submitting.');
      return;
    }

    const totalCards = rows.reduce((acc, row) => acc + (row.card_count || 0), 0);
    const estimatedTime = 550 * totalCards + 250;

    // Log the total cards and estimated loading time
    console.log(`Total Cards: ${totalCards}`);
    console.log(`Estimated Loading Time: ${estimatedTime} ms`);

    setLoading(true);
    setLoadingProgress(0);

    try {
      // Simulate loading
      for (let i = 0; i <= 100; i++) {
        await new Promise(resolve => setTimeout(resolve, estimatedTime / 100));
        setLoadingProgress(i);
      }

      const payload = {
        cards: rows.map(row => ({
          card_name: row.card_name,
          card_id: String(row.card_id),
          holo: row.holo,
          reverse_holo: row.reverse_holo,
          first_edition: row.first_edition,
          card_count: row.card_count,
          variant: row.variant,
          variant_type: row.variant_type,
        })),
      };

      // Constructing the API URL using window.location
      // const apiUrl = `https://pueedtoh01.execute-api.us-east-2.amazonaws.com/prod/submit`;

      // local testing API URL
      const apiUrl = `http://localhost:8000/submit`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to submit rows');
      }

      navigate('/results');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
      setLoadingProgress(0); // Reset progress
    }
  };

  const truth_values = (value: any): boolean => {
      return ['true', true, 1, 'y', 'Y', 't', 'T', 'True', 'TRUE'].includes(value);
  };

  const false_values = (value: any): boolean => {
      return ['false', false, 0, 'n', 'N', 'f', 'F', 'False', 'FALSE', null].includes(value);
  };

  const handleMagicCardToggle = () => {
    setMagicCardChecked(prev => !prev);
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: (results) => {
          const parsedRows: Row[] = results.data.map((row: any) => {
            const card_name_id_invalid = !magicCardChecked && row.card_name !== null && (row.card_id === null || row.card_id === '');
            const holo_invalid = !((truth_values(row.holo)) || false_values(row.holo));
            const reverse_holo_invalid = !((truth_values(row.reverse_holo)) || false_values(row.reverse_holo));
            const first_edition_invalid = !((truth_values(row.first_edition)) || false_values(row.first_edition));
            const card_count_invalid = !(row.card_count === null || row.card_count > 0);
            const isInvalid =
              !((truth_values(row.holo)) || false_values(row.holo)) ||
              !((truth_values(row.reverse_holo)) || false_values(row.reverse_holo)) ||
              !((truth_values(row.first_edition)) || false_values(row.first_edition)) ||
              !(row.card_count === null || row.card_count > 0);
            
            console.log(
              card_name_id_invalid,
              holo_invalid,
              reverse_holo_invalid,
              first_edition_invalid,
              card_count_invalid,
              isInvalid
            )
            return {
              card_name: row.card_name || '',
              card_id: row.card_id || '',
              holo: truth_values(row.holo),
              reverse_holo: truth_values(row.reverse_holo),
              first_edition: truth_values(row.first_edition),
              card_count: row.card_count === null || row.card_count === '' ? 1 : row.card_count,
              variant: truth_values(row.variant),
              variant_type: row.variant_type || '',
              card_name_id_invalid,
              holo_invalid,
              reverse_holo_invalid,
              first_edition_invalid,
              card_count_invalid,
              isInvalid,
            };
          });
          setRows(parsedRows);
        },
        error: (error) => {
          console.error('CSV parsing error:', error);
        }
      });
    } else {
      setFileName('No file chosen');
    }
  };

  const downloadCSVTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "card_name,card_id,holo,reverse_holo,first_edition,card_count,variant,variant_type\n" +
      ",,,,,,,"; // One empty line for a row

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "card_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container">
      <h1>Card Input Rows</h1>
      <button className='download-template-btn' onClick={downloadCSVTemplate}>Download CSV Template</button>
      <input id="csv-file-upload" type="file" accept=".csv" ref={fileInputRef} onChange={handleCSVUpload} hidden/>
      <label htmlFor="csv-file-upload" className='upload-btn'>Upload CSV File</label>
      <span id="file-chosen" style={{marginTop: '10px'}}>{fileName}</span>
      <h4>Enter the data for each row or upload a CSV file. Rows with potentially invalid CSV data will be marked red.</h4>
      <form onSubmit={handleSubmit}>
        {rows.map((row, index) => (
          <span key={index} className={`row ${row.isInvalid ? 'invalid-row' : ''}`}>
            <span key={index} className={`row ${row.card_name_id_invalid ? 'invalid-label' : ''}`}>
              {row.card_name_id_invalid && (
                <span className="invalid-marker">!</span>
              )}
              <input type="text" value={row.card_name} onChange={e => handleChange(index, 'card_name', e.target.value)} placeholder="Card Name" />
              <input type="text" value={row.card_id} onChange={e => handleChange(index, 'card_id', e.target.value)} placeholder={magicCardChecked ? 'Card ID (Optional)' : 'Card ID'} />
            </span>
            <span key={index} className={`row ${row.holo_invalid ? 'invalid-label' : ''}`}>
              <label>
                {magicCardChecked ? 'Foil' : 'Holo'}:
                <input type="checkbox" checked={row.holo} onChange={e => handleChange(index, 'holo', e.target.checked)} />
              </label>
            </span>
            {!magicCardChecked && (
              <>
                <span key={index} className={`row ${row.reverse_holo_invalid ? 'invalid-label' : ''}`}>
                  <label>
                    Reverse Holo:
                    <input type="checkbox" checked={row.reverse_holo} onChange={e => handleChange(index, 'reverse_holo', e.target.checked)} />
                  </label>
                </span>
                <span key={index} className={`row ${row.first_edition_invalid ? 'invalid-label' : ''}`}>
                  <label>
                    First Edition:
                    <input type="checkbox" checked={row.first_edition} onChange={e => handleChange(index, 'first_edition', e.target.checked)} />
                  </label>
                </span>
              </>
            )}
            <span key={index} className={`row ${row.card_count_invalid ? 'invalid-label' : ''}`}>
              <label>
                Card Count:
                <input type="number" value={row.card_count === null ? '' : row.card_count} onChange={e => handleChange(index, 'card_count', e.target.value)} placeholder="Card Count" />
              </label>
            </span>
            {showAdvanced && (
              <>
                <label>
                  Variant:
                  <input type="checkbox" checked={row.variant} onChange={e => handleChange(index, 'variant', e.target.checked)} />
                </label>
                <input type="text" value={row.variant_type || ''} onChange={e => handleChange(index, 'variant_type', e.target.value)} placeholder="Variant Type" />
              </>
            )}
            <button type="button" className="clear-btn" onClick={() => handleClearRow(index)}>Clear</button>
          </span>
        ))}
        <div className="button-group">
          <button type="button" onClick={handleAddRows}>Add 10 Rows</button>
          <button type="button" className="clear-all-btn" onClick={handleClearAllRows}>Clear All Rows</button>
          <button type="submit" className="submit-btn">Submit</button>
        </div>
      </form>
      <div style={{ marginTop: '10px' }}>
        <button type="button" onClick={toggleAdvancedFields}>
          {showAdvanced ? 'Hide Advanced Types' : 'Show Advanced Types'}
        </button>
        <label style={{ marginLeft: '10px' }}>
          Toggle All Prints:
          <input
            type="checkbox"
            checked={toggleVariants}
            onChange={handleToggleVariants}
          />
        </label>
        <label style={{ marginLeft: '10px' }}>
          Toggle Magic Card Input:
          <input
            type="checkbox"
            checked={magicCardChecked}
            onChange={handleMagicCardToggle}
          />
        </label>
      </div>
      {loading && (
      <>
        <p>Loading Please wait...</p>
        <div className="loading-bar">
          <div className="loading-progress" style={{ width: `${loadingProgress}%` }}></div>
        </div>
      </>
    )}
    </div>
  );
};

export default InputRows;
