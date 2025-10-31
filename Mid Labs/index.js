function showMoreReviews() {
    var hiddenReviews = document.querySelectorAll('.single-review.hidden');
    var btn = document.querySelector('.view-more-btn');
    
    for(var i = 0; i < hiddenReviews.length; i++) {
        hiddenReviews[i].classList.remove('hidden');
    }
    
    btn.style.display = 'none';
}