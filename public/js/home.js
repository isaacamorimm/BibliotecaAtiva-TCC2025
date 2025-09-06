document.querySelector('.mobile-menu-btn').addEventListener('click', function() {
        document.querySelector('.nav-menu').classList.toggle('active');
    });

    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-menu') && !e.target.closest('.mobile-menu-btn')) {
            document.querySelector('.nav-menu').classList.remove('active');
        }
});