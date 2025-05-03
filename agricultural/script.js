function getCropRecommendations() {
    const nitrogen = document.getElementById('nitrogen').value;
    const potassium = document.getElementById('potassium').value;
    const phosphorus = document.getElementById('phosphorus').value;
    const ph = document.getElementById('ph').value;
    
    // Simple validation
    if (!nitrogen || !potassium || !phosphorus || !ph) {
        alert('Please fill in all fields');
        return;
    }
    
    // This would normally be an API call to a backend service
    // For demo purposes, we'll use a simple algorithm
    
    let recommendedCrops = [];
    
    // Simple recommendation logic based on input values
    if (ph >= 6 && ph <= 7.5) {
        if (nitrogen > 50 && potassium > 100 && phosphorus > 30) {
            recommendedCrops = ['Wheat', 'Corn', 'Soybeans'];
        } else if (nitrogen > 30 && potassium > 50 && phosphorus > 20) {
            recommendedCrops = ['Barley', 'Oats', 'Potatoes'];
        } else {
            recommendedCrops = ['Legumes', 'Peas', 'Beans'];
        }
    } else if (ph < 6) {
        recommendedCrops = ['Blueberries', 'Potatoes', 'Sweet potatoes'];
    } else {
        recommendedCrops = ['Alfalfa', 'Asparagus', 'Garlic'];
    }
    
    // Display results
    const resultDiv = document.getElementById('crop-result');
    resultDiv.innerHTML = `
        <h3>Recommended Crops:</h3>
        <ul>
            ${recommendedCrops.map(crop => <li>${crop}</li>).join('')}
        </ul>
        <p>Based on your soil parameters (N: ${nitrogen}, P: ${phosphorus}, K: ${potassium}, pH: ${ph})</p>
    `;
    resultDiv.style.display = 'block';
}

function predictYield() {
    const region = document.getElementById('region').value;
    const soilType = document.getElementById('soil-type').value;
    const fertilizer = document.getElementById('fertilizer').value;
    const daysToHarvest = document.getElementById('days-to-harvest').value;
    
    // Simple validation
    if (!region || !soilType || !fertilizer || !daysToHarvest) {
        alert('Please fill in all fields');
        return;
    }
    
    // This would normally be an API call to a backend service
    // For demo purposes, we'll use a simple algorithm
    
    // Base yield (tons/ha)
    let baseYield = 2.5;
    
    // Adjust based on region
    if (region === 'north') baseYield *= 0.9;
    if (region === 'south') baseYield *= 1.1;
    if (region === 'central') baseYield *= 1.2;
    
    // Adjust based on soil type
    if (soilType === 'loamy') baseYield *= 1.3;
    if (soilType === 'clay') baseYield *= 0.8;
    if (soilType === 'sandy') baseYield *= 0.7;
    
    // Adjust based on fertilizer
    if (fertilizer === 'low') baseYield *= 0.7;
    if (fertilizer === 'high') baseYield *= 1.4;
    
    // Adjust based on days to harvest (longer growing season = higher yield)
    const daysFactor = Math.min(1 + (daysToHarvest / 200), 1.5);
    baseYield *= daysFactor;
    
    // Round to 2 decimal places
    const predictedYield = Math.round(baseYield * 100) / 100;
    
    // Display results
    const resultDiv = document.getElementById('yield-result');
    resultDiv.innerHTML = `
        <h3>Predicted Yield: ${predictedYield} tons/ha</h3>
        <p>Based on your parameters:</p>
        <ul>
            <li>Region: ${region.charAt(0).toUpperCase() + region.slice(1)}</li>
            <li>Soil Type: ${soilType.charAt(0).toUpperCase() + soilType.slice(1)}</li>
            <li>Fertilizer Usage: ${fertilizer.charAt(0).toUpperCase() + fertilizer.slice(1)}</li>
            <li>Days to Harvest: ${daysToHarvest}</li>
        </ul>
    `;
    resultDiv.style.display = 'block';
        }