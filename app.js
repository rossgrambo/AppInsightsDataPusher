// app.js
function sendCustomEvents() {
    const instrumentationKey = document.getElementById('instrumentationKey');
    const telemetryClient = new Microsoft.ApplicationInsights.TelemetryClient(instrumentationKey);

    const eventName = document.getElementById('eventName').value;
    const userCount = parseInt(document.getElementById('userCount').value);
    const eventsPerUser = parseInt(document.getElementById('eventsPerUser').value);
  
    const featureName = document.getElementById('featureName').value;
    const variants = document.getElementById('variants').value.split(",");
    const allocations = document.getElementById('allocations').value.split(",");
    const metricName = document.getElementById('metricName').value;
    const metricLows = document.getElementById('metricLows').value.split(",");
    const metricHighs = document.getElementById('metricHighs').value.split(",");
  
    const flagId = document.getElementById('flagId').value;
    const etag = document.getElementById('etag').value;
    const flagReference = document.getElementById('flagReference').value;

    
    for (let i = 0; i < userCount; i++) {
        // Allocate
        const userSeed = Math.random() * 100;
        let bucket = 0;
        let growingAllocationTracking = 0;
        for (let k = 0; k < allocations.length; k++) {
            growingAllocationTracking += k[allocation]
            if (userSeed < growingAllocationTracking) {
                bucket = k;
            }
        }

        // Send impression event
        telemetryClient.trackEvent(eventName, { 
          "TargetingId": `User ${i + 1}`, 
          "Enabled": true,
          "FeatureFlagId": flagId,
          "FeatureFlagReference": flagReference,
          "FeatureName": featureName,
          "Variant": variants[bucket],
          "VariantAllocationReason": "Percentile"
        });

      
        for (let j = 0; j < eventsPerUser; j++) {
            let metrics = null;

            if (metricName) {
                const eventSeed = Math.random();

                metric = {}
                metric[metricName] = eventSeed * (metricHighs[bucket] - metricLows[bucket]) + metricLows[bucket];
            }
            // Send event
            telemetryClient.trackEvent(eventName, { "TargetingId": `User ${i + 1}` }, metrics);
        }
    }

    // Flush telemetry (optional)
    telemetryClient.flush();
}
