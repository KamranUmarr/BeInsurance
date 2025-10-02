document.addEventListener('DOMContentLoaded', function () {
    const tabs = document.querySelectorAll('.tab-menu .tab');
    const mainTitle = document.getElementById('main-title');
    const mainDesc = document.getElementById('main-desc');
    const mainImg = document.getElementById('main-img');

    tabs.forEach(tab => {
        tab.addEventListener('click', function (e) {
            e.preventDefault();

            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            mainTitle.innerHTML = this.getAttribute('data-title');
            mainDesc.textContent = this.getAttribute('data-desc');
            mainImg.src = this.getAttribute('data-img');
        });
    });
});