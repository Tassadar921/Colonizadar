import 'toastify-js/src/toastify.css';
import Toastify from 'toastify-js';
import { navigate } from '../stores/locationStore.js';

const successToastStyle = {
    background: 'linear-gradient(to right, #00b09b, #96c93d)',
    borderRadius: '10px',
};

const errorToastStyle = {
    background: 'linear-gradient(to right, #ff5f6d, #ffc371)',
    borderRadius: '10px',
};

const warningToastStyle = {
    background: 'linear-gradient(to right, #a66300, #a2951a)',
    borderRadius: '10px',
};

const showToast = (text, status = 'success', redirect = null) => {
    let style = successToastStyle;
    if (status === 'error') {
        style = errorToastStyle;
    } else if (status === 'warning') {
        style = warningToastStyle;
    }

    Toastify({
        text,
        duration: 5000,
        style,
        onClick: () => {
            if (typeof redirect === 'string') {
                navigate(redirect);
            } else if (redirect) {
                redirect();
            }
        },
    }).showToast();
};

export { showToast };
