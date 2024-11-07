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
  source_image: string;
  card_name_id_invalid?: boolean;
  holo_invalid?: boolean;
  reverse_holo_invalid?: boolean;
  first_edition_invalid?: boolean;
  card_count_invalid?: boolean;
  isInvalid?: boolean;
};

const InputRows: React.FC = () => {
  const navigate = useNavigate();
  const csvInputRef = useRef<HTMLInputElement>(null);
  // const imageInputRef = useRef<HTMLInputElement>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [toggleVariants, setToggleVariants] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [magicCardChecked, setMagicCardChecked] = useState(false);
  const [csvFileName, setCsvFileName] = useState('No file chosen');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [imgFileNames, setImgFileNames] = useState<string[]>(Array(10).fill('No file chosen'));



  const initialRowState = Array.from({ length: 10 }, () => ({
    card_name: '',
    card_id: '',
    holo: false,
    reverse_holo: false,
    first_edition: false,
    card_count: 1,
    variant: true,
    variant_type: '',
    source_image: '',
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

  const handleImageUpload = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
  
    if (file) {
      const reader = new FileReader();
  
      // Read the file and update the specific row's image when done
      reader.onloadend = () => {
        setRows((prevRows) => {
          // Create a copy of the rows and update the specific row with the image
          const updatedRows = [...prevRows];
          updatedRows[index] = {
            ...updatedRows[index],
            source_image: reader.result as string, // Store the Base64 string in the row
          };
          return updatedRows;
        });
  
        // Update the file name for the specific index
        setImgFileNames((prevFileNames) => {
          const newFileNames = [...prevFileNames];
          newFileNames[index] = file.name;
          return newFileNames;
        });
  
        // Call img_data after the image data has been successfully set in rows
        img_data(reader.result as string, index);  // Pass the image data (Base64 string) to img_data
      };
  
      reader.readAsDataURL(file); // Read the file as a data URL (Base64 string)
    }
  };
  
  const img_data = async (imgBase64: string, index: number) => {
    // Prepare the payload with the Base64 image data
    console.log(imgBase64);
    console.log(rows);
    const img_payload = {
      img_str: imgBase64
    };
    // Send the image data to the API for processing
    // const mlUrl = `https://pueedtoh01.execute-api.us-east-2.amazonaws.com/prod/submit`;
    // Local testing API URL
    const mlUrl = `http://localhost:8000/mlmodel`;
    const response = await fetch(mlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(img_payload),
    });
  
    if (!response.ok) {
      throw new Error('Failed to submit rows');
    }
  
    // Process the response from the API and update the rows with card names and IDs
    const responseData = await response.json();
  
    if (responseData && responseData.card_name !== undefined && responseData.card_id !== undefined) {
      setRows((prevRows) => {
        const updatedRows = [...prevRows];
        
        // Assuming you want to update the first row with the response data
        updatedRows[index] = {
          ...updatedRows[index],
          card_name: responseData.card_name,
          card_id: responseData.card_id,
        };
  
        return updatedRows;
      });
    } else {
      console.error("Unexpected response data:", responseData);
    }
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
      source_image: '',
      card_name_id_invalid: false,
      holo_invalid: false,
      reverse_holo_invalid: false,
      first_edition_invalid: false,
      card_count_invalid: false,
      isInvalid: false,
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
      source_image: '',
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
    if (csvInputRef.current) {
      csvInputRef.current.value = '';
    }
    // if (imageInputRef.current) {
    //   imageInputRef.current.value = '';
    // }
    // setImgFileNames('No file chosen');
    setCsvFileName('No file chosen');
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
          source_image: row.source_image,
        })),
      };

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
    setMagicCardChecked(prev => {
      const newRows = [...rows];
      newRows.forEach((row, index) => {
        if (!prev) {
          // Run new invalid checks for each row here
          row.card_name_id_invalid = false;
          row.holo_invalid = !(row.holo === true || row.holo === false);
          row.reverse_holo_invalid = false;
          row.first_edition_invalid = false;
          row.card_count_invalid = !(row.card_count === null || row.card_count > 0);
        } else {
          // Run old invalid checks for each row here
          row.card_name_id_invalid = (row.card_name !== null && row.card_id === null) || (row.card_name !== '' && row.card_id === '');
          row.holo_invalid = !(row.holo === true || row.holo === false);
          row.reverse_holo_invalid = !(row.reverse_holo === true || row.reverse_holo === false);
          row.first_edition_invalid = !(row.first_edition === true || row.first_edition === false);
          row.card_count_invalid = !(row.card_count === null || row.card_count > 0);
        }
      });
      setRows(newRows);
      return !prev;
    });
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFileName(file.name);
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
              source_image: row.source_image || '',
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
      setCsvFileName('No file chosen');
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

  const renderRow = (row: Row, index: number) => {
    console.log('index', index)
    return (
      <span key={index} className={`row ${row.isInvalid ? 'invalid-row' : ''}`}>
        <span className={`row ${row.card_name_id_invalid ? 'invalid-label' : ''}`}>
          {row.card_name_id_invalid && (
            <span className="invalid-marker">!</span>
          )}
          <input type="text" value={row.card_name} onChange={e => handleChange(index, 'card_name', e.target.value)} placeholder="Card Name" />
          <input type="text" value={row.card_id} onChange={e => handleChange(index, 'card_id', e.target.value)} placeholder={magicCardChecked ? 'Card ID (Optional)' : 'Card ID'} />
        </span>
        <span className={`row ${row.holo_invalid ? 'invalid-label' : ''}`}>
          <label>
            {magicCardChecked ? 'Foil' : 'Holo'}:
            <input type="checkbox" checked={row.holo} onChange={e => handleChange(index, 'holo', e.target.checked)} />
          </label>
        </span>
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
        <span className={`row ${row.card_count_invalid ? 'invalid-label' : ''}`}>
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
        <div className={`row-container ${row.source_image ? 'uploaded-image-container' : 'img-upload-container'}`}>
          <label className="img-upload-btn">
            <img src="/img_icon_white.png" alt="Upload" className="upload-icon"/>
            <input
              type="file"
              // accept="image/*"
              style={{ display: 'none' }}
              onChange={(event) => handleImageUpload(index, event)}
            />
          </label>
        {row.source_image && (
          <img src={row.source_image} alt={`Uploaded preview for row ${index}`} width="100" />
        )}
        </div>
        <button type="button" className="clear-btn" onClick={() => handleClearRow(index)}>Clear</button>
      </span>
    )
  };

  return (
    <div className="container">
      <h1>Card Input Rows</h1>
      <button className='download-template-btn' onClick={downloadCSVTemplate}>Download CSV Template</button>
      <input id="csv-file-upload" type="file" accept=".csv" ref={csvInputRef} onChange={handleCSVUpload} hidden/>
      <label htmlFor="csv-file-upload" className='upload-btn'>Upload CSV File</label>
      <span id="file-chosen" style={{marginTop: '10px'}}>{csvFileName}</span>
      <h4>Enter the data for each row or upload a CSV file. Rows with potentially invalid CSV data will be marked red.</h4>
      <form onSubmit={handleSubmit}>
        {rows.map(renderRow)}
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
