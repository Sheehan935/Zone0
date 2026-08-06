(function () {
    var QUESTIONS = [
        'Is there mulch, bark, or dry leaf litter within 5 ft of your home’s foundation?',
        'Do any tree branches or shrubs overhang or touch your roof or siding?',
        'Are your attic, foundation, or eave vents uncovered by 1/8-inch metal mesh?',
        'Is a wood fence or gate directly attached to the house?',
        'Is there a buildup of dead leaves or pine needles in the gutters or on the roof?'
    ];

    var TIERS = [
        { max: 0, label: 'Low', color: '#2f855a', copy: 'No common ember-catch points identified in this quick check.' },
        { max: 2, label: 'Moderate', color: '#b7791f', copy: 'A few common ember-catch points to address near the structure.' },
        { max: 5, label: 'High', color: '#c0492f', copy: 'Several common ember-catch points identified — start with Zone 0, the 0–5 ft ring closest to the house.' }
    ];

    function tierFor(score) {
        for (var i = 0; i < TIERS.length; i++) {
            if (score <= TIERS[i].max) return TIERS[i];
        }
        return TIERS[TIERS.length - 1];
    }

    function formMarkup(uid) {
        var rows = QUESTIONS.map(function (q, i) {
            var name = uid + '-q' + i;
            return (
                '<div class="text-left py-4 border-b border-stone-200 last:border-b-0">' +
                    '<p class="text-sm text-stone-800 mb-3">' + (i + 1) + '. ' + q + '</p>' +
                    '<div class="flex gap-3">' +
                        '<label class="flex-1"><input type="radio" name="' + name + '" value="1" class="peer sr-only" required>' +
                            '<span class="block text-center text-xs uppercase tracking-widest font-bold border border-stone-300 rounded px-4 py-2 cursor-pointer peer-checked:bg-stone-900 peer-checked:text-white peer-checked:border-stone-900 transition-colors">Yes</span></label>' +
                        '<label class="flex-1"><input type="radio" name="' + name + '" value="0" class="peer sr-only" required>' +
                            '<span class="block text-center text-xs uppercase tracking-widest font-bold border border-stone-300 rounded px-4 py-2 cursor-pointer peer-checked:bg-stone-900 peer-checked:text-white peer-checked:border-stone-900 transition-colors">No</span></label>' +
                    '</div>' +
                '</div>'
            );
        }).join('');

        return (
            '<form class="risk-calculator-form bg-white border border-stone-200 rounded-lg p-6 sm:p-8">' +
                rows +
                '<button type="submit" class="mt-6 w-full bg-sage-default text-white p-3 text-xs uppercase tracking-widest font-bold hover:bg-sage-dark transition-colors">Calculate Score</button>' +
            '</form>' +
            '<div class="risk-calculator-result hidden bg-white border border-stone-200 rounded-lg p-6 sm:p-8 text-left"></div>'
        );
    }

    function resultMarkup(score, total) {
        var tier = tierFor(score);
        return (
            '<div class="text-center mb-6">' +
                '<span class="block text-5xl font-display font-bold" style="color:' + tier.color + '">' + score + '<span class="text-xl text-stone-400">/' + total + '</span></span>' +
                '<span class="block text-xs uppercase tracking-widest font-bold mt-2" style="color:' + tier.color + '">' + tier.label + ' ember-catch score</span>' +
            '</div>' +
            '<p class="text-sm text-stone-600 leading-relaxed mb-6 text-center max-w-md mx-auto">' + tier.copy + '</p>' +
            '<p class="text-xs text-stone-400 leading-relaxed text-center max-w-md mx-auto mb-6">This is a quick educational self-check based on common Zone 0 ember-ignition points, not a substitute for a professional inspection or official AB 3074 compliance verification.</p>' +
            '<div class="flex flex-col sm:flex-row gap-3 justify-center">' +
                '<a href="/zone-0/" class="text-center border border-stone-300 text-stone-900 px-6 py-3 text-xs uppercase tracking-widest font-bold hover:border-stone-900 transition-colors">Read the Zone 0 Guide</a>' +
                '<a href="#photo-check" class="text-center bg-stone-900 text-white px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-sage-default transition-colors">Get a Free Photo Check</a>' +
            '</div>'
        );
    }

    function mount(container, index) {
        if (container.dataset.riskCalculatorMounted) return;
        container.dataset.riskCalculatorMounted = 'true';

        var uid = 'risk-calc-' + index;
        container.innerHTML = formMarkup(uid);

        var form = container.querySelector('.risk-calculator-form');
        var result = container.querySelector('.risk-calculator-result');

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var score = 0;
            QUESTIONS.forEach(function (q, i) {
                var checked = form.querySelector('input[name="' + uid + '-q' + i + '"]:checked');
                if (checked) score += parseInt(checked.value, 10);
            });

            result.innerHTML = resultMarkup(score, QUESTIONS.length);
            form.classList.add('hidden');
            result.classList.remove('hidden');
        });
    }

    function initRiskCalculator() {
        var containers = document.querySelectorAll('#risk-calculator, .risk-calculator, .risk-calculator-container');
        containers.forEach(mount);
    }

    window.initRiskCalculator = initRiskCalculator;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initRiskCalculator);
    } else {
        initRiskCalculator();
    }
})();
