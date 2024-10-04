const itemCategorySelect = document.getElementById('itemCategory');
const itemSelect = document.getElementById('itemSelect');
const locationSelect = document.getElementById('locationSelect');
const resultsDiv = document.getElementById('results');
const fetchPricesButton = document.getElementById('fetchPrices');

let itemsData = {}; // Store the items data from items.json

// Define item categories with their respective items
const itemCategories = {
    "Accessories": [
        "Bag", "Cape"
    ],
    "Armor": [
        "Cape", "Cloth Armor", "Cloth Helmet", "Cloth Shoes", "Harvester Cap",
        "Leather Armor", "Leather Helmet", "Leather Shoes", "Plate Armor",
        "Plate Helmet", "Plate Shoes", "Unique Armor", "Unique Helmet", "Unique Shoes"
    ],
    "Artifact": [
        "Armor", "Magic"
    ],
    "Melee": [
        "Arcane Staff", "Axe", "Dagger", "Hammer", "War Gloves", "Mace", "Quarterstaff", "Spear", "Sword"
    ],
    "Off-Hand": [
        "Book", "Horn", "Orb", "Shield", "Torch", "Totem"
    ],
    "Other": [
        "Mission Item", "Trash"
    ],
    "Ranged": [
        "Bow", "Crossbow"
    ],
    "City Resources": [
        "Beastheart", "Shadowheart", "Mountainheart", "Rockheart", "Treeheart", "Vineheart"
    ],
    "Consumable": [
        "Cooked", "Fish", "Fishing Bait", "Victory Emotes", "Map", "Other", "Potion", "Tome of Insight", "Vanity"
    ],
    "Farmable": [
        "Animal", "Seed"
    ],
    "Furniture": [
        "Banner", "Bed", "Chest", "Decoration", "Flag", "Heretic", "Keeper", "Morgana", "Repair Kit", "Table", "Unique"
    ],
    "Gathering Gear": [
        "Harvester Garb", "Harvester Backpack", "Harvester Cap", "Harvester Workboots",
        "Fisherman Garb", "Fisherman Backpack", "Fisherman Cap", "Fisherman Boots",
        "Skinner Garb", "Skinner Backpack", "Skinner Cap", "Skinner Workboots",
        "Miner Garb", "Miner Backpack", "Miner Cap", "Miner Workboots",
        "Quarrier Garb", "Quarrier Backpack", "Quarrier Cap", "Quarrier Workboots",
        "Lumberjack Garb", "Lumberjack Backpack", "Lumberjack Cap", "Lumberjack Workboots"
    ],
    "Luxury Goods": [
        "Any", "Bridgewatch", "Caerleon", "Fort Sterling", "Lymhurst", "Martlock", "Thetford"
    ],
    "Magic": [
        "Arcane Staff", "Cursed Staff", "Fire Staff", "Frost Staff", "Holy Staff", "Nature Staff", "Shapeshifter Staff"
    ],
    "Materials": [
        "Essence", "Other", "Relic", "Rune", "Avalonian Shards", "Crystal Shards", "Soul"
    ],
    "Mount": [
        "Armored Horse", "Battle Mount", "Swiftclaw", "Direbear", "Direboar", "Direwolf", "Stag/Moose", "Mule", "Ox", "Rare Mount", "Riding Horse", "Swamp Dragon"
    ],
    "Product": [],
    "Token": [
        "Arena Sigil", "Event", "Map", "Other", "Royal Sigil"
    ],
    "Tool": [
        "Siege Hammer", "Fishing Rod", "Pickaxe", "Sickle", "Skinning Knife", "Stone Hammer", "Wood Axe"
    ],
    "Trophies": [
        "Fiber Trophy", "Fishing Trophy", "General Trophy", "Hide Trophy", "Mercenary Trophy", "Ore Trophy", "Stone Trophy", "Wood Trophy"
    ],
};

// Populate categories dropdown
Object.keys(itemCategories).forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    itemCategorySelect.appendChild(option);
});

// Populate locations dropdown
const itemLocations = [
    "Caerleon", "Thetford", "Fort Sterling", "Lymhurst", "Bridgewatch", "Martlock"
];

itemLocations.forEach(location => {
    const option = document.createElement('option');
    option.value = location; // Using location name as value
    option.textContent = location;
    locationSelect.appendChild(option);
});

// Populate items dropdown based on selected category
itemCategorySelect.addEventListener('change', () => {
    const selectedCategory = itemCategorySelect.value;
    itemSelect.innerHTML = '<option value="">--Select an item--</option>'; // Reset items dropdown

    if (selectedCategory && itemCategories[selectedCategory]) {
        itemCategories[selectedCategory].forEach(item => {
            const option = document.createElement('option');
            option.value = item; // Using item name as ID
            option.textContent = item;
            itemSelect.appendChild(option);
        });
        itemSelect.disabled = false; // Enable items dropdown
    } else {
        itemSelect.disabled = true; // Disable if no category selected
    }
});

// Fetch items data on page load
async function fetchItemsData() {
    try {
        const response = await fetch('items.json'); // Load the items.json file
        itemsData = await response.json(); // Store the JSON data
    } catch (error) {
        console.error('Error fetching items data:', error);
    }
}
fetchItemsData();

