// Handle the web monetization control.
document.addEventListener('DOMContentLoaded', function() {

    const enableButton = document.querySelectorAll('.web-monetization-enable');
    const disableButton = document.querySelectorAll('.web-monetization-disable');

    enableButton.forEach(el => el.style.display = 'none');
    disableButton.forEach(el => el.style.display = 'none');

    const enablePayment = () => {
        WebMonetization.enablePayment();
        enableButton.forEach(el => el.style.display = 'none');
        disableButton.forEach(el => el.style.display = 'inline');
    }
    const disablePayment = () => {
        WebMonetization.disablePayment();
        enableButton.forEach(el => el.style.display = 'inline');
        disableButton.forEach(el => el.style.display = 'none');
    };

    document.addEventListener('click', e => {
        if (e.target.classList.contains('web-monetization-enable')) {
            enablePayment();
        }
    });
    document.addEventListener('click', e => {
        if (e.target.classList.contains('web-monetization-disable')) {
            disablePayment();
        }
    });

    if (WebMonetization.isReady()) {
        WebMonetization.init();
        if (WebMonetization.isEnabled()) {
            disableButton.forEach(el => el.style.display = 'inline');
        } else {
            enableButton.forEach(el => el.style.display = 'inline');
        }
    }
});
