



// Headers for OTP API requests
const headers: HeadersInit = {
    'clientId': process.env.OTPLESS_CLIENT_ID || "",
    'clientSecret': process.env.OTPLESS_CLIENT_SECRET || "",
    'Content-Type': 'application/json'
};

interface RequestData {
    email: string;
    orderId?: string;
    hash?: string;
    otpLength: number;
    channel: string;
    expiry: number;
}

// Helper function to send OTP
const sendOTP = async (email: string) => {
    const url: string = 'https://auth.otpless.app/auth/otp/v1/send';
    const data: RequestData = {
        email: email,
        otpLength: 6,
        channel: 'EMAIL',
        expiry: 600
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error in sendOTP:', error);
        throw error;
    }
};

// Helper function to verify OTP
const verifyOTP = async (email: string, otp: string, orderId: string) => {
    const url = 'https://auth.otpless.app/auth/otp/v1/verify';
    const body = JSON.stringify({
        orderId: orderId,
        otp: otp,
        email: email
    });
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: headers,
        body: body
    };

    try {
        const response = await fetch(url, requestOptions);
        const data = await response.json();
        return data;
    } catch (error: any) {
        console.error('Error in verifyCode:', error.message);
        throw new Error(error.message);
    }
};

// Helper function to resend OTP
const resendOTP = async (orderId: string) => {
    const url: string = 'https://auth.otpless.app/auth/otp/v1/resend';
    const data = { orderId };
    console.log("I am in resendOTP " + data)
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });
        const result = await response.json();
        console.log(result)
        return [response.status, result];
    } catch (error: any) {
        console.error('Error in resendOTP:', error.response);
        throw new Error('Error in resendOTP');
    }
};

export {sendOTP,verifyOTP,resendOTP}