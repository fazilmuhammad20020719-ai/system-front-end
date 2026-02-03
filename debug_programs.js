import https from 'https';

https.get('https://api.mathersa.com/api/programs', (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
        data += chunk;
    });

    resp.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log("Programs count:", json.length);
            if (json.length > 0) {
                console.log("First Program Sample:", JSON.stringify(json[0], null, 2));
                const categories = json.map(p => p.category).filter((v, i, a) => a.indexOf(v) === i);
                console.log("All Categories:", categories);
            } else {
                console.log("No programs found.");
            }
            console.log("Full Data (first 5):", JSON.stringify(json.slice(0, 5), null, 2));
        } catch (e) {
            console.log("Raw output (not JSON):", data);
        }
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});
