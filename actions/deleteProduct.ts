export const deleteProduct = async (productId: string) => {
    const URL = process.env.NEXT_PUBLIC_SERVER_URL;
    console.log('Server URL:', URL);
    console.log('Deleting product with ID:', productId);
  
    try {
      const response = await fetch(`${URL}/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });
  
      // Check if the response is successful
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to delete product:', errorData);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log('Delete product response:', result);
      return result;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error; // Re-throw the error for further handling
    }
  };