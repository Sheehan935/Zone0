(function () {
    var JURISDICTIONS = {
        berkeley: {
            name: 'City of Berkeley — EMBER Program',
            applies: 'Very-high-fire-hazard hillside areas (e.g. Grizzly Peak, Panoramic Hill)',
            points: [
                'EMBER ("Effective Mitigations for Berkeley’s Ember Resilience") is the city’s Zone 0 program, among the strictest in California.',
                'Prohibits combustible plants and materials within 5 ft of structures in designated very-high-hazard hillside areas.',
                'Provides free ember-resistant vent mesh to eligible homes in the highest-hazard areas.',
                'Effective January 1, 2026.'
            ],
            link: { label: 'Berkeley FireSafe — Create Defensible Space', url: 'https://www.berkeleyfiresafe.org/firesafe/create-defensible-space' }
        },
        oakland: {
            name: 'City of Oakland — Wildfire Prevention Assessment District',
            applies: 'Oakland Hills, Very High Fire Hazard Severity Zone',
            points: [
                'Properties in the VHFHSZ must maintain defensible space out to 100 ft under state law (Public Resources Code 4291).',
                'Oakland Fire Department inspects annually; repeated non-compliance can lead to fines or a misdemeanor citation.',
                'The Wildfire Prevention Assessment District (est. 2004) separately funds vegetation management on city-owned hillside land.',
                'Wildfire prevention unit: 510-238-7388 · wildfireprevention@oaklandca.gov'
            ],
            link: { label: 'Oakland Wildfire Guide — Property', url: 'https://oaklandside.org/oakland-wildfire-guide/property/' }
        },
        moraga_orinda: {
            name: 'Moraga-Orinda Fire District — Ordinance No. 23-03',
            applies: 'All State and Local Responsibility Areas within the district',
            points: [
                'Zone 0 (0–5 ft, the "Ember Resistant Zone"): remove all combustible ground cover (mulch, bark) within 2 ft of structures, keep 1 ft of vertical clearance on any plants within 2 ft, remove dead or dying trees, and remove any Monterey Pine or Eucalyptus within 5 ft.',
                'Provides free wildfire-resistant vent mesh and gutter guards to eligible residents.',
                'Compliance documentation is required prior to a property sale.'
            ],
            link: { label: 'MOFD Defensible Space Ordinance No. 23-03', url: 'https://www.cityoforinda.gov/DocumentCenter/View/4107/MOFD-Defensible-Space-Ordinance-No-23-03' }
        },
        san_ramon: {
            name: 'San Ramon Valley Fire Protection District',
            applies: 'Alamo, Blackhawk, Danville, Diablo, San Ramon, and Tassajara Valley',
            points: [
                'Enforces California’s state Zone 0 / defensible space standards (including AB 3074) rather than a separate district-specific ordinance.',
                'Conducts mandatory defensible-space inspections at real-estate transfer.'
            ],
            link: { label: 'SRVFPD — Real Estate Defensible Space Inspections', url: 'https://www.firedepartment.org/our-district/community-risk-reduction/exterior-hazard-abatement/real-estate-defensible-space-inspections' }
        },
        marin: {
            name: 'Southern Marin Fire Protection District',
            applies: 'Mill Valley, Tam Valley, Almonte, Homestead Valley, Alto, and Marin City',
            points: [
                'Follows the state’s Zone 0 (0–5 ft) standard as the property’s most critical ember-ignition buffer.',
                'Home-hardening features — vents, roofing, decks, fencing — are assessed as part of defensible-space inspections.'
            ],
            link: { label: 'SMFD — Defensible Space', url: 'https://www.smfd.org/our-district/prevention/vegetation-management/defensible-space' }
        },
        pasadena: {
            name: 'City of Pasadena — Ordinance No. 7451',
            applies: 'Very High Fire Hazard Severity Zone',
            points: [
                'Amends Pasadena Municipal Code §14.28.500 to expand brush clearance and wildfire mitigation requirements.',
                'Grass and native brush must be cut to 3 in.; only non-ferrous, non-sparking blades are allowed; no clearance work on Red Flag days.',
                'Hazardous vegetation must be cleared within 200 ft of structures (10 ft around combustible fences/driveways) ahead of the annual Brush Clearance Inspection Sweep.'
            ],
            link: { label: 'Pasadena Fire Hazard Severity Zones', url: 'https://www.cityofpasadena.net/fire/fire-hazard-severity-zones/' }
        }
    };

    function cardMarkup(data) {
        var items = data.points.map(function (p) {
            return '<li class="flex gap-3 text-sm text-stone-300 leading-relaxed"><i class="fa-solid fa-check text-sage-light mt-1 text-xs flex-shrink-0"></i><span>' + p + '</span></li>';
        }).join('');

        return (
            '<div class="bg-stone-900 border border-stone-800 rounded-lg p-6 sm:p-8 text-left">' +
                '<h3 class="text-xl font-display font-bold text-white mb-1">' + data.name + '</h3>' +
                '<p class="text-xs uppercase tracking-widest font-bold text-stone-500 mb-6">' + data.applies + '</p>' +
                '<ul class="space-y-3 mb-6">' + items + '</ul>' +
                '<a href="' + data.link.url + '" target="_blank" rel="noopener" class="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-sage-light hover:text-white transition-colors">' +
                    data.link.label + ' <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>' +
                '</a>' +
                '<p class="text-xs text-stone-500 leading-relaxed mt-6 pt-6 border-t border-stone-800">Ordinances and enforcement details change. Confirm current requirements directly with this fire authority before relying on this summary for compliance.</p>' +
            '</div>'
        );
    }

    function render(key, card) {
        var data = JURISDICTIONS[key];
        if (!data) return;
        card.innerHTML = cardMarkup(data);
    }

    function initOrdinanceLookup() {
        var select = document.getElementById('city-ordinance-select');
        var card = document.getElementById('ordinance-details-card');
        if (!select || !card) return;

        render(select.value, card);
        select.addEventListener('change', function () {
            render(select.value, card);
        });
    }

    window.initOrdinanceLookup = initOrdinanceLookup;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initOrdinanceLookup);
    } else {
        initOrdinanceLookup();
    }
})();
