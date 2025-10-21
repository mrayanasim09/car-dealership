module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/inventory',
        'http://localhost:3000/contact',
        'http://localhost:3000/about',
        'http://localhost:3000/faq'
      ],
      startServerCommand: 'npm run dev',
      startServerReadyPattern: 'ready - started server on',
      startServerReadyTimeout: 60000,
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0
        },
        screenEmulation: {
          mobile: false,
          width: 1350,
          height: 940,
          deviceScaleFactor: 1,
          disabled: false
        },
        emulatedUserAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.8 }],
        'categories:seo': ['warn', { minScore: 0.8 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 4000 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
        'speed-index': ['warn', { maxNumericValue: 3000 }],
        'interactive': ['warn', { maxNumericValue: 5000 }],
        'max-potential-fid': ['warn', { maxNumericValue: 130 }],
        'uses-http2': 'off',
        'uses-long-cache-ttl': 'off',
        'total-byte-weight': ['warn', { maxNumericValue: 5000000 }],
        'uses-optimized-images': 'off',
        'uses-text-compression': 'off',
        'uses-responsive-images': 'off',
        'efficient-animated-content': 'off',
        'unused-css-rules': 'off',
        'unused-javascript': 'off',
        'modern-image-formats': 'off',
        'uses-webp-images': 'off',
        'uses-avif-images': 'off',
        'preload-lcp-image': 'off',
        'font-display': 'off',
        'render-blocking-resources': 'off',
        'unminified-css': 'off',
        'unminified-javascript': 'off',
        'dom-size': 'off',
        'critical-request-chains': 'off',
        'user-timings': 'off',
        'bootup-time': 'off',
        'mainthread-work-breakdown': 'off',
        'font-display': 'off',
        'resource-summary': 'off',
        'third-party-summary': 'off',
        'largest-contentful-paint-element': 'off',
        'layout-shift-elements': 'off',
        'long-tasks': 'off',
        'non-composited-animations': 'off',
        'unsized-images': 'off'
      }
    },
    upload: {
      target: 'temporary-public-storage',
      token: process.env.LHCI_GITHUB_APP_TOKEN
    }
  }
}
