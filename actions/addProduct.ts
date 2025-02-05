export const addProduct = async (updatedProducts:any) => {
    const URL = process.env.NEXT_PUBLIC_API_URL
    console.log('URL :>> ', URL);
    console.log('adding product :>> ', updatedProducts);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/addproduct`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedProducts),
    });
console.log('response :>> ', response);
const result = await response.json();
console.log('result :>> ', result);
return result;
}