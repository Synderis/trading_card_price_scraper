import { Row } from "./types";
export const img_data = async (imgBase64: string, index: number, magicCardChecked: boolean, prevRows: Row[], callback: (newRows: Row[]) => void) => {
    // Prepare the payload with the Base64 image data
    console.log(imgBase64);
    // console.log();
    const img_payload = {
        img_str: imgBase64
    };
    let model_str = ''
    if (magicCardChecked) {
        model_str = "magic-";
    }
    const mlUrl = window.location.host === 'localhost:3000'? `http://localhost:8000/${model_str}mlmodel` : `https://api.synderispricechecker.com/${model_str}mlmodel`;
    // Send the image data to the API for processing
    // const mlUrl = `https://api.synderispricechecker.com/${model_str}mlmodel`
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
        const updatedRows = prevRows.map((row, i) => {
            if (i === index) {
                return {
                    ...row,
                    card_name: responseData.card_name,
                    card_id: responseData.card_id,
                    reverse_holo: responseData.reverse_holo,
                    first_edition: responseData.first_edition !== undefined ? responseData.first_edition : false,
                    foil: responseData.foil,
                    surgefoil: responseData.surgefoil,
                    etched: responseData.etched,
                    extended_art: responseData.extended_art,
                    full_art: responseData.full_art,
                    source_image: prevRows[index].source_image, // Preserve the source_image value
                };
            }
            return row;
            });
            callback(updatedRows);
        } else {
            callback(prevRows);
        }
    };