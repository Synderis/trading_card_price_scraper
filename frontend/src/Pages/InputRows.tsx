import React, { useState, useRef } from 'react';
import '../CSS Sheets/InputRows.css';
import { useNavigate } from 'react-router-dom';
import { Row, defaultRows } from '../Utils/types';
import { validateCSVRow } from '../Utils/validatorCSV';
import { initialRowState } from '../Utils/initialRowState';
import { truth_values, false_values } from '../Utils/utils';
import { downloadTemplateCSV } from '../Utils/utilsCSV';
import Papa from 'papaparse';
import DropZone from '../Components/DropZone';
import RowOptions from '../Components/RowOptions';
import { img_data } from '../Utils/imgProcessor';


const InputRows: React.FC = () => {
  const navigate = useNavigate();
  const csvInputRef = useRef<HTMLInputElement>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [magicCardChecked, setMagicCardChecked] = useState(false);
  const [csvFileName, setCsvFileName] = useState('No file chosen');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [imgFileNames, setImgFileNames] = useState<string[]>(Array(10).fill('No file chosen'));
  const [rows, setRows] = useState<Row[]>(initialRowState);

  const toggleAdvancedFields = () => {
    setShowAdvanced(!showAdvanced);
  };

  const handleChange = (index: number, field: keyof Row, value: string | boolean | number) => {
    const newRows = [...rows];
  
    if (field === 'card_name' || field === 'card_id' || field === 'variant_type') {
      newRows[index][field] = value as string;
    } else if (field === 'foil' || field === 'reverse_holo' || field === 'first_edition' || field === 'non_foil' || field === 'surgefoil' || field === 'etched' || field === 'extended_art' || field === 'full_art') {
      newRows[index][field] = value as boolean;
    } else if (field === 'card_count') {
      newRows[index][field] = value === '' ? 1 : Number(value);
    }
  
    // Check and update invalid states
    const row = newRows[index];
    row.card_name_id_invalid = !magicCardChecked && row.card_name !== null && (row.card_id === null || row.card_id === '');
    row.foil_invalid = magicCardChecked && !(row.foil === true || row.foil === false);
    row.surgefoil_invalid = magicCardChecked && !(row.surgefoil === true || row.surgefoil === false);
    row.etched_invalid = magicCardChecked && !(row.etched === true || row.etched === false);
    row.extended_art_invalid = magicCardChecked && !(row.extended_art === true || row.extended_art === false);
    row.full_art_invalid = magicCardChecked && !(row.full_art === true || row.full_art === false);
    row.yugioh_invalid = !magicCardChecked && row.card_id && row.card_id.toString().includes('-') && typeof row.reverse_holo === 'boolean' ? row.reverse_holo : undefined;
    row.reverse_holo_invalid = !magicCardChecked && (row.yugioh_invalid ? true : !(row.reverse_holo === true || row.reverse_holo === false));
    row.first_edition_invalid = !magicCardChecked && !(row.first_edition === true || row.first_edition === false);
    
    row.card_count_invalid = !(row.card_count === null || row.card_count > 0);
  
    // Update isInvalid based on all invalid flags
    row.isInvalid = row.card_name_id_invalid || row.foil_invalid || row.reverse_holo_invalid || row.first_edition_invalid || row.card_count_invalid || row.surgefoil_invalid || row.etched_invalid || row.extended_art_invalid || row.full_art_invalid || row.yugioh_invalid;
    
  
    setRows(newRows);
  };

  const handleImageUpload = (index: number, file: File) => {
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
        handleImgData(reader.result as string, index);  // Pass the image data (Base64 string) to img_data
      };
  
      reader.readAsDataURL(file); // Read the file as a data URL (Base64 string)
    }
  };

  const handleImgData = async (imgBase64: string, index: number) => {
    const responseData = await img_data(imgBase64, index, magicCardChecked);
    if (responseData && responseData.card_name !== undefined && responseData.card_id !== undefined) {
      setRows((prevRows) => {
        const updatedRows = [...prevRows];
        updatedRows[index] = {
            ...updatedRows[index],
            card_name: responseData.card_name,
            card_id: responseData.card_id,
            reverse_holo: responseData.reverse_holo,
            first_edition: responseData.first_edition !== undefined ? responseData.first_edition : false,
            foil: responseData.foil !== undefined ? responseData.foil : false,
            surgefoil: responseData.surgefoil !== undefined ? responseData.surgefoil : false,
            etched: responseData.etched !== undefined ? responseData.etched : false,
            extended_art: responseData.extended_art !== undefined ? responseData.extended_art : false,
            full_art: responseData.full_art !== undefined ? responseData.full_art : false,
        };
        return updatedRows;
      });
    }
  }

  const handleFiles = (files: File[] | FileList | React.ChangeEvent<HTMLInputElement> | { acceptedFiles: File[] }) => {
    const fileArray = files instanceof FileList ? files : 
                      files instanceof Object && 'acceptedFiles' in files ? files.acceptedFiles : 
                      files instanceof Object && 'target' in files && 'files' in files.target ? files.target.files : 
                      [];
    
    const emptyRows = rows.filter(row => !row.card_name || !row.card_id || !row.source_image);
    if (fileArray && emptyRows.length < fileArray.length) {
      const rowsToAdd = Math.ceil((fileArray.length - emptyRows.length) / 10);
      for (let i = 0; i < rowsToAdd; i++) {
        handleAddRows();
      }
    }
    let emptyRowIndex = rows.findIndex((row, rowIndex) => {
      return !row.card_name || !row.card_id || !row.source_image;
    });
    Array.from(fileArray ?? []).forEach((file, index) => {
      if (emptyRowIndex === -1) {
        emptyRowIndex = rows.length - 1;
      }
      handleImageUpload(emptyRowIndex, file);
      // Increment the emptyRowIndex to point to the next empty row
      emptyRowIndex = rows.findIndex((row, rowIndex) => rowIndex > emptyRowIndex && (!row.card_name || !row.card_id || !row.source_image));
    });
  };
  const singleUploadAssign = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(index, file);
    }
  };

  const handleAddRows = () => {
    const newRowsToAdd: Row[] = Array.from({ length: 10 }, () => ({ ...defaultRows }));
    setRows(prevRows => [...prevRows, ...newRowsToAdd]);
  };

  const handleClearRow = (index: number) => {
    const newRows = [...rows];
    newRows[index] = { ...defaultRows };
    setRows(newRows);
  };

  const handleClearAllRows = () => {
    setRows(Array(10).fill(defaultRows));
    if (csvInputRef.current) {
      csvInputRef.current.value = '';
    }
    setCsvFileName('No file chosen');
  };

  const handleClearAllIds = () => {
    setRows(initialRowState => initialRowState.map(row => ({ ...row, card_id: '' })));
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
          non_foil: row.non_foil,
          foil: row.foil,
          surgefoil: row.surgefoil,
          etched: row.etched,
          extended_art: row.extended_art,
          full_art: row.full_art,
          reverse_holo: row.reverse_holo,
          first_edition: row.first_edition,
          card_count: row.card_count,
          variant_type: row.variant_type,
          source_image: row.source_image,

        })),
      };
      let normResult = '/results-page';
      let submit_str = "";
      if (magicCardChecked) {
        submit_str = "magic-";
        normResult = "/magic-results-page";
      }

      const apiUrl = window.location.host === 'localhost:3000'? `http://localhost:8000/${submit_str}submit` : `https://api.synderispricechecker.com/${submit_str}submit`;
      // const apiUrl = `https://api.synderispricechecker.com/${submit_str}submit`;
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

      navigate(normResult);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
      setLoadingProgress(0); // Reset progress
    }
  };

  const handleMagicCardToggle = () => {
    setMagicCardChecked(prev => {
      const newRows = [...rows];
      newRows.forEach((row, index) => {
        if (!prev) {
          // Run new invalid checks for each row here
          row.card_name_id_invalid = false;
          row.foil_invalid = !(row.foil === true || row.foil === false);
          row.reverse_holo_invalid = false;
          row.first_edition_invalid = false;
          row.surgefoil_invalid = !(row.surgefoil === true || row.surgefoil === false);
          row.etched_invalid = !(row.etched === true || row.etched === false);
          row.extended_art_invalid = !(row.extended_art === true || row.extended_art === false);
          row.full_art_invalid = !(row.full_art === true || row.full_art === false);
          row.card_count_invalid = !(row.card_count === null || row.card_count > 0);
        } else {
          // Run old invalid checks for each row here
          row.card_name_id_invalid = (row.card_name !== null && row.card_id === null) || (row.card_name !== '' && row.card_id === '');
          row.foil_invalid = !(row.foil === true || row.foil === false);
          row.surgefoil_invalid = !(row.surgefoil === true || row.surgefoil === false);
          row.etched_invalid = !(row.etched === true || row.etched === false);
          row.extended_art_invalid = !(row.extended_art === true || row.extended_art === false);
          row.full_art_invalid = !(row.full_art === true || row.full_art === false);
          row.reverse_holo_invalid = !(row.reverse_holo === true || row.reverse_holo === false);
          row.first_edition_invalid = !(row.first_edition === true || row.first_edition === false);
          row.card_count_invalid = !(row.card_count === null || row.card_count > 0);
        }
      });
      setRows(newRows);
      return !prev;
    });
  };


  const handleValidCSV = (row: Row) => {
    return validateCSVRow(row, magicCardChecked);
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
            const foil_invalid = magicCardChecked && !((truth_values(row.foil)) || false_values(row.foil));
            const yugioh_invalid = !magicCardChecked && row.card_id && row.card_id.toString().includes('-') && row.reverse_holo;
            const reverse_holo_invalid = !magicCardChecked && (yugioh_invalid ? true : !((truth_values(row.reverse_holo)) || false_values(row.reverse_holo)));
            const first_edition_invalid = !magicCardChecked && !((truth_values(row.first_edition)) || false_values(row.first_edition));
            const surgefoil_invalid = magicCardChecked && !((truth_values(row.surgefoil)) || false_values(row.surgefoil));
            const etched_invalid = magicCardChecked && !((truth_values(row.etched)) || false_values(row.etched));
            const extended_art_invalid = magicCardChecked && !((truth_values(row.extended_art)) || false_values(row.extended_art));
            const full_art_invalid = magicCardChecked && !((truth_values(row.full_art)) || false_values(row.full_art));
            const card_count_invalid = !(row.card_count === null || row.card_count > 0);
            

            const isInvalid = handleValidCSV(row);
            
            console.log(
              card_name_id_invalid,
              foil_invalid,
              surgefoil_invalid,
              etched_invalid,
              extended_art_invalid,
              full_art_invalid,
              reverse_holo_invalid,
              first_edition_invalid,
              yugioh_invalid,
              card_count_invalid,
              isInvalid
            )
            return {
              card_name: row.card_name || '',
              card_id: row.card_id || '',
              foil: truth_values(row.foil),
              surgefoil: truth_values(row.surgefoil),
              etched: truth_values(row.etched),
              extended_art: truth_values(row.extended_art),
              full_art: truth_values(row.full_art),
              reverse_holo: truth_values(row.reverse_holo),
              first_edition: truth_values(row.first_edition),
              card_count: row.card_count === null || row.card_count === '' ? 1 : row.card_count,
              variant_type: row.variant_type || '',
              source_image: row.source_image || '',
              card_name_id_invalid,
              foil_invalid,
              surgefoil_invalid,
              etched_invalid,
              extended_art_invalid,
              full_art_invalid,
              reverse_holo_invalid,
              first_edition_invalid,
              yugioh_invalid,
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

  const renderRow = (row: Row, index: number) => {
    return (
      <span key={index} className={`row ${row.isInvalid ? 'invalid-row' : ''}`}>
        <span className={`row ${row.card_name_id_invalid ? 'invalid-label' : ''}`}>
          {row.card_name_id_invalid && (
            <span className="invalid-marker">!</span>
          )}
          <input type="text" value={row.card_name} onChange={e => handleChange(index, 'card_name', e.target.value)} placeholder="Card Name" />
          <input type="text" value={row.card_id} onChange={e => handleChange(index, 'card_id', e.target.value)} placeholder={magicCardChecked ? 'Card ID (Optional)' : 'Card ID'} />
        </span>
        <RowOptions row={row} index={index} magicCardChecked={magicCardChecked} handleChange={handleChange} />
        <span className={`row ${row.card_count_invalid ? 'invalid-label' : ''}`}>
          <label>
            Card Count:
            <input type="number" value={row.card_count === null ? '' : row.card_count} onChange={e => handleChange(index, 'card_count', e.target.value)} placeholder="Card Count" />
          </label>
        </span>
        {showAdvanced && (
          <>
            <input type="text" value={row.variant_type || ''} onChange={e => handleChange(index, 'variant_type', e.target.value)} placeholder="Variant Type" />
          </>
        )}
        <div className={`row-container ${row.source_image ? 'uploaded-image-container' : 'img-upload-container'}`}>
          <label className="img-upload-button">
            <img src="/img_icon_white.png" alt="Upload" className="upload-icon"/>
            <input
              type="file"
              onChange={(event) => singleUploadAssign(index, event)} hidden
            />
          </label>
          {row.source_image && (
            <div className="image-container">
              <img src={row.source_image} alt={`Uploaded preview for row ${index}`} width="100" style={{ borderRadius: '5px', marginTop: '4px' }} />
              <div className="image-hover">
                <img src={row.source_image} alt={`Uploaded preview for row ${index}`} width="300" style={{ borderRadius: '15px' }} />
              </div>
            </div>
          )}
        </div>
        <button type="button" className="clear-btn" onClick={() => handleClearRow(index)}>Clear</button>
      </span>
    )
  };

  return (
    <div className="container">
      <h1>Card Input Rows</h1>
      <div>
        <button className='download-template-btn' onClick={downloadTemplateCSV}>Download CSV Template</button>
        <input id="csv-file-upload" type="file" accept=".csv" ref={csvInputRef} onChange={handleCSVUpload} hidden/>
        <label htmlFor="csv-file-upload" className='upload-btn'>Upload CSV File</label>
        <span id="file-chosen" style={{marginTop: '10px'}}>{csvFileName}</span>
      </div>
      <div className='upload-instructions' style={{ display: 'flex', alignItems: 'center', flexDirection: 'row'}}>
        <h4 >Enter the data for each row or upload a CSV file. Rows with potentially invalid CSV data will be marked red.</h4>
        <label className='bulk-upload-btn'>
          <img src="/img_icon_white.png" alt="Upload" className="upload-icon"/>
          <input id="bulk-img-upload" type="file" multiple onChange={(event) => handleFiles(event)} hidden/>
        </label>
        <DropZone onDrop={acceptedFiles => handleFiles({ acceptedFiles })}/>
      </div>
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
          Toggle Magic Card Input:
          <input
            type="checkbox"
            checked={magicCardChecked}
            onChange={handleMagicCardToggle}
          />
        </label>
        {magicCardChecked && (
            <button type="button" className="clear-all-ids-btn" onClick={handleClearAllIds}>Clear All Ids</button>
          )}
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
