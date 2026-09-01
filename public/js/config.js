// =============================================
// GEO SOLUTION - GLOBAL CONFIGURATION
// =============================================

(function() {
    const hostname = window.location.hostname;
    
    // Detect if running locally
    const isLocal = hostname === 'localhost' || 
                    hostname === '127.0.0.1' ||
                    hostname === '::1' ||
                    hostname === '' ||
                    hostname.startsWith('192.168.') ||
                    hostname.startsWith('10.') ||
                    hostname.startsWith('172.') ||
                    hostname.includes('.local');

    // =============================================
    // 🔧 API URLs
    // =============================================
    const LOCAL_API = 'http://localhost:3000/api';
    // ✅ Production: Use relative path (same domain)
    const PRODUCTION_API = 'https://geosolutionv2.onrender.com';
    // =============================================

    // Set the global API base URL
    window.BASE_API = isLocal ? LOCAL_API : PRODUCTION_API;
    
    // Store the host for reference
    window.IS_LOCAL = isLocal;
    
    // Only log in development
    if (isLocal) {
        console.log('🌐 Geo Solution - API URL:', window.BASE_API);
        console.log('📱 Environment: Development');
    }
    
    // ✅ Make sure BASE_API is never undefined
    if (!window.BASE_API) {
        console.error('❌ BASE_API is undefined! Using fallback.');
        window.BASE_API = 'https://geosolutionv2.onrender.com';
    }
})();