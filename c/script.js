// Function to get URL parameters
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to parse settings.ini content
function parseSettings(text) {
    const lines = text.split('\n');
    const settings = {};
    let fulldesc = '';
    let isLineContinuation = false; // Track line continuation state

    lines.forEach(line => {
        const cleanLine = line.split('#')[0].trim(); // Ignore comments
        const [key, value] = cleanLine.split('=').map(part => part.trim());

        if (key && value) {
            if (key === 'fulldesc') {
                fulldesc += value; // Start or continue collecting fulldesc
                isLineContinuation = true; // Set line continuation state
            } else if (isLineContinuation && key === '') {
                fulldesc += '<br>' + value; // Continue on the next line
            } else {
                settings[key] = value;
                isLineContinuation = false; // Reset line continuation state
            }
        }
    });

    // Apply HTML formatting to fulldesc
    fulldesc = fulldesc
        .replace(/<ch 01>/g, '=')  // Replace <ch 01> with '='
        .replace(/<ch 02>/g, '#')  // Replace <ch 02> with '#'
        .replace(/<cg>(.*?)<\/c>/g, '<span style="color:#00FF00;">$1</span>') // Lime green
        .replace(/<cb>(.*?)<\/c>/g, '<span style="color:#0000FF;">$1</span>') // Blue
        .replace(/<cr>(.*?)<\/c>/g, '<span style="color:#FF0000;">$1</span>') // Red
        .replace(/<cy>(.*?)<\/c>/g, '<span style="color:#FFFF00;">$1</span>') // Yellow
        .replace(/<cp>(.*?)<\/c>/g, '<span style="color:#800080;">$1</span>') // Purple
        .replace(/<ci>(.*?)<\/c>/g, '<span style="color:#FFC0CB;">$1</span>') // Pink
        .replace(/<cb>(.*?)<\/c>/g, '<span style="color:#000000;">$1</span>') // Black
        .replace(/<ca>(.*?)<\/c>/g, '<span style="color:#808080;">$1</span>') // Gray
        .replace(/<cw>(.*?)<\/c>/g, '<span style="color:#FFFFFF;">$1</span>') // White
        .replace(/<co>(.*?)<\/c>/g, '<span style="color:#A52A2A;">$1</span>') // Brown
        .replace(/<con>(.*?)<\/con>/g, '<div class="code-block">$1</div>'); // Handle <con> tags

    settings.fulldesc = fulldesc;

    return settings;
}

// Load mod details based on ID from the URL
async function loadModDetails() {
    const modId = getUrlParameter('id'); // Get the mod ID from the URL
    const modFolder = 'authorized'; // Set the correct folder for authorized mods

    try {
        const response = await fetch(`/mods/${modFolder}/${modId}/settings.ini`); // Adjust path as needed
        const settingsText = await response.text();
        const settings = parseSettings(settingsText);

        if (settings) {
            document.getElementById('mod-title').textContent = settings.title;
            document.getElementById('mod-author').textContent = `by ${settings.author}`;
            document.getElementById('mod-version').textContent = `Version: ${settings.version}`;
            document.getElementById('mod-description').innerHTML = settings.fulldesc; // Use innerHTML to render formatted fulldesc
            document.getElementById('mod-thumbnail').src = settings.thumbnail;
            document.getElementById('mod-thumbnail').width = settings.imagesize;

            const downloadButton = document.getElementById('download-buttons');
            if (settings.downloadgit === 'yes') {
                downloadButton.innerHTML = `<a href="${settings.giturl}" target="_blank" class="split-button-left">Download from GitHub</a>`;
            } else if (settings.downloadable === 'yes') {
                downloadButton.innerHTML = `
                    <a href="${settings.downloadurl}" target="_blank" class="split-button-left">Download from Server</a>
                    <a href="${settings.giturl}" target="_blank" class="split-button-right">GitHub Releases</a>
                `;
            } else {
                downloadButton.innerHTML = ''; // Hide the button if not downloadable
            }

            // Show GitHub link if provided
            if (settings.github && settings.github !== '') {
                const githubButton = document.getElementById('mod-github-button');
                githubButton.href = settings.github;
                githubButton.target = '_blank';
                githubButton.textContent = "See author's GitHub";
                githubButton.className = 'github-button'; // Add styling class if needed
                document.getElementById('github-link').appendChild(githubButton);
            }
        }
    } catch (error) {
        //console.error('Error loading mod details:', error);
        //alert('Failed to load mod details. Please check the console for more information.');
    }
}

// Call the function to load mod details on page load
loadModDetails();
