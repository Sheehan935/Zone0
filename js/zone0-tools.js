(function () {
    var QUESTIONS = [
        {
            text: 'Is there mulch, bark, or dry leaf litter within 5 ft of your home’s foundation?',
            issueLabel: 'Combustible material touching the foundation',
            action: 'Swap mulch, bark, or leaf litter for gravel or decomposed granite within the first 5 ft.',
            priority: 2
        },
        {
            text: 'Do any tree branches or shrubs overhang or touch your roof or siding?',
            issueLabel: 'Vegetation in contact with the structure',
            action: 'Cut back any branches or shrubs touching the roof, eaves, or siding.',
            priority: 3
        },
        {
            text: 'Are your attic, foundation, or eave vents uncovered by 1/8-inch metal mesh?',
            issueLabel: 'Unscreened vents',
            action: 'Cover attic, foundation, and eave vents with 1/8-inch metal mesh to block ember entry.',
            priority: 1
        },
        {
            text: 'Is a wood fence or gate directly attached to the house?',
            issueLabel: 'Wood fence attached to the house',
            action: 'Isolate or replace the first 5 ft of an attached wood fence with a non-combustible section.',
            priority: 4
        },
        {
            text: 'Is there a buildup of dead leaves or pine needles in the gutters or on the roof?',
            issueLabel: 'Debris buildup in gutters or on the roof',
            action: 'Clear dead leaves and pine needles from gutters and roof valleys.',
            priority: 5
        }
    ];

    var TIERS = [
        { max: 0, label: 'Low', color: '#2f855a', copy: 'None of the five most common ember-catch conditions were flagged. That’s a good sign — routine upkeep (mulch checks, gutter clearing) is what keeps it that way.' },
        { max: 2, label: 'Moderate', color: '#b7791f', copy: 'A couple of these common conditions are worth addressing. Neither is urgent on its own, but each is a real ember-catch point near the structure.' },
        { max: 5, label: 'High', color: '#c0492f', copy: 'Several of the most common ember-catch conditions are present. These are the conditions that most often let embers into the first five feet — worth prioritizing soon.' }
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
                    '<p class="text-sm text-stone-800 mb-3"><span class="text-stone-400 font-semibold">' + (i + 1) + '/' + QUESTIONS.length + '</span> &nbsp;' + q.text + '</p>' +
                    '<div class="flex gap-3">' +
                        '<label class="flex-1"><input type="radio" name="' + name + '" value="1" class="peer sr-only risk-calc-answer" required>' +
                            '<span class="block text-center text-xs uppercase tracking-widest font-bold border border-stone-300 rounded px-4 py-2 cursor-pointer peer-checked:bg-stone-900 peer-checked:text-white peer-checked:border-stone-900 transition-colors">Yes</span></label>' +
                        '<label class="flex-1"><input type="radio" name="' + name + '" value="0" class="peer sr-only risk-calc-answer" required>' +
                            '<span class="block text-center text-xs uppercase tracking-widest font-bold border border-stone-300 rounded px-4 py-2 cursor-pointer peer-checked:bg-stone-900 peer-checked:text-white peer-checked:border-stone-900 transition-colors">No</span></label>' +
                    '</div>' +
                '</div>'
            );
        }).join('');

        return (
            '<form class="risk-calculator-form bg-white border border-stone-200 rounded-lg p-6 sm:p-8">' +
                '<div class="compliance-progress-track"><div class="compliance-progress-fill risk-calc-progress-fill"></div></div>' +
                '<p class="risk-calc-progress-text text-[11px] uppercase tracking-widest font-bold text-stone-400 -mt-4 mb-6">0 of ' + QUESTIONS.length + ' answered</p>' +
                rows +
                '<button type="submit" class="mt-6 w-full bg-sage-default text-white p-3 text-xs uppercase tracking-widest font-bold rounded-full hover:bg-sage-dark transition-colors">See My Risk Snapshot</button>' +
            '</form>' +
            '<div class="risk-calculator-result hidden bg-white border border-stone-200 rounded-lg p-6 sm:p-8 text-left"></div>'
        );
    }

    function priorityMarkup(answers) {
        var flagged = QUESTIONS
            .filter(function (q, i) { return answers[i] === 1; })
            .sort(function (a, b) { return a.priority - b.priority; });

        if (flagged.length === 0) {
            return '';
        }

        var top = flagged[0];
        var rest = flagged.slice(1);

        var restMarkup = rest.length
            ? '<p class="text-xs text-stone-500 mt-3">Also worth a look: ' + rest.map(function (q) { return q.issueLabel; }).join('; ') + '.</p>'
            : '';

        return (
            '<div class="science-callout text-left mb-6">' +
                '<h4>Highest-Priority Fix</h4>' +
                '<p class="font-semibold text-stone-900 mb-1">' + top.issueLabel + '</p>' +
                '<p>' + top.action + '</p>' +
                restMarkup +
            '</div>'
        );
    }

    function resultMarkup(score, total, answers) {
        var tier = tierFor(score);
        return (
            '<div class="text-center mb-6">' +
                '<span class="text-[10px] uppercase tracking-widest font-bold text-stone-400 block mb-1">Your Risk Snapshot</span>' +
                '<span class="block text-5xl font-display font-bold" style="color:' + tier.color + '">' + score + '<span class="text-xl text-stone-400">/' + total + '</span></span>' +
                '<span class="block text-xs uppercase tracking-widest font-bold mt-2" style="color:' + tier.color + '">' + tier.label + ' Risk</span>' +
            '</div>' +
            '<p class="text-sm text-stone-600 leading-relaxed mb-6">' + tier.copy + '</p>' +
            priorityMarkup(answers) +
            '<div class="border-t border-stone-100 pt-6">' +
                '<p class="text-xs font-bold uppercase tracking-widest text-stone-500 mb-3">What to Do Next</p>' +
                '<a href="#compliance-checklist-section" class="risk-calc-open-checklist block text-center bg-stone-900 text-white px-6 py-3 text-xs uppercase tracking-widest font-bold rounded-full hover:bg-sage-default transition-colors mb-4">Work Through the Compliance Checklist</a>' +
                '<p class="text-center text-xs text-stone-500">Want a second set of eyes? <a href="#photo-check" class="font-bold text-sage-dark hover:text-sage-default underline underline-offset-2">Get a free Photo Check</a>.</p>' +
            '</div>' +
            '<p class="text-xs text-stone-400 leading-relaxed text-center mt-6">This is a quick educational self-check based on common Zone 0 ember-ignition points, not a substitute for a professional inspection or official AB 3074 compliance verification.</p>'
        );
    }

    function mount(container, index) {
        if (container.dataset.riskCalculatorMounted) return;
        container.dataset.riskCalculatorMounted = 'true';

        var uid = 'risk-calc-' + index;
        container.innerHTML = formMarkup(uid);

        var form = container.querySelector('.risk-calculator-form');
        var result = container.querySelector('.risk-calculator-result');
        var progressFill = form.querySelector('.risk-calc-progress-fill');
        var progressText = form.querySelector('.risk-calc-progress-text');

        function updateProgress() {
            var answeredCount = 0;
            QUESTIONS.forEach(function (q, i) {
                if (form.querySelector('input[name="' + uid + '-q' + i + '"]:checked')) answeredCount++;
            });
            progressFill.style.width = (answeredCount / QUESTIONS.length * 100) + '%';
            progressText.textContent = answeredCount + ' of ' + QUESTIONS.length + ' answered';
        }

        form.querySelectorAll('.risk-calc-answer').forEach(function (input) {
            input.addEventListener('change', updateProgress);
        });

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var answers = [];
            var score = 0;
            QUESTIONS.forEach(function (q, i) {
                var checked = form.querySelector('input[name="' + uid + '-q' + i + '"]:checked');
                var value = checked ? parseInt(checked.value, 10) : 0;
                answers.push(value);
                score += value;
            });

            result.innerHTML = resultMarkup(score, QUESTIONS.length, answers);
            result.style.borderLeftColor = tierFor(score).color;
            result.style.borderLeftWidth = '4px';
            form.classList.add('hidden');
            result.classList.remove('hidden');

            var openChecklistLink = result.querySelector('.risk-calc-open-checklist');
            if (openChecklistLink) {
                openChecklistLink.addEventListener('click', function () {
                    var checklistSection = document.getElementById('compliance-checklist-section');
                    if (checklistSection && 'open' in checklistSection) checklistSection.open = true;
                });
            }

            result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
