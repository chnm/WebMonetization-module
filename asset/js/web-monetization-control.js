// Handle the web monetization control.
document.addEventListener('DOMContentLoaded', function() {

    const enableButton = document.querySelectorAll('.web-monetization-enable');
    const disableButton = document.querySelectorAll('.web-monetization-disable');

    enableButton.forEach(el => el.style.display = 'none');
    disableButton.forEach(el => el.style.display = 'none');

    const enableMonetization = () => {
        WebMonetization.enableSite();
        enableButton.forEach(el => el.style.display = 'none');
        disableButton.forEach(el => el.style.display = 'inline');
    }
    const disableMonetization = () => {
        WebMonetization.disableSite();
        enableButton.forEach(el => el.style.display = 'inline');
        disableButton.forEach(el => el.style.display = 'none');
    };

    document.addEventListener('click', e => {
        if (e.target.classList.contains('web-monetization-enable')) {
            enableMonetization();
        }
    });
    document.addEventListener('click', e => {
        if (e.target.classList.contains('web-monetization-disable')) {
            disableMonetization();
        }
    });

    if (document.monetization) {
        if (WebMonetization.siteIsEnabled()) {
            disableButton.forEach(el => el.style.display = 'inline');
        } else {
            enableButton.forEach(el => el.style.display = 'inline');
        }
    }
});
