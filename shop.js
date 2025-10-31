$(function () {
    const burger = $('#burger-menu');
    const navLinks = $('#nav-links');
    burger.on('click', function () {
        burger.toggleClass('open');
        navLinks.toggleClass('open');
    });
    $(window).on('resize', function () {
        if (window.innerWidth > 1200) {
            burger.removeClass('open');
            navLinks.removeClass('open');
        }
    });

    const API_URL = 'https://fakestoreapi.com/products';
    const $grid = $('#productsGrid');
    const $form = $('#productForm');
    const $alert = $('#alert-area');
    const $loading = $('#loading');
    let editingId = null;
    let products = [];

    function showAlert(msg, type = 'success') {
        $alert.html(`<div class="alert alert-${type} alert-dismissible fade show" role="alert">
            <i class="fa fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2"></i>${msg}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>`);
        setTimeout(() => $alert.empty(), 5000);
    }
    
    function setLoading(state) {
        $loading.toggle(state);
    }

    function loadProducts() {
        setLoading(true);
        $.get(API_URL)
            .done(function (data) {
                products = data;
                renderProducts();
            })
            .fail(() => showAlert('Failed to load products.', 'danger'))
            .always(() => setLoading(false));
    }

    function renderProducts() {
        $grid.empty();
        if (products.length === 0) {
            $grid.html('<div class="col-12 text-center text-muted py-5"><i class="fa fa-box-open fa-3x mb-3"></i><p>No products available</p></div>');
            return;
        }
        products.slice(0, 12).forEach(product => {
            let desc = product.description || '';
            if (desc.length > 100) desc = desc.substring(0, 100) + '...';
            
            $grid.append(`
                <div class="col-lg-4 col-md-6">
                    <div class="card product-card" data-id="${product.id}">
                        <img src="${product.image}" class="card-img-top" alt="${product.title}" loading="lazy">
                        <div class="card-body">
                            <div class="category">${product.category}</div>
                            <h5 class="card-title">${product.title}</h5>
                            <div class="price">$${parseFloat(product.price).toFixed(2)}</div>
                            <p class="card-text">${desc}</p>
                            <div class="card-actions">
                                <button class="btn btn-warning editBtn"><i class="fa fa-edit"></i> Edit</button>
                                <button class="btn btn-danger deleteBtn"><i class="fa fa-trash"></i> Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            `);
        });
    }

    loadProducts();

    $('#image').on('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                $('#previewImg').attr('src', e.target.result).show();
            };
            reader.readAsDataURL(file);
        } else {
            $('#previewImg').hide();
        }
    });

    $form.on('submit', function (e) {
        e.preventDefault();
        const title = $('#title').val().trim();
        const price = parseFloat($('#price').val());
        const description = $('#description').val().trim();
        const category = $('#category').val().trim();
        let image = $('#previewImg').attr('src') || 'https://via.placeholder.com/400';

        if (!title || !description || !category || isNaN(price)) return;

        setLoading(true);

        if (editingId) {
            $.ajax({
                url: `${API_URL}/${editingId}`,
                method: 'PUT',
                data: JSON.stringify({ title, price, description, category, image }),
                contentType: 'application/json',
                success: function (data) {
                    const idx = products.findIndex(p => p.id == editingId);
                    if (idx !== -1) {
                        products[idx] = { ...products[idx], title, price, description, category, image };
                        renderProducts();
                    }
                    showAlert('Product updated successfully!');
                    resetForm();
                },
                error: () => showAlert('Failed to update product.', 'danger'),
                complete: () => setLoading(false)
            });
        } else {
            $.ajax({
                url: API_URL,
                method: 'POST',
                data: JSON.stringify({ title, price, description, category, image }),
                contentType: 'application/json',
                success: function (data) {
                    data.id = Date.now();
                    data.image = image;
                    products.unshift(data);
                    renderProducts();
                    showAlert('Product added successfully!');
                    resetForm();
                },
                error: () => showAlert('Failed to add product.', 'danger'),
                complete: () => setLoading(false)
            });
        }
    });

    $grid.on('click', '.editBtn', function () {
        const $card = $(this).closest('.product-card');
        editingId = $card.data('id');
        const product = products.find(p => p.id == editingId);
        if (!product) return;
        
        $('#productId').val(editingId);
        $('#title').val(product.title);
        $('#price').val(product.price);
        $('#description').val(product.description);
        $('#category').val(product.category);
        $('#previewImg').attr('src', product.image).show();
        $('#saveBtn').html('<i class="fa fa-save me-1"></i>Update Product');
        $('#formTitle').text('Edit Product');
        $('#cancelEditBtn').removeClass('d-none');
        $('html,body').animate({scrollTop: $('.form-container').offset().top - 100}, 400);
    });

    $('#cancelEditBtn').on('click', function () {
        resetForm();
    });

    function resetForm() {
        editingId = null;
        $form[0].reset();
        $('#productId').val('');
        $('#previewImg').hide().attr('src', '');
        $('#saveBtn').html('<i class="fa fa-save me-1"></i>Add Product');
        $('#formTitle').text('Add New Product');
        $('#cancelEditBtn').addClass('d-none');
    }

    $grid.on('click', '.deleteBtn', function () {
        const $card = $(this).closest('.product-card');
        const id = $card.data('id');
        if (!confirm('Are you sure you want to delete this product?')) return;
        
        setLoading(true);
        $.ajax({
            url: `${API_URL}/${id}`,
            method: 'DELETE',
            success: function () {
                products = products.filter(p => p.id != id);
                renderProducts();
                showAlert('Product deleted successfully!');
            },
            error: () => showAlert('Failed to delete product.', 'danger'),
            complete: () => setLoading(false)
        });
    });
});