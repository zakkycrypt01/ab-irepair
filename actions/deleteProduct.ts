export const deleteProduct = async (productId: string) => {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://ab-irepair.onrender.com';
    console.log('Server URL:', serverUrl);

    try {
        const response = await fetch(`${serverUrl}/api/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ productId }),
        });

        console.log('Delete response status:', response.status);

        // Handle 204 No Content response
        if (response.status === 204) {
            console.log('Product deleted successfully, no content returned.');
            return { success: true };
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Attempt to parse JSON response
        const result = await response.json();
        console.log('Product deleted:', result);
        return result;
        
    } catch (error) {
        console.error('Error deleting product:', error);
        if (error instanceof Error) {
            return { error: error.message };
        } else {
            return { error: 'An unknown error occurred' };
        }
    }
};
