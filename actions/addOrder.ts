export const addOrder = async (order: any) => {
    try {
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://ab-irepair.onrender.com';
        console.log('Server URL:', serverUrl);
        console.log('adding order :>> ', order);
        
        const response = await fetch(`${serverUrl}/api/addorder`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(order),
        });
        
        console.log('response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('result :>> ', result);
        
        // Store order data in localStorage for receipt display
        if (typeof window !== 'undefined') {
            localStorage.setItem('lastOrder', JSON.stringify(result));
        }
        
        return result;
    } catch (error) {
        console.error('Error adding order:', error);
        throw error;
    }
};