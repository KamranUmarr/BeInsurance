// ...existing code...
// Remove previous code, replace with the following:

$(function () {
    // Bootstrap validation fallback for browsers without HTML5 validation
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

        // Full Name
        const $fullname = $('#fullname');
        const fullnameVal = $fullname.val().trim();
        if (fullnameVal.length < 3) {
            validateField($fullname, false, 'Please enter at least 3 characters.');
            valid = false;
        } else {
            validateField($fullname, true, '');
        }

        // Email
        const $email = $('#email');
        const emailVal = $email.val().trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailVal)) {
            validateField($email, false, 'Please enter a valid email.');
            valid = false;
        } else {
            validateField($email, true, '');
        }

        // Phone
        const $phone = $('#phone');
        const phoneVal = $phone.val().replace(/\D/g, '');
        if (phoneVal.length < 10) {
            validateField($phone, false, 'Please enter at least 10 digits.');
            valid = false;
        } else {
            validateField($phone, true, '');
        }

        // Address
        const $address = $('#address');
        if ($address.val().trim() === '') {
            validateField($address, false, 'Please enter your address.');
            valid = false;
        } else {
            validateField($address, true, '');
        }

        // City
        const $city = $('#city');
        if ($city.val().trim() === '') {
            validateField($city, false, 'Please enter your city.');
            valid = false;
        } else {
            validateField($city, true, '');
        }

        // Postal Code
        const $postal = $('#postal');
        const postalVal = $postal.val().trim();
        if (!/^\d{4,6}$/.test(postalVal)) {
            validateField($postal, false, 'Postal code must be 4-6 digits.');
            valid = false;
        } else {
            validateField($postal, true, '');
        }

        // Country
        const $country = $('#country');
        if (!$country.val() || $country.val() === '') {
            $country.removeClass('is-valid').addClass('is-invalid');
            $country.parent().find('.invalid-feedback').text('Select a country.');
            valid = false;
        } else {
            $country.removeClass('is-invalid').addClass('is-valid');
            $country.parent().find('.invalid-feedback').text('');
        }

        // Payment Method
        const $payment = $('input[name="paymentMethod"]:checked');
        if ($payment.length === 0) {
            $('input[name="paymentMethod"]').addClass('is-invalid');
            valid = false;
        } else {
            $('input[name="paymentMethod"]').removeClass('is-invalid');
        }

        // Card fields (if Card selected)
        if ($('#payCard').is(':checked')) {
            // Cardholder Name
            const $cardName = $('#cardName');
            if ($cardName.val().trim().length < 3) {
                validateField($cardName, false, 'Enter cardholder name.');
                valid = false;
            } else {
                validateField($cardName, true, '');
            }
            // Card Number
            const $cardNumber = $('#cardNumber');
            const cardNumVal = $cardNumber.val().replace(/\s/g, '');
            if (!/^\d{13,19}$/.test(cardNumVal)) {
                validateField($cardNumber, false, 'Enter valid card number.');
                valid = false;
            } else {
                validateField($cardNumber, true, '');
            }
            // Expiry
            const $cardExpiry = $('#cardExpiry');
            if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test($cardExpiry.val())) {
                validateField($cardExpiry, false, 'MM/YY');
                valid = false;
            } else {
                validateField($cardExpiry, true, '');
            }
            // CVV
            const $cardCVV = $('#cardCVV');
            if (!/^\d{3,4}$/.test($cardCVV.val())) {
                validateField($cardCVV, false, 'CVV');
                valid = false;
            } else {
                validateField($cardCVV, true, '');
            }
        }

        // Terms
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

    // Remove error on input
    $('input, select').on('input change', function () {
        if ($(this).hasClass('is-invalid')) {
            validateForm();
        }
    });

    // Hide error on terms check
    $('#termsCheck').on('change', function () {
        if ($(this).is(':checked')) {
            $(this).removeClass('is-invalid');
            $(this).closest('.form-check').find('.invalid-feedback').hide();
        }
        $('#placeOrderBtn').prop('disabled', !this.checked);
    });

    // Payment method toggle
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

    // Card number mask
    $('#cardNumber').on('input', function () {
        let val = $(this).val().replace(/\D/g, '').slice(0, 16);
        $(this).val(val.replace(/(.{4})/g, '$1 ').trim());
    });

    // Card expiry mask
    $('#cardExpiry').on('input', function () {
        let val = $(this).val().replace(/\D/g, '').slice(0, 4);
        if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2);
        $(this).val(val);
    });

    // On submit
    $('.needs-validation').on('submit', function (e) {
        if (!validateForm()) {
            e.preventDefault();
            e.stopPropagation();
            // Scroll to first error
            const $firstError = $('.is-invalid:visible').first();
            if ($firstError.length) {
                $('html,body').animate({
                    scrollTop: $firstError.offset().top - 100
                }, 400, function () {
                    $firstError.focus();
                });
            }
        }
    });
});