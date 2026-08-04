document.addEventListener('DOMContentLoaded', () => {
    // Inject Modal HTML into the body
    const modalHTML = `
    <div id="photo-modal" class="fixed inset-0 bg-stone-900/80 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
        <div class="bg-white border border-stone-200 max-w-lg w-full p-8 shadow-2xl relative">
            <button id="close-modal" class="absolute top-4 right-4 text-stone-400 hover:text-stone-900 text-xl font-bold">
                <i class="fa-solid fa-xmark"></i>
            </button>
            <span class="text-[10px] uppercase tracking-widest font-bold text-sage-default block mb-2">Free Property Review</span>
            <h3 class="text-2xl font-display font-bold text-stone-900 mb-2">Upload Your Zone 0 Photo</h3>
            <p class="text-sm text-stone-600 mb-6">Send us a photo of your foundation line or landscaping. We will review it for ember traps and AB 3074 compliance.</p>
            
            <form id="photo-check-form" class="space-y-4">
                <div>
                    <label class="block text-xs uppercase tracking-wider font-bold text-stone-700 mb-1">Your Name</label>
                    <input type="text" required placeholder="Jane Doe" class="w-full bg-stone-50 border border-stone-200 p-3 text-sm focus:outline-none focus:border-sage-default">
                </div>
                <div>
                    <label class="block text-xs uppercase tracking-wider font-bold text-stone-700 mb-1">Email Address</label>
                    <input type="email" required placeholder="jane@example.com" class="w-full bg-stone-50 border border-stone-200 p-3 text-sm focus:outline-none focus:border-sage-default">
                </div>
                <div>
                    <label class="block text-xs uppercase tracking-wider font-bold text-stone-700 mb-1">Property Photo</label>
                    <input type="file" accept="image/*" required class="w-full bg-stone-50 border border-stone-200 p-2 text-xs text-stone-600 focus:outline-none">
                </div>
                <div>
                    <label class="block text-xs uppercase tracking-wider font-bold text-stone-700 mb-1">Notes / City (Optional)</label>
                    <textarea rows="2" placeholder="e.g. Oakland Hills, concerns about bark mulch..." class="w-full bg-stone-50 border border-stone-200 p-3 text-sm focus:outline-none focus:border-sage-default"></textarea>
                </div>
                <button type="submit" class="w-full bg-stone-900 text-white p-3 text-xs uppercase tracking-widest font-bold hover:bg-sage-default transition-colors">
                    Submit Photo for Review
                </button>
            </form>
        </div>
    </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('photo-modal');
    const closeBtn = document.getElementById('close-modal');

    // Open modal when any link targeting #photo-check or carrying class 'open-photo-modal' is clicked
    document.querySelectorAll('a[href="#photo-check"], .open-photo-modal, a:contains("Free Photo Check")').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.remove('hidden');
        });
    });

    // Close logic
    if (closeBtn) {
        closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
    }
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.add('hidden');
    });
});
