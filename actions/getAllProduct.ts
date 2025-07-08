export const getAllProduct = async () => {
    try {
        console.log('fetching all product .....');
        
        // Use relative URL if we're in the browser and the proxy is available,
        // otherwise use the full server URL
        const isClient = typeof window !== 'undefined';
        const serverUrl = isClient && window.location.origin.includes('localhost') 
            ? '' // Use relative URL for proxy
            : process.env.NEXT_PUBLIC_SERVER_URL || 'https://ab-irepair.onrender.com';
            
        const apiUrl = `${serverUrl}/api/products`;
        console.log('API URL:', apiUrl);
        
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }, 
        });
        
        console.log('response status:', response.status);
        console.log('response headers:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('result :>> ', result);
        return result;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}
