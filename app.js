setInputValue("eventName", localStorage.getItem("eventName"));
setInputValue("userCount", localStorage.getItem("userCount"));
setInputValue("eventsPerUser", localStorage.getItem("eventsPerUser"));
setInputValue("featureName", localStorage.getItem("featureName"));
setInputValue("variants", localStorage.getItem("variants"));
setInputValue("allocations", localStorage.getItem("allocations"));
setInputValue("metricName", localStorage.getItem("metricName"));
setInputValue("metricLows", localStorage.getItem("metricLows"));
setInputValue("metricHighs", localStorage.getItem("metricHighs"));
setInputValue("flagId", localStorage.getItem("flagId"));
setInputValue("etag", localStorage.getItem("etag"));
setInputValue("flagReference", localStorage.getItem("flagReference"));



// app.js
async function sendCustomEvents() {
    const checkmark = document.querySelector('.checkmark');
    const loadingIcon = document.querySelector('.loader');

    // Show loading icon
    checkmark.style.display = 'none';
    loadingIcon.style.display = 'block';

    const instrumentationKey = document.getElementById('instrumentationKey').value;
    AddAppInsights(instrumentationKey);

    const eventName = document.getElementById('eventName').value;
    const userCount = parseInt(document.getElementById('userCount').value);
    const eventsPerUser = parseInt(document.getElementById('eventsPerUser').value);
  
    const featureName = document.getElementById('featureName').value.split("&");
    const variants = document.getElementById('variants').value.split("&");
    const allocations = document.getElementById('allocations').value.split(",");
    const metricName = document.getElementById('metricName').value.split("&");
    const metricLows = document.getElementById('metricLows').value.split("&");
    const metricHighs = document.getElementById('metricHighs').value.split("&");
  
    const flagId = document.getElementById('flagId').value;
    const etag = document.getElementById('etag').value;
    const flagReference = document.getElementById('flagReference').value;

    // Set values in Local Storage
    localStorage.setItem("eventName", eventName);
    localStorage.setItem("userCount", userCount);
    localStorage.setItem("eventsPerUser", eventsPerUser);
    localStorage.setItem("featureName", featureName.join("&"));
    localStorage.setItem("variants", variants.join("&"));
    localStorage.setItem("allocations", allocations.join(","));
    localStorage.setItem("metricName", metricName.join("&"));
    localStorage.setItem("metricLows", metricLows.join("&"));
    localStorage.setItem("metricHighs", metricHighs.join("&"));
    localStorage.setItem("flagId", flagId);
    localStorage.setItem("etag", etag);
    localStorage.setItem("flagReference", flagReference);

    
    for (let i = 0; i < userCount; i++) {
        // Allocate
        const userPercentile = (hash(i + "") / 4294967295 + 0.5) * 100;
        let bucket = 0;
        let growingAllocationTracking = 0;
        for (let k = 0; k < allocations.length; k++) {
            growingAllocationTracking += parseInt(allocations[k])
            if (userPercentile < growingAllocationTracking) {
                bucket = k;
                break;
            }
        }

        for (let k = 0; k < featureName.length; k++) {
            variantsParsed = variants[k].split(",");

            // Send impression event
            appInsights.trackEvent({name: "FeatureEvaluation"}, { 
                "TargetingId": `Simulated User ${i + 1}`, 
                "Enabled": true,
                "ETag": etag,
                "FeatureFlagId": flagId,
                "FeatureFlagReference": flagReference,
                "FeatureName": featureName[k],
                "Variant": variantsParsed[bucket],
                "VariantAllocationReason": "Percentile"
            });
        }

        await new Promise(r => setTimeout(r, 200));

        for (let j = 0; j < eventsPerUser; j++) {
            let metrics = {};

            for (k = 0; k < metricName.length; k++) {
                if (metricName[k]) {
                    const eventSeed = Math.random();

                    const metricLowsParsed = metricLows[k].split(",");
                    const metricHighsParsed = metricHighs[k].split(",");

                    metrics[metricName[k]] = Math.round(eventSeed * (parseInt(metricHighsParsed[bucket]) - parseInt(metricLowsParsed[bucket])) + parseInt(metricHighsParsed[bucket]));
                }
            }

            // Send event
            const eventObj = {
                name: eventName,
                properties: { "TargetingId": `Simulated User ${i + 1}` },
                measurements: metrics
            }
            appInsights.trackEvent(eventObj);
        }
    }

    // Flush telemetry (optional)
    appInsights.flush();

    loadingIcon.style.display = 'none';
    checkmark.style.display = 'block';
}

