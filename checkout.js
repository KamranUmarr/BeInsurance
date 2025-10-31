$(function () {
    
    function validateField($input, valid, message) {
        if (valid) {
            $input.removeClass('is-invalid').addClass('is-valid');
            $input.next('.invalid-feedback').text('');
        } else {
            $input.removeClass('is-valid').addClass('is-invalid');
            $input.next('.invalid-feedback').text(message);
        }
    }

    function validateForm() {
        let valid = true;
        
        const $fullname = $('#fullname');
        const fullnameVal = $fullname.val().trim();
        if (fullnameVal.length < 3) {
            validateField($fullname, false, 'Please enter at least 3 characters.');
            valid = false;
        } else {
            validateField($fullname, true, '');
        }

        const $email = $('#email');
        const emailVal = $email.val().trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailVal)) {
            validateField($email, false, 'Please enter a valid email.');
            valid = false;
        } else {
            validateField($email, true, '');
        }
        
        const $phone = $('#phone');
        const phoneVal = $phone.val().replace(/\D/g, '');
        if (phoneVal.length < 10) {
            validateField($phone, false, 'Please enter at least 10 digits.');
            valid = false;
        } else {
            validateField($phone, true, '');
        }

        const $address = $('#address');
        if ($address.val().trim() === '') {
            validateField($address, false, 'Please enter your address.');
            valid = false;
        } else {
            validateField($address, true, '');
        }

        const $city = $('#city');
        if ($city.val().trim() === '') {
            validateField($city, false, 'Please enter your city.');
            valid = false;
        } else {
            validateField($city, true, '');
        }

        const $postal = $('#postal');
        const postalVal = $postal.val().trim();
        if (!/^\d{4,6}$/.test(postalVal)) {
            validateField($postal, false, 'Postal code must be 4-6 digits.');
            valid = false;
        } else {
            validateField($postal, true, '');
        }
        
        const $country = $('#country');
        if (!$country.val() || $country.val() === '') {
            $country.removeClass('is-valid').addClass('is-invalid');
            $country.parent().find('.invalid-feedback').text('Select a country.');
            valid = false;
        } else {
            $country.removeClass('is-invalid').addClass('is-valid');
            $country.parent().find('.invalid-feedback').text('');
        }

        const $payment = $('input[name="paymentMethod"]:checked');
        if ($payment.length === 0) {
            $('input[name="paymentMethod"]').addClass('is-invalid');
            valid = false;
        } else {
            $('input[name="paymentMethod"]').removeClass('is-invalid');
        }

        if ($('#payCard').is(':checked')) {
            
            const $cardName = $('#cardName');
            if ($cardName.val().trim().length < 3) {
                validateField($cardName, false, 'Enter cardholder name.');
                valid = false;
            } else {
                validateField($cardName, true, '');
            }
            
            const $cardNumber = $('#cardNumber');
            const cardNumVal = $cardNumber.val().replace(/\s/g, '');
            if (!/^\d{13,19}$/.test(cardNumVal)) {
                validateField($cardNumber, false, 'Enter valid card number.');
                valid = false;
            } else {
                validateField($cardNumber, true, '');
            }
            
            const $cardExpiry = $('#cardExpiry');
            if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test($cardExpiry.val())) {
                validateField($cardExpiry, false, 'MM/YY');
                valid = false;
            } else {
                validateField($cardExpiry, true, '');
            }
            
            const $cardCVV = $('#cardCVV');
            if (!/^\d{3,4}$/.test($cardCVV.val())) {
                validateField($cardCVV, false, 'CVV');
                valid = false;
            } else {
                validateField($cardCVV, true, '');
            }
        }

        
        const $terms = $('#termsCheck');
        if (!$terms.is(':checked')) {
            $terms.addClass('is-invalid');
            $terms.closest('.form-check').find('.invalid-feedback').show();
            valid = false;
        } else {
            $terms.removeClass('is-invalid');
            $terms.closest('.form-check').find('.invalid-feedback').hide();
        }

        return valid;
    }

    
    $('input, select').on('input change', function () {
        if ($(this).hasClass('is-invalid')) {
            validateForm();
        }
    });

    
    $('#termsCheck').on('change', function () {
        if ($(this).is(':checked')) {
            $(this).removeClass('is-invalid');
            $(this).closest('.form-check').find('.invalid-feedback').hide();
        }
        $('#placeOrderBtn').prop('disabled', !this.checked);
    });

    
    $('input[name="paymentMethod"]').on('change', function () {
        if ($('#payCard').is(':checked')) {
            $('#cardFields').show();
            $('#cardFields input').prop('required', true);
        } else {
            $('#cardFields').hide();
            $('#cardFields input').prop('required', false).removeClass('is-invalid is-valid');
            $('#cardFields .invalid-feedback').text('');
        }
    }).trigger('change');

    
    $('#cardNumber').on('input', function () {
        let val = $(this).val().replace(/\D/g, '').slice(0, 16);
        $(this).val(val.replace(/(.{4})/g, '$1 ').trim());
    });

    
    $('#cardExpiry').on('input', function () {
        let val = $(this).val().replace(/\D/g, '').slice(0, 4);
        if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2);
        $(this).val(val);
    });

    
    $('.needs-validation').on('submit', function (e) {
        if (!validateForm()) {
            e.preventDefault();
            e.stopPropagation();
            
            const $firstError = $('.is-invalid:visible').first();
            if ($firstError.length) {
                $('html,body').animate({
                    scrollTop: $firstError.offset().top - 100
                }, 400, function () {
                    $firstError.focus();
                });
            }
        } else {
            e.preventDefault();
            alert('Order placed successfully!');
            window.location.href = 'index.html'; 
        }
    });
});