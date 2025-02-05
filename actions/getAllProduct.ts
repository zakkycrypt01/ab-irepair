export const getAllProduct = async () =>{
    console.log('fetching all product .....');
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/products`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }, 
    });
    console.log('response :>> ', response);
    const result = await response.json();
    console.log('result :>> ', result);
    return result;
}
