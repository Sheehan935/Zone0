// Photo Check lead form — submits directly to the Zone 0 Cloudflare Worker.
// See worker/README.md for the backend implementation and deployment steps.
(function () {
    var ENDPOINT = 'https://zone0-photo-check.zone0landscaping.workers.dev/submit';

    var ZONES = ['front', 'back', 'left', 'right'];
    var ZONE_LABELS = { front: 'front', back: 'back', left: 'left side', right: 'right side' };
    var MAX_FILES_PER_ZONE = 5;
    var MAX_FILE_SIZE = 8 * 1024 * 1024;
    var ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

    function initPhotoCheckForm() {
        var form = document.getElementById('photo-check-form');
        if (!form) return;

        var loadedAtField = document.getElementById('pc-loaded-at');
        var submitBtn = document.getElementById('pc-submit');
        var originalSubmitLabel = submitBtn.textContent;

        var modal = document.getElementById('pc-success-modal');
        var modalCloseX = document.getElementById('pc-success-close-x');
        var modalCloseBtn = document.getElementById('pc-success-close');

        var steps = { 1: document.getElementById('pc-step-1'), 2: document.getElementById('pc-step-2'), 3: document.getElementById('pc-step-3') };
        var progressBars = { 1: document.getElementById('pc-progress-1'), 2: document.getElementById('pc-progress-2'), 3: document.getElementById('pc-progress-3') };
        var progressLabels = { 1: document.getElementById('pc-progress-label-1'), 2: document.getElementById('pc-progress-label-2'), 3: document.getElementById('pc-progress-label-3') };

        var zoneFiles = { front: [], back: [], left: [], right: [] };

        if (loadedAtField) loadedAtField.value = String(Date.now());

        // ---- Step navigation ------------------------------------------------

        function goToStep(n) {
            [1, 2, 3].forEach(function (i) {
                steps[i].classList.toggle('hidden', i !== n);
                progressBars[i].classList.toggle('bg-sage-default', i <= n);
                progressBars[i].classList.toggle('bg-stone-200', i > n);
                progressLabels[i].classList.toggle('text-sage-dark', i === n);
                progressLabels[i].classList.toggle('font-bold', i === n);
                progressLabels[i].classList.toggle('text-stone-400', i !== n);
            });
            steps[n].scrollIntoView({ block: 'nearest' });
        }

        function showStepError(el, message) {
            el.textContent = message;
            el.classList.remove('hidden');
        }

        function clearStepError(el) {
            el.textContent = '';
            el.classList.add('hidden');
        }

        // ---- Step 1: property info -------------------------------------------

        var step1Error = document.getElementById('pc-step1-error');

        document.getElementById('pc-step1-next').addEventListener('click', function () {
            clearStepError(step1Error);
            var name = document.getElementById('pc-name').value.trim();
            var phone = document.getElementById('pc-phone').value.trim();
            var email = document.getElementById('pc-email').value.trim();
            var address = document.getElementById('pc-address').value.trim();

            if (!name) return showStepError(step1Error, 'Please enter your name.');
            if (!phone || phone.replace(/\D/g, '').length < 7) return showStepError(step1Error, 'Please enter a valid phone number.');
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showStepError(step1Error, 'Please enter a valid email.');
            if (!address) return showStepError(step1Error, 'Please enter your property address.');

            goToStep(2);
        });

        // ---- Step 2: per-zone photo capture ----------------------------------

        var step2Error = document.getElementById('pc-step2-error');
        var zonesProgress = document.getElementById('pc-zones-progress');
        var step2Next = document.getElementById('pc-step2-next');

        function validateNewFiles(files) {
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

        function renderZoneThumbs(zone) {
            var container = document.getElementById('pc-thumbs-' + zone);
            container.innerHTML = '';
            zoneFiles[zone].forEach(function (file, index) {
                var url = URL.createObjectURL(file);
                var wrap = document.createElement('div');
                wrap.className = 'relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border border-stone-200';
                wrap.innerHTML =
                    '<img src="' + url + '" alt="" class="w-full h-full object-cover">' +
                    '<button type="button" aria-label="Remove photo" class="pc-remove-photo absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-stone-950/70 text-white flex items-center justify-center text-[10px]">' +
                    '<i class="fa-solid fa-xmark" aria-hidden="true"></i></button>';
                wrap.querySelector('.pc-remove-photo').addEventListener('click', function () {
                    URL.revokeObjectURL(url);
                    zoneFiles[zone].splice(index, 1);
                    renderZoneThumbs(zone);
                    updateZoneProgress();
                });
                container.appendChild(wrap);
            });
            document.getElementById('pc-count-' + zone).textContent = zoneFiles[zone].length + (zoneFiles[zone].length === 1 ? ' photo' : ' photos');
        }

        function updateZoneProgress() {
            var covered = ZONES.filter(function (z) { return zoneFiles[z].length > 0; }).length;
            zonesProgress.textContent = covered + ' of 4 areas covered — at least 1 photo needed per area';
            var ready = covered === ZONES.length;
            step2Next.disabled = !ready;
            step2Next.classList.toggle('bg-sage-default', ready);
            step2Next.classList.toggle('text-white', ready);
            step2Next.classList.toggle('hover:bg-sage-dark', ready);
            step2Next.classList.toggle('bg-stone-200', !ready);
            step2Next.classList.toggle('text-stone-400', !ready);
        }

        ZONES.forEach(function (zone) {
            var addBtn = document.querySelector('.pc-add-photo[data-zone="' + zone + '"]');
            var input = document.getElementById('pc-photos-' + zone);

            addBtn.addEventListener('click', function () {
                input.click();
            });

            input.addEventListener('change', function () {
                clearStepError(step2Error);
                var incoming = Array.prototype.slice.call(input.files || []);
                var error = validateNewFiles(incoming);
                if (error) {
                    showStepError(step2Error, error);
                    input.value = '';
                    return;
                }
                var room = MAX_FILES_PER_ZONE - zoneFiles[zone].length;
                if (incoming.length > room) {
                    showStepError(step2Error, 'Up to ' + MAX_FILES_PER_ZONE + ' photos are allowed per side — only added the first ' + Math.max(room, 0) + '.');
                }
                zoneFiles[zone] = zoneFiles[zone].concat(incoming.slice(0, room));
                input.value = '';
                renderZoneThumbs(zone);
                updateZoneProgress();
            });
        });

        document.getElementById('pc-step2-back').addEventListener('click', function () {
            goToStep(1);
        });

        step2Next.addEventListener('click', function () {
            if (step2Next.disabled) return;
            goToStep(3);
        });

        // ---- Step 3: concerns + submit ---------------------------------------

        var errorBox = document.getElementById('pc-form-error');

        function showError(message) {
            errorBox.textContent = message;
            errorBox.classList.remove('hidden');
        }

        function clearError() {
            errorBox.textContent = '';
            errorBox.classList.add('hidden');
        }

        document.getElementById('pc-step3-back').addEventListener('click', function () {
            goToStep(2);
        });

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

        function resetForm() {
            form.reset();
            ZONES.forEach(function (zone) {
                zoneFiles[zone] = [];
                renderZoneThumbs(zone);
            });
            updateZoneProgress();
            if (loadedAtField) loadedAtField.value = String(Date.now());
            goToStep(1);
        }

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            clearError();

            var totalPhotos = ZONES.reduce(function (sum, z) { return sum + zoneFiles[z].length; }, 0);
            if (totalPhotos === 0) {
                showError('Please add at least one photo per side before submitting.');
                goToStep(2);
                return;
            }

            var fd = new FormData(form);
            ZONES.forEach(function (zone) {
                zoneFiles[zone].forEach(function (file) {
                    fd.append('photos_' + zone, file, file.name);
                });
            });

            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending…';

            fetch(ENDPOINT, {
                method: 'POST',
                body: fd,
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
                        resetForm();
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

        updateZoneProgress();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPhotoCheckForm);
    } else {
        initPhotoCheckForm();
    }
})();
