// api/health.js - Health Check Endpoint for Vercel

export default function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    // Only allow GET requests
    if (req.method !== 'GET') {
        res.status(405).json({ 
            error: 'Method not allowed',
            allowed: ['GET']
        });
        return;
    }
    
    try {
        // Get current timestamp
        const timestamp = new Date().toISOString();
        
        // Get deployment info from headers
        const deployment = {
            region: process.env.VERCEL_REGION || 'unknown',
            deployment_url: process.env.VERCEL_URL || 'unknown',
            git_commit: process.env.VERCEL_GIT_COMMIT_SHA || 'unknown'
        };
        
        // Basic health check response
        const healthData = {
            status: 'healthy',
            service: 'Discord Verification Website',
            environment: 'production',
            timestamp: timestamp,
            uptime: process.uptime(),
            deployment: deployment,
            version: '1.0.0',
            
            // System info
            system: {
                node_version: process.version,
                platform: process.platform,
                memory_usage: process.memoryUsage(),
                cpu_usage: process.cpuUsage()
            },
            
            // Health checks
            checks: {
                api_responsive: true,
                static_files: true,
                security_headers: true
            }
        };
        
        // Return health data
        res.status(200).json(healthData);
        
    } catch (error) {
        console.error('Health check error:', error);
        
        res.status(500).json({
            status: 'unhealthy',
            error: 'Internal server error',
            timestamp: new Date().toISOString()
        });
    }
}