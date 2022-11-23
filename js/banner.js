'use strict'

document.addEventListener('DOMContentLoaded', function () {
    console.info('Loaded');

    const banners = document.querySelectorAll("#banner img");

    var old = banners.length - 1;
    var current = 0;

    function loop() {
        banners[current].setAttribute('class', 'show');
        banners[old].setAttribute('class', 'hide');

        console.info('Banner changed');

        old = current;
        current++;

        if (current === banners.length) {
            current = 0;
        }
        
        setTimeout(loop, 5000);
    }

    loop();
});