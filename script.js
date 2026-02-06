class ConfessionPage {
    constructor() {
        this.textarea = document.getElementById('thoughtDump');
        this.ashCanvas = document.getElementById('ashCanvas');
        this.fadeOverlay = document.getElementById('fadeOverlay');
        this.ctx = this.ashCanvas.getContext('2d');
        this.confessionCountDisplay = document.getElementById('confessionCount');
        
        this.idleTimeout = null;
        this.idleTime = 10000; // 10 seconds
        this.isTyping = false;
        this.isBurning = false;
        
        this.ashes = [];
        this.animationId = null;
        
        // Load confession count from localStorage
        this.loadConfessionCount();
        
        this.setupCanvas();
        this.attachEventListeners();
    }
    
    loadConfessionCount() {
        const count = localStorage.getItem('confessionCount') || '0';
        this.confessionCountDisplay.textContent = count;
    }
    
    incrementConfessionCount() {
        const currentCount = parseInt(localStorage.getItem('confessionCount') || '0');
        const newCount = currentCount + 1;
        localStorage.setItem('confessionCount', newCount);
        this.confessionCountDisplay.textContent = newCount;
    }
    
    setupCanvas() {
        this.ashCanvas.width = this.ashCanvas.offsetWidth;
        this.ashCanvas.height = this.ashCanvas.offsetHeight;
        window.addEventListener('resize', () => {
            this.ashCanvas.width = this.ashCanvas.offsetWidth;
            this.ashCanvas.height = this.ashCanvas.offsetHeight;
        });
    }
    
    attachEventListeners() {
        this.textarea.addEventListener('input', (e) => this.handleInput(e));
        this.textarea.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('click', () => this.handleInput());
        document.addEventListener('touchstart', () => this.handleInput());
    }
    
    handleKeyDown(event) {
        // Prevent any input during burning
        if (this.isBurning) {
            event.preventDefault();
            return;
        }
        
        // No typing sound - just silent writing
    }
    
    handleInput() {
        if (this.isBurning) return;
        
        // Clear existing timeout
        if (this.idleTimeout) {
            clearTimeout(this.idleTimeout);
        }
        
        // User is typing
        this.isTyping = true;
        
        // Set new timeout for burning
        this.idleTimeout = setTimeout(() => {
            this.startBurn();
        }, this.idleTime);
    }
    
    startBurn() {
        if (this.isBurning || !this.textarea.value.trim()) return;
        
        this.isBurning = true;
        this.isTyping = false;
        
        // Disable textarea - cannot type, no undo
        this.textarea.disabled = true;
        this.textarea.style.cursor = 'not-allowed';
        
        // Add fade animation to textarea
        this.textarea.classList.add('burning');
        
        // After fade completes, fade to white overlay
        setTimeout(() => {
            this.fadeToWhite();
        }, 2000);
    }
    
    fadeToWhite() {
        this.fadeOverlay.classList.add('fading');
        
        // After fade completes, clear everything and reset
        setTimeout(() => {
            this.resetPage();
        }, 4000);
    }
    
    resetPage() {
        // Increment confession counter for completed confession
        this.incrementConfessionCount();
        
        // Clear textarea
        this.textarea.value = '';
        this.textarea.classList.remove('burning');
        
        // Re-enable textarea for next entry
        this.textarea.disabled = false;
        this.textarea.style.cursor = 'text';
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.ashCanvas.width, this.ashCanvas.height);
        this.ashes = [];
        
        // Reset fade overlay
        this.fadeOverlay.classList.remove('fading');
        
        // Reset states
        this.isBurning = false;
        this.isTyping = false;
        
        // Focus on textarea for next entry - silent, no message
        setTimeout(() => {
            this.textarea.focus();
        }, 300);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ConfessionPage();
});
