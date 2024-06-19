import { PayPalButtons } from "@paypal/react-paypal-js";

const PaypalPayment = () => {
    const serverUrl = "http://localhost:8888"; // Replace with your server URL

    const createOrder = (data) => {
        console.log(data);
        // Order is created on the server and the order id is returned
        return fetch(`${serverUrl}/api/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                cart: [{
                    description: "Wood",
                    cost: "7",
                }],
            }),
        })
        .then((response) => response.json()
    )
        .then((order) => order.id);
    };

    const onApprove = (data) => {
        // Order is captured on the server and the response is returned to the browser
        return fetch(`${serverUrl}/api/orders/${data.orderID}/capture`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                orderID: data.orderID
            })
        })
        .then((response) => response.json());
    };

    return (
        <PayPalButtons
            createOrder={(data, actions) => createOrder(data, actions)}
            onApprove={(data, actions) => onApprove(data, actions)}
        />
    );
};

export default PaypalPayment;
