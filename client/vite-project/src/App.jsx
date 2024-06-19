// // import React from "react";
import { PayPalScriptProvider} from "@paypal/react-paypal-js";
import PaypalPayment from "./components/PaypalPayment";

const App = () => {
    const initialOptions = {
        clientId: "AV0F2iS6BgWvYPkb2VAQCCFyNkoddNn2fjU5jE-PtrYW8b3CBMYaOy5i6WbaNfAugDu6mbVf4253ntza",
        currency: "USD",
        intent: "capture",  
    };
    


    return (
        <div>
        <PayPalScriptProvider options={initialOptions}>
            <PaypalPayment/>
        </PayPalScriptProvider>
        </div>
    );
}

export default App;
