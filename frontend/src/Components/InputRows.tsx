import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import '../CSS Sheets/InputRows.css';

type Row = {
  cardName: string;
  cardId: string;
  holo: boolean;
  reverse_holo: boolean;
  first_edition: boolean;
  card_count: number | null;
  variant: boolean;
  variant_type: string | null;
  isInvalid?: boolean;
};

const InputRows: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [toggleVariants, setToggleVariants] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const [loadingProgress, setLoadingProgress] = useState(0); // Loading progress


  const initialRowState = Array.from({ length: 10 }, () => ({
    cardName: '',
    cardId: '',
    holo: false,
    reverse_holo: false,
    first_edition: false,
    card_count: 1,
    variant: false,
    variant_type: null,
    isInvalid: false, // Initialize isInvalid
  }));

  const [rows, setRows] = useState<Row[]>(initialRowState);

  const toggleAdvancedFields = () => {
    setShowAdvanced(!showAdvanced);
  };

  const checkInvalidRows = (updatedRows: Row[]) => {
    return updatedRows.map(row => ({
      ...row,
      isInvalid: 
        (row.cardName || row.cardId) ?
        !row.cardName || 
        !row.cardId || 
        (row.card_count !== null && row.card_count <= 0): false, // Check if card_count is null or greater than 0
    }));
  };

  const handleChange = (index: number, field: keyof Row, value: string | boolean | number) => {
    const newRows = [...rows];

    if (field === 'cardName' || field === 'cardId' || field === 'variant_type') {
      newRows[index][field] = value as string;
    } else if (field === 'holo' || field === 'reverse_holo' || field === 'first_edition' || field === 'variant') {
      newRows[index][field] = value as boolean;
    } else if (field === 'card_count') {
      newRows[index][field] = value === '' ? 1 : Number(value); // Set to null if input is empty
    }

    // Check for invalid rows after the change
    const updatedRows = checkInvalidRows(newRows);
    setRows(updatedRows);
  };

  const handleAddRows = () => {
    const newRowsToAdd: Row[] = Array.from({ length: 10 }, () => ({
      cardName: '',
      cardId: '',
      holo: false,
      reverse_holo: false,
      first_edition: false,
      card_count: 1,
      variant: false,
      variant_type: null,
      isInvalid: false, // Initialize isInvalid
    }));
    setRows(prevRows => [...prevRows, ...newRowsToAdd]);
  };

  const handleClearRow = (index: number) => {
    const newRows = [...rows];
    newRows[index] = {
      cardName: '',
      cardId: '',
      holo: false,
      reverse_holo: false,
      first_edition: false,
      card_count: 1,
      variant: false,
      variant_type: null,
      isInvalid: false, // Reset isInvalid
    };
    setRows(newRows);
  };

  const handleClearAllRows = () => {
    setRows(initialRowState);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset file input
    }
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
    const estimatedTime = 550 * totalCards + 250; // Calculate loading time

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
          card_name: row.cardName,
          card_id: String(row.cardId),
          holo: row.holo,
          reverse_holo: row.reverse_holo,
          first_edition: row.first_edition,
          card_count: row.card_count,
          variant: row.variant,
          variant_type: row.variant_type,
        })),
      };

      // Constructing the API URL using window.location
      const apiUrl = `https://pueedtoh01.execute-api.us-east-2.amazonaws.com/prod/submit`; // Adjust the path as necessary
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

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: (results) => {
          const parsedRows: Row[] = results.data.map((row: any) => {
            const isInvalid =
              !(row.holo === 'true' || row.holo === true || row.holo === 1 || row.holo === 'false' || row.holo === false || row.holo === 0 || row.holo === null) ||
              !(row.reverse_holo === 'true' || row.reverse_holo === true || row.reverse_holo === 1 || row.reverse_holo === 'false' || row.reverse_holo === false || row.reverse_holo === 0 || row.reverse_holo === null) ||
              !(row.first_edition === 'true' || row.first_edition === true || row.first_edition === 1 || row.first_edition === 'false' || row.first_edition === false || row.first_edition === 0 || row.first_edition === null) ||
              !(row.card_count === null || row.card_count > 0); // Validate card_count

            return {
              cardName: row.cardName || '',
              cardId: row.cardId || '',
              holo: row.holo === 'true' || row.holo === true || row.holo === 1,
              reverse_holo: row.reverse_holo === 'true' || row.reverse_holo === true || row.reverse_holo === 1,
              first_edition: row.first_edition === 'true' || row.first_edition === true || row.first_edition === 1,
              // Set card_count to 1 if it's null or empty
              card_count: row.card_count === null || row.card_count === '' ? 1 : row.card_count,
              variant: row.variant === 'true' || row.variant === true || row.variant === 1,
              variant_type: row.variant_type || '',
              isInvalid,
            };
          });
          setRows(parsedRows);
        },
        error: (error) => {
          console.error('CSV parsing error:', error);
        }
      });
    }
  };

  const downloadCSVTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "cardName,cardId,holo,reverse_holo,first_edition,card_count,variant,variant_type\n" +
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
      <input type="file" accept=".csv" ref={fileInputRef} style={{ marginBottom: '10px' }} onChange={handleCSVUpload} />
      <h4>Enter the data for each row or upload a CSV file. Rows with potentially invalid CSV data will be marked red.</h4>
      <form onSubmit={handleSubmit}>
        {rows.map((row, index) => (
          <span key={index} className={`row ${row.isInvalid ? 'invalid-row' : ''}`}>
            <input type="text" value={row.cardName} onChange={e => handleChange(index, 'cardName', e.target.value)} placeholder="Card Name" />
            <input type="text" value={row.cardId} onChange={e => handleChange(index, 'cardId', e.target.value)} placeholder="Card ID" />
            <label>
              Holo:
              <input type="checkbox" checked={row.holo} onChange={e => handleChange(index, 'holo', e.target.checked)} />
            </label>
            <label>
              Reverse Holo:
              <input type="checkbox" checked={row.reverse_holo} onChange={e => handleChange(index, 'reverse_holo', e.target.checked)} />
            </label>
            <label>
              First Edition:
              <input type="checkbox" checked={row.first_edition} onChange={e => handleChange(index, 'first_edition', e.target.checked)} />
            </label>
            <label>
              Card Count:
              <input type="number" value={row.card_count === null ? '' : row.card_count} onChange={e => handleChange(index, 'card_count', e.target.value)} placeholder="Card Count" />
            </label>
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
          Toggle All Variants:
          <input
            type="checkbox"
            checked={toggleVariants}
            onChange={handleToggleVariants}
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
