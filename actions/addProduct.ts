export const addProduct = async (updatedProducts: any) => {
    try {
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://ab-irepair.onrender.com';
        console.log('Server URL:', serverUrl);
        console.log('adding product :>> ', updatedProducts);
        
        const response = await fetch(`${serverUrl}/api/addproduct`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(updatedProducts),
        });
        
        console.log('response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('result :>> ', result);
        return result;
    } catch (error) {
        console.error('Error adding product:', error);
        throw error;
    }
}