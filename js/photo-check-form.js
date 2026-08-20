// Photo Check lead form — submits directly to the Zone 0 Cloudflare Worker.
// See worker/README.md for the backend implementation and deployment steps.
(function () {
    var ENDPOINT = 'https://zone0-photo-check.zone0landscaping.workers.dev/submit';

    var MAX_FILES = 3;
    var MAX_FILE_SIZE = 8 * 1024 * 1024;
    var ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

    function initPhotoCheckForm() {
        var form = document.getElementById('photo-check-form');
        if (!form) return;

        var loadedAtField = document.getElementById('pc-loaded-at');
        var photosInput = document.getElementById('pc-photos');
        var photosSelected = document.getElementById('pc-photos-selected');
        var errorBox = document.getElementById('pc-form-error');
        var submitBtn = document.getElementById('pc-submit');
        var originalSubmitLabel = submitBtn.textContent;

        var modal = document.getElementById('pc-success-modal');
        var modalCloseX = document.getElementById('pc-success-close-x');
        var modalCloseBtn = document.getElementById('pc-success-close');

        if (loadedAtField) loadedAtField.value = String(Date.now());

        function getFocusableEls(container) {
            var els = container.querySelectorAll(
                'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
            );
            return Array.prototype.slice.call(els).filter(function (el) {
                return el.offsetParent !== null;
            });
        }

        function onModalKeydown(e) {
            if (e.key === 'Escape') {
                e.preventDefault();
                closeSuccessModal();
                return;
            }
            if (e.key === 'Tab') {
                var focusables = getFocusableEls(modal);
                if (focusables.length === 0) return;
                var first = focusables[0];
                var last = focusables[focusables.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        }

        function openSuccessModal() {
            modal.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');
            document.addEventListener('keydown', onModalKeydown);
            var focusables = getFocusableEls(modal);
            (focusables[0] || modal).focus();
        }

        function closeSuccessModal() {
            modal.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
            document.removeEventListener('keydown', onModalKeydown);

            // The submit button was disabled (and so lost focus) before the modal
            // opened, so it can't be used as a "return to opener" focus target
            // until it's re-enabled here, immediately before we focus it.
            submitBtn.disabled = false;
            submitBtn.textContent = originalSubmitLabel;
            submitBtn.focus();
        }

        modalCloseX.addEventListener('click', closeSuccessModal);
        modalCloseBtn.addEventListener('click', closeSuccessModal);

        function showError(message) {
            errorBox.textContent = message;
            errorBox.classList.remove('hidden');
        }

        function clearError() {
            errorBox.textContent = '';
            errorBox.classList.add('hidden');
        }

        function validateFiles(files) {
            if (files.length < 1) return 'Please choose at least 1 photo.';
            if (files.length > MAX_FILES) return 'Please choose no more than ' + MAX_FILES + ' photos.';
            for (var i = 0; i < files.length; i++) {
                if (ALLOWED_TYPES.indexOf(files[i].type) === -1) {
                    return '"' + files[i].name + '" is not a supported image type (use JPG, PNG, WEBP, or HEIC).';
                }
                if (files[i].size > MAX_FILE_SIZE) {
                    return '"' + files[i].name + '" is larger than 8MB.';
                }
            }
            return null;
        }

        photosInput.addEventListener('change', function () {
            clearError();
            photosSelected.innerHTML = '';
            var files = Array.prototype.slice.call(photosInput.files || []);
            var error = validateFiles(files);
            files.forEach(function (f) {
                var li = document.createElement('li');
                li.textContent = f.name + ' (' + Math.round(f.size / 1024) + ' KB)';
                photosSelected.appendChild(li);
            });
            if (error) showError(error);
        });

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            clearError();

            var files = Array.prototype.slice.call(photosInput.files || []);
            var fileError = validateFiles(files);
            if (fileError) {
                showError(fileError);
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending…';

            fetch(ENDPOINT, {
                method: 'POST',
                body: new FormData(form),
            })
                .then(function (res) {
                    return res.json().then(function (data) {
                        return { status: res.status, data: data };
                    });
                })
                .then(function (result) {
                    if (result.data && result.data.ok) {
                        // Submit button stays disabled until the modal is closed,
                        // preventing an accidental duplicate submission.
                        form.reset();
                        photosSelected.innerHTML = '';
                        if (loadedAtField) loadedAtField.value = String(Date.now());
                        openSuccessModal();
                        return;
                    }
                    showError((result.data && result.data.error) || 'Something went wrong. Please try again.');
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalSubmitLabel;
                })
                .catch(function () {
                    showError('We could not reach the server. Please check your connection and try again.');
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalSubmitLabel;
                });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPhotoCheckForm);
    } else {
        initPhotoCheckForm();
    }
})();
