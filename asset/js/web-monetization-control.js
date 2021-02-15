// Handle the web monetization control.
document.addEventListener('DOMContentLoaded', function() {

    const startContainer = document.querySelectorAll('.web-monetization-start');
    const startButton = document.querySelectorAll('.web-monetization-start-button');
    const stopContainer = document.querySelectorAll('.web-monetization-stop');
    const stopButton = document.querySelectorAll('.web-monetization-stop-button');
    const disabledContainer = document.querySelectorAll('.web-monetization-disabled');

    startContainer.forEach(el => el.style.display = 'none');
    stopContainer.forEach(el => el.style.display = 'none');
    disabledContainer.forEach(el => el.style.display = 'none');

    const enablePayment = () => {
        WebMonetization.enablePayment();
        startContainer.forEach(el => el.style.display = 'none');
        stopContainer.forEach(el => el.style.display = 'inline');
    }
    const disablePayment = () => {
        WebMonetization.disablePayment();
        startContainer.forEach(el => el.style.display = 'inline');
        stopContainer.forEach(el => el.style.display = 'none');
    };

    document.addEventListener('click', e => {
        if (e.target.classList.contains('web-monetization-start-button')) {
            enablePayment();
        }
    });
    document.addEventListener('click', e => {
        if (e.target.classList.contains('web-monetization-stop-button')) {
            disablePayment();
        }
    });

    if (WebMonetization.isReady()) {
        WebMonetization.init();
        if (WebMonetization.isEnabled()) {
            stopContainer.forEach(el => el.style.display = 'inline');
        } else {
            startContainer.forEach(el => el.style.display = 'inline');
        }
    } else {
        disabledContainer.forEach(el => el.style.display = 'inline');
    }
});
