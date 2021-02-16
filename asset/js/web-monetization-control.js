// Handle the web monetization control.
document.addEventListener('DOMContentLoaded', function() {

    // Insert the banner just above the header element.
    if (document.body.dataset.webMonetizationBanner) {
        document.getElementsByTagName('header')[0].insertAdjacentHTML(
            'beforebegin',
            document.body.dataset.webMonetizationBanner
        );
    }

    const startContainer = document.querySelectorAll('.web-monetization-start');
    const startButton = document.querySelectorAll('.web-monetization-start-button');
    const stopContainer = document.querySelectorAll('.web-monetization-stop');
    const stopButton = document.querySelectorAll('.web-monetization-stop-button');
    const disabledContainer = document.querySelectorAll('.web-monetization-disabled');

    startContainer.forEach(el => el.classList.remove('active'));
    stopContainer.forEach(el => el.classList.remove('active'));
    disabledContainer.forEach(el => el.classList.remove('active'));

    const enablePayment = () => {
        WebMonetization.enablePayment();
        startContainer.forEach(el => el.classList.remove('active'));
        stopContainer.forEach(el => el.classList.add('active'));
    }
    const disablePayment = () => {
        WebMonetization.disablePayment();
        startContainer.forEach(el => el.classList.add('active'));
        stopContainer.forEach(el => el.classList.remove('active'));
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
        console.log(WebMonetization.isEnabled());
        WebMonetization.init();
        if (WebMonetization.isEnabled()) {
            stopContainer.forEach(el => el.classList.add('active'));
        } else {
            startContainer.forEach(el => el.classList.add('active'));
        }
    } else {
        disabledContainer.forEach(el => el.classList.add('active'));
    }
});
