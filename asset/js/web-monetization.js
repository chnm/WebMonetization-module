document.addEventListener('DOMContentLoaded', function() {

    const startButton = document.querySelectorAll('.web-monetization-start');
    const stopButton = document.querySelectorAll('.web-monetization-stop');
    const notEnabledSpan = document.querySelectorAll('.web-monetization-disabled');

    startButton.forEach(el => el.style.display = 'none');
    stopButton.forEach(el => el.style.display = 'none');
    notEnabledSpan.forEach(el => el.style.display = 'none');

    let monetizationTag;
    const setMonetizationTag = (paymentPointer) => {
        monetizationTag = document.createElement('meta');
        monetizationTag.setAttribute('name', 'monetization');
        monetizationTag.setAttribute('content', paymentPointer);
        document.head.appendChild(monetizationTag);
    };
    const startMonetization = (paymentPointer) => {
        setMonetizationTag(paymentPointer);
        startButton.forEach(el => el.style.display = 'none');
        stopButton.forEach(el => el.style.display = 'inline');
    }
    const stopMonetization = () => {
        monetizationTag.remove();
        startButton.forEach(el => el.style.display = 'inline');
        stopButton.forEach(el => el.style.display = 'none');
    };

    document.addEventListener('click', e => {
        if (e.target.classList.contains('web-monetization-start')) {
            startMonetization(e.target.dataset.paymentPointer);
        }
    });
    document.addEventListener('click', e => {
        if (e.target.classList.contains('web-monetization-stop')) {
            stopMonetization();
        }
    });

    if (document.monetization) {
        // The client has web monetization enabled.
        startButton.forEach(el => el.style.display = 'inline');
    } else {
        // The client does not have web monetization enabled.
        notEnabledSpan.forEach(el => el.style.display = 'inline');
    }

    // This stuff is not required.
    if (document.monetization) {
        document.monetization.addEventListener('monetizationstop', e => {
            console.log(document.monetization.state);
        });
        document.monetization.addEventListener('monetizationpending', e => {
            console.log(document.monetization.state);
        });
        document.monetization.addEventListener('monetizationstart', e => {
            console.log(document.monetization.state);
        });
        let scale;
        let total = 0;
        document.monetization.addEventListener('monetizationprogress', e => {
            console.log(document.monetization.state);
            if (total === 0) {
                scale = e.detail.assetScale;
                console.log(e.detail.assetCode);
            }
            total += Number(e.detail.amount);
            const formatted = (total * Math.pow(10, -scale)).toFixed(scale);
            console.log(formatted);
        });
    }
});
