const img_data = async (imgBase64: string, index: number, magicCardChecked: boolean) => {
    const img_payload = {
        img_str: imgBase64
    };
    let model_str = ''
    if (magicCardChecked) {
        model_str = "magic-";
    }
    const mlUrl = window.location.host === 'localhost:3000' ? `http://localhost:8000/${model_str}mlmodel` : `https://api.synderispricechecker.com/${model_str}mlmodel`;
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

    return responseData;
};

export { img_data };