function AddAppInsights(connectionString) {
!(function (cfg){function e(){cfg.onInit&&cfg.onInit(i)}var S,u,D,t,n,i,C=window,x=document,w=C.location,I="script",b="ingestionendpoint",E="disableExceptionTracking",A="ai.device.";"instrumentationKey"[S="toLowerCase"](),u="crossOrigin",D="POST",t="appInsightsSDK",n=cfg.name||"appInsights",(cfg.name||C[t])&&(C[t]=n),i=C[n]||function(l){var d=!1,g=!1,f={initialize:!0,queue:[],sv:"7",version:2,config:l};function m(e,t){var n={},i="Browser";function a(e){e=""+e;return 1===e.length?"0"+e:e}return n[A+"id"]=i[S](),n[A+"type"]=i,n["ai.operation.name"]=w&&w.pathname||"_unknown_",n["ai.internal.sdkVersion"]="javascript:snippet_"+(f.sv||f.version),{time:(i=new Date).getUTCFullYear()+"-"+a(1+i.getUTCMonth())+"-"+a(i.getUTCDate())+"T"+a(i.getUTCHours())+":"+a(i.getUTCMinutes())+":"+a(i.getUTCSeconds())+"."+(i.getUTCMilliseconds()/1e3).toFixed(3).slice(2,5)+"Z",iKey:e,name:"Microsoft.ApplicationInsights."+e.replace(/-/g,"")+"."+t,sampleRate:100,tags:n,data:{baseData:{ver:2}},ver:4,seq:"1",aiDataContract:undefined}}var h=-1,v=0,y=["js.monitor.azure.com","js.cdn.applicationinsights.io","js.cdn.monitor.azure.com","js0.cdn.applicationinsights.io","js0.cdn.monitor.azure.com","js2.cdn.applicationinsights.io","js2.cdn.monitor.azure.com","az416426.vo.msecnd.net"],k=l.url||cfg.src;if(k){if((n=navigator)&&(~(n=(n.userAgent||"").toLowerCase()).indexOf("msie")||~n.indexOf("trident/"))&&~k.indexOf("ai.3")&&(k=k.replace(/(\/)(ai\.3\.)([^\d]*)$/,function(e,t,n){return t+"ai.2"+n})),!1!==cfg.cr)for(var e=0;e<y.length;e++)if(0<k.indexOf(y[e])){h=e;break}var i=function(e){var a,t,n,i,o,r,s,c,p,u;f.queue=[],g||(0<=h&&v+1<y.length?(a=(h+v+1)%y.length,T(k.replace(/^(.*\/\/)([\w\.]*)(\/.*)$/,function(e,t,n,i){return t+y[a]+i})),v+=1):(d=g=!0,o=k,c=(p=function(){var e,t={},n=l.connectionString;if(n)for(var i=n.split(";"),a=0;a<i.length;a++){var o=i[a].split("=");2===o.length&&(t[o[0][S]()]=o[1])}return t[b]||(e=(n=t.endpointsuffix)?t.location:null,t[b]="https://"+(e?e+".":"")+"dc."+(n||"services.visualstudio.com")),t}()).instrumentationkey||l.instrumentationKey||"",p=(p=p[b])?p+"/v2/track":l.endpointUrl,(u=[]).push((t="SDK LOAD Failure: Failed to load Application Insights SDK script (See stack for details)",n=o,r=p,(s=(i=m(c,"Exception")).data).baseType="ExceptionData",s.baseData.exceptions=[{typeName:"SDKLoadFailed",message:t.replace(/\./g,"-"),hasFullStack:!1,stack:t+"\nSnippet failed to load ["+n+"] -- Telemetry is disabled\nHelp Link: https://go.microsoft.com/fwlink/?linkid=2128109\nHost: "+(w&&w.pathname||"_unknown_")+"\nEndpoint: "+r,parsedStack:[]}],i)),u.push((s=o,t=p,(r=(n=m(c,"Message")).data).baseType="MessageData",(i=r.baseData).message='AI (Internal): 99 message:"'+("SDK LOAD Failure: Failed to load Application Insights SDK script (See stack for details) ("+s+")").replace(/\"/g,"")+'"',i.properties={endpoint:t},n)),o=u,c=p,JSON&&((r=C.fetch)&&!cfg.useXhr?r(c,{method:D,body:JSON.stringify(o),mode:"cors"}):XMLHttpRequest&&((s=new XMLHttpRequest).open(D,c),s.setRequestHeader("Content-type","application/json"),s.send(JSON.stringify(o))))))},a=function(e,t){g||setTimeout(function(){!t&&f.core||i()},500),d=!1},T=function(e){var n=x.createElement(I),e=(n.src=e,cfg[u]);return!e&&""!==e||"undefined"==n[u]||(n[u]=e),n.onload=a,n.onerror=i,n.onreadystatechange=function(e,t){"loaded"!==n.readyState&&"complete"!==n.readyState||a(0,t)},cfg.ld&&cfg.ld<0?x.getElementsByTagName("head")[0].appendChild(n):setTimeout(function(){x.getElementsByTagName(I)[0].parentNode.appendChild(n)},cfg.ld||0),n};T(k)}try{f.cookie=x.cookie}catch(p){}function t(e){for(;e.length;)!function(t){f[t]=function(){var e=arguments;d||f.queue.push(function(){f[t].apply(f,e)})}}(e.pop())}var r,s,n="track",o="TrackPage",c="TrackEvent",n=(t([n+"Event",n+"PageView",n+"Exception",n+"Trace",n+"DependencyData",n+"Metric",n+"PageViewPerformance","start"+o,"stop"+o,"start"+c,"stop"+c,"addTelemetryInitializer","setAuthenticatedUserContext","clearAuthenticatedUserContext","flush"]),f.SeverityLevel={Verbose:0,Information:1,Warning:2,Error:3,Critical:4},(l.extensionConfig||{}).ApplicationInsightsAnalytics||{});return!0!==l[E]&&!0!==n[E]&&(t(["_"+(r="onerror")]),s=C[r],C[r]=function(e,t,n,i,a){var o=s&&s(e,t,n,i,a);return!0!==o&&f["_"+r]({message:e,url:t,lineNumber:n,columnNumber:i,error:a,evt:C.event}),o},l.autoExceptionInstrumented=!0),f}(cfg.cfg),(C[n]=i).queue&&0===i.queue.length?(i.queue.push(e),i.trackPageView({})):e();})({
    src: "https://js.monitor.azure.com/scripts/b/ai.3.gbl.min.js",
    // name: "appInsights", // Global SDK Instance name defaults to "appInsights" when not supplied
    // ld: 0, // Defines the load delay (in ms) before attempting to load the sdk. -1 = block page load and add to head. (default) = 0ms load after timeout,
    // useXhr: 1, // Use XHR instead of fetch to report failures (if available),
    // dle: true, // Prevent the SDK from reporting load failure log
    crossOrigin: "anonymous", // When supplied this will add the provided value as the cross origin attribute on the script tag
    // onInit: null, // Once the application insights instance has loaded and initialized this callback function will be called with 1 argument -- the sdk instance (DO NOT ADD anything to the sdk.queue -- As they won't get called)
    cfg: { // Application Insights Configuration
        connectionString: connectionString
    }
});
}

// Set the value of an input element
function setInputValue(elementId, value) {
    const inputElement = document.getElementById(elementId);
    if (inputElement) {
        inputElement.value = value;
    }
}

function hash(s) {
    for(var i=0,h=9;i<s.length;)
        h=Math.imul(h^s.charCodeAt(i++),9**9);
    return h^h>>>9
};

