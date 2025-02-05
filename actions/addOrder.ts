export const addOrder = async (order: any) => {
    const URL = process.env.NEXT_PUBLIC_SERVER_URL
    console.log('URL :>> ', URL);
    console.log('adding order :>> ', order);
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/addorder`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(order),
    });
    console.log('response :>> ', response);
    const result = await response.json();
    console.log('result :>> ', result);
    return result;
};