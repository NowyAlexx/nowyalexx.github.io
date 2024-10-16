// Variable to track whether to show unauthorized mods
let showUnauthorizedMods = false;

// Function to load mods from a directory
async function loadMods() {
    const modsList = document.getElementById('mods-list');
    modsList.innerHTML = ''; // Clear previous mods

    // Load authorized mods first
    await loadModType('mods/authorized/');

    // Load unauthorized mods if the toggle is checked
    if (showUnauthorizedMods) {
        await loadModType('mods/unauthorized/');
    }
}

// Function to load a specific type of mod
async function loadModType(modType) {
    const response = await fetch(`${modType}mod_list.json`); // Assume mod_list.json contains an array of mod folder names
    const modFolders = await response.json();

    for (const folder of modFolders) {
        const settingsResponse = await fetch(`${modType}${folder}/settings.ini`);
        const settingsText = await settingsResponse.text();
        const settings = parseSettings(settingsText);

        if (settings) {
            const modCard = createModCard(settings);
            document.getElementById('mods-list').appendChild(modCard);
        }
    }
}

// Function to parse settings.ini content
function parseSettings(text) {
    const lines = text.split('\n');
    const settings = {};
    lines.forEach(line => {
        // Ignore comments
        const cleanLine = line.split('#')[0].trim(); // Split by '#' and take the first part
        const [key, value] = cleanLine.split('=');
        if (key && value) {
            settings[key.trim()] = value.trim();
        }
    });

    // Detect version status based on the last character
    if (settings.version) {
        const versionLastChar = settings.version.slice(-1);
        if (versionLastChar === 'b') {
            settings.isbeta = 'yes'; // Mark as beta
        } else if (versionLastChar === 'a') {
            settings.isalpha = 'yes'; // Mark as alpha
        } else {
            settings.isbeta = 'no'; // Stable version
        }
    }

    return settings;
}



// Function to create mod card element
function createModCard(settings) {
    const modCard = document.createElement('div');
    modCard.className = 'mod-card';

    const thumbnail = document.createElement('img');
    thumbnail.src = `${settings.thumbnail}`;
    modCard.appendChild(thumbnail);

    // Create a container for icons
    const iconsContainer = document.createElement('div');
    iconsContainer.style.display = 'flex'; // Use flexbox for alignment
    iconsContainer.style.justifyContent = 'center'; // Center the icons

    // Author certified icon
    if (settings.isauthorcertified === 'yes') {
        const authorIcon = document.createElement('img');
        authorIcon.src = 'img/authorcertified.png'; // Path to author certified icon
        authorIcon.className = 'certified-icon';
        authorIcon.title = 'This content is created by certified author'; // Tooltip message
        iconsContainer.appendChild(authorIcon);
    }

    // Mod certified icon
    if (settings.ismodcertified === 'yes') {
        const modIcon = document.createElement('img');
        modIcon.src = 'img/modcertified.png'; // Path to mod certified icon
        modIcon.className = 'certified-icon';
        modIcon.title = 'This content is certified'; // Tooltip message
        iconsContainer.appendChild(modIcon);
    }

    modCard.appendChild(iconsContainer); // Add the icons container to the mod card

    const title = document.createElement('h3');
    title.textContent = settings.title;
    modCard.appendChild(title);

    const listDesc = document.createElement('p');
    listDesc.textContent = settings.listdesc;
    modCard.appendChild(listDesc);

    // Downloadable icon (or undownloadable)
    if (settings.downloadable === 'yes') {
        // Optional: Add a downloadable icon if needed
    } else {
        const undownloadableIcon = document.createElement('img');
        undownloadableIcon.src = 'img/undownloadable.png'; // Path to undownloadable icon
        undownloadableIcon.className = 'certified-icon'; // Apply class for styling
        undownloadableIcon.title = 'This content is not downloadable'; // Tooltip message
        iconsContainer.appendChild(undownloadableIcon);
    }


    const infoContainer = document.createElement('div');
    infoContainer.style.display = 'flex';
    infoContainer.style.justifyContent = 'space-between';
    infoContainer.style.alignItems = 'center'; // Align items vertically in the center
    infoContainer.style.marginTop = '10px'; // Adjust margin for spacing
    
    const version = document.createElement('div');
    // Always set textContent to ensure it's treated as plain text, preventing any HTML interpretation issues
    version.textContent = `${settings.version}`; 
    version.className = 'mod-version'; // Optional class for styling
    infoContainer.appendChild(version); // Add version to the left
    
    const creationDate = document.createElement('div');
    creationDate.textContent = `${settings.creationdate}`;
    creationDate.className = 'creation-date'; // Apply class for styling
    infoContainer.appendChild(creationDate); // Add creation date to the right
    
    modCard.appendChild(infoContainer); // Add info container to mod card
    

    return modCard;
}




// Handle search input
document.getElementById('search-input').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const modCards = document.querySelectorAll('.mod-card');

    modCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        card.style.display = title.includes(searchTerm) ? 'block' : 'none';
    });
});

// Handle toggle for unauthorized mods
document.getElementById('toggle-unauthorized').addEventListener('change', function() {
    showUnauthorizedMods = this.checked; // Update the state
    loadMods(); // Load mods based on the state
});

// Load only authorized mods by default on page load
loadMods();
