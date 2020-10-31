document.addEventListener('DOMContentLoaded', function() {

    const startButton = document.querySelectorAll('.web-monetization-start');
    const stopButton = document.querySelectorAll('.web-monetization-stop');
    const notEnabledSpan = document.querySelectorAll('.web-monetization-disabled');

    startButton.forEach(el => el.style.display = 'none');
    stopButton.forEach(el => el.style.display = 'none');
    notEnabledSpan.forEach(el => el.style.display = 'none');

    const startMonetization = () => {
        WebMonetization.monetizeSite();
        startButton.forEach(el => el.style.display = 'none');
        stopButton.forEach(el => el.style.display = 'inline');
    }
    const stopMonetization = () => {
        WebMonetization.unmonetizeSite();
        startButton.forEach(el => el.style.display = 'inline');
        stopButton.forEach(el => el.style.display = 'none');
    };

    document.addEventListener('click', e => {
        if (e.target.classList.contains('web-monetization-start')) {
            startMonetization();
        }
    });
    document.addEventListener('click', e => {
        if (e.target.classList.contains('web-monetization-stop')) {
            stopMonetization();
        }
    });

    if (document.monetization) {
        // The client has web monetization enabled.
        if (WebMonetization.siteIsMonetized()) {
            stopButton.forEach(el => el.style.display = 'inline');
        } else {
            startButton.forEach(el => el.style.display = 'inline');
        }
    } else {
        // The client does not have web monetization enabled.
        notEnabledSpan.forEach(el => el.style.display = 'inline');
    }
});
