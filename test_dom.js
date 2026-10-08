const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('index.html', 'utf8');

const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", (err) => { console.error("JSDOM Error:", err); });
virtualConsole.on("warn", (warn) => { console.warn("JSDOM Warn:", warn); });
virtualConsole.on("log", (log) => { console.log("JSDOM Log:", log); });
virtualConsole.on("jsdomError", (err) => { console.error("JSDOM internal:", err.message, err.detail); });

const dom = new JSDOM(html, {
    url: "file:///" + __dirname.replace(/\\/g, '/') + "/index.html",
    runScripts: "dangerously",
    resources: "usable",
    virtualConsole
});

setTimeout(() => {
    console.log("Done waiting for scripts.");
    // try to call startSim
    try {
        dom.window.startSim();
        console.log("startSim executed successfully.");
    } catch (e) {
        console.error("Error calling startSim:", e);
    }
}, 2000);
