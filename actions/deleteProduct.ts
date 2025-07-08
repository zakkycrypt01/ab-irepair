export const deleteProduct = async (productId: string) => {
    const URL = process.env.NEXT_PUBLIC_SERVER_URL;
    console.log('Server URL:', URL);
    // console.log('Deleting product with ID:', productId);

    try {
        const response = await fetch(`${URL}/api/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId }),
        });

        // Handle 204 No Content response
        if (response.status === 204) {
            console.log('Product deleted successfully, no content returned.');
            return { success: true };
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