// Function to get all matching item IDs from itemsData based on the item name, tier, and quality
function getItemIDs(itemName, selectedTier, selectedQuality) {
    const matchingIDs = [];

    for (const item of itemsData) {
        // Check if itemName is contained within the UniqueName
        if (item.UniqueName && item.UniqueName.toLowerCase().includes(itemName.toLowerCase())) {
            // Apply tier filtering if a specific tier is selected
            if (selectedTier !== 'All Tiers' && !item.UniqueName.includes(selectedTier)) {
                continue; // Skip this item if it doesn't match the selected tier
            }

            // Apply quality filtering
            if (selectedQuality === '0') {
                // If quality is '0', only include UniqueNames without a quality suffix
                if (item.UniqueName.includes('@')) {
                    continue; // Skip if it contains a quality suffix
                }
            } else if (selectedQuality !== 'All Levels' && !item.UniqueName.includes(`@${selectedQuality}`)) {
                continue; // Skip this item if it doesn't match the selected quality
            }

            matchingIDs.push(item.UniqueName); // Add the UniqueName (ID) to the list
        }
    }

    return matchingIDs; // Return the array of matching IDs
}

// Fetch prices when the button is clicked
fetchPricesButton.addEventListener('click', async () => {
    const selectedItems = Array.from(itemSelect.selectedOptions).map(opt => opt.value);
    const selectedLocations = Array.from(locationSelect.selectedOptions).map(opt => opt.value);
    const selectedTier = document.getElementById('tierSelect').value;
    const selectedQuality = document.getElementById('qualitySelect').value;

    if (selectedItems.length === 0 || selectedLocations.length === 0) {
        resultsDiv.innerHTML = '<p>Please select at least one item and one location.</p>';
        return;
    }

    // Show the loading spinner with fade-in
    const loadingIndicator = document.getElementById('loadingIndicator');
    loadingIndicator.classList.add('loading');

    // Delay for 1.5 seconds before proceeding
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Collect all UniqueNames for the selected items, applying tier and quality filters
    const itemIDs = selectedItems.flatMap(item => getItemIDs(item, selectedTier, selectedQuality));
    const locationsQuery = selectedLocations.join(',');

    // Determine qualities based on the selected quality
    const qualities = selectedQuality === 'All Levels' ? '0,1,2,3,4' : selectedQuality;

    if (itemIDs.length === 0) {
        resultsDiv.innerHTML = '<p>No items found for the selected criteria.</p>';
        // Hide the loading spinner with fade-out
        loadingIndicator.classList.remove('loading');
        return;
    }

    // Append tier to the URL if necessary (depending on the API behavior)
    const tierQuery = selectedTier === 'All Tiers' ? '' : `&tiers=${selectedTier}`;

    // Build the API URL
    const url = `https://europe.albion-online-data.com/api/v2/stats/view/${itemIDs.join(',')}?locations=${locationsQuery}&qualities=${qualities}${tierQuery}`;

    console.log('Fetching prices with URL:', url); // Log the URL

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const textData = await response.text();
        const data = parseHTMLResponse(textData);

        // Map UniqueNames to LocalizedNames
        const itemNameMap = {};
        itemsData.forEach(item => {
            if (item.LocalizedNames && item.LocalizedNames["EN-US"]) {
                itemNameMap[item.UniqueName] = item.LocalizedNames["EN-US"];
            } else {
                itemNameMap[item.UniqueName] = item.UniqueName; // Fallback to UniqueName
            }
        });

        // Display results using the mapped names
        displayResults(data, itemNameMap);
    } catch (error) {
        console.error('Error fetching prices:', error);
        resultsDiv.innerHTML += `<p>Error fetching prices: ${error.message}</p>`;
    } finally {
        // Delay for 1 second before hiding
        await new Promise(resolve => setTimeout(resolve, 1000)); // Delay before hiding loading indicator
        loadingIndicator.classList.remove('loading');
    }
});

// Parse the HTML response into an array of objects
function parseHTMLResponse(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const rows = doc.querySelectorAll('table tr');
    const items = [];

    // Iterate over rows, skipping the header
    rows.forEach((row, index) => {
        if (index === 0) return; // Skip header row
        const columns = row.querySelectorAll('td');
        if (columns.length === 0) return; // Skip empty rows

        // Extract data from columns
        items.push({
            id: columns[0].textContent.trim(),
            city: columns[1].textContent.trim(),
            quality: columns[2].textContent.trim(),
            price: columns[3].textContent.trim(),
            updated: columns[4].textContent.trim(),
        });
    });

    return items;
}

// Display results in the resultsDiv
function displayResults(data, itemNameMap) {
    if (data.length === 0) {
        resultsDiv.innerHTML = '<p>No prices found.</p>';
        return;
    }

    // Change the header to only include the Localized Name
    let html = '<table class="fade-in"><tr><th>Image</th><th>Localized Name</th><th>City</th><th>Quality</th><th>Price</th><th>Updated</th></tr>';
    data.forEach(item => {
        // Use the mapped localized name
        const localizedName = itemNameMap[item.id] || item.id; // Fallback to item ID if not found

        // Add the image HTML
        const imageHtml = `<img class="img-fluid loading" src="https://render.albiononline.com/v1/item/${item.id}" data-toggle="tooltip" data-placement="top" title="" data-original-title="${localizedName}" data-was-processed="true" style="width: 50px; height: 50px;">`;

        html += `<tr>
            <td>${imageHtml}</td>
            <td>${localizedName}</td>
            <td>${item.city}</td>
            <td>${item.quality}</td>
            <td>${item.price}</td>
            <td>${item.updated}</td>
        </tr>`;
    });
    html += '</table>';

    resultsDiv.innerHTML = html;

     // Add fade-in class after a slight delay
     const table = resultsDiv.querySelector('table');
     setTimeout(() => {
         table.classList.add('visible');
     }, 10); // Delay slightly to allow for transition
}