

const API_BASE_URL = 'http://localhost:5000/api';


const cropForm = document.getElementById('crop-recommendation-form');
const yieldForm = document.getElementById('yield-prediction-form');
const cropResult = document.getElementById('crop-result');
const yieldResult = document.getElementById('yield-result');


const showLoading = (element) => {
    element.innerHTML = '<div class="loading">Processing... <div class="spinner"></div></div>';
    element.style.display = 'block';
};

const showError = (element, message) => {
    element.innerHTML = <div class="error">${message}</div>;
    element.style.display = 'block';
};

const validateInputs = (inputs) => {
    for (const [key, value] of Object.entries(inputs)) {
        if (value === '' || value === null || value === undefined) {
            return { isValid: false, message: Please fill in the ${key} field };
        }
        if (key === 'ph' && (value < 0 || value > 14)) {
            return { isValid: false, message: 'pH value must be between 0 and 14' };
        }
        if ((key === 'nitrogen' || key === 'potassium' || key === 'phosphorus' || key === 'daysToHarvest') && isNaN(value)) {
            return { isValid: false, message: ${key} must be a number };
        }
    }
    return { isValid: true };
};


async function getCropRecommendations() {
    const nitrogen = document.getElementById('nitrogen').value;
    const potassium = document.getElementById('potassium').value;
    const phosphorus = document.getElementById('phosphorus').value;
    const ph = document.getElementById('ph').value;
    
    
    const validation = validateInputs({ nitrogen, potassium, phosphorus, ph });
    if (!validation.isValid) {
        alert(validation.message);
        return;
    }

    showLoading(cropResult);

    try {
        const response = await fetch(${API_BASE_URL}/crop/recommendations, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nitrogen: parseFloat(nitrogen),
                potassium: parseFloat(potassium),
                phosphorus: parseFloat(phosphorus),
                ph: parseFloat(ph)
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to get recommendations');
        }

        const data = await response.json();
        
        // Display results
        cropResult.innerHTML = `
            <h3>Recommended Crops</h3>
            <div class="crop-grid">
                ${data.recommendations.map(crop => `
                    <div class="crop-card">
                        <h4>${crop.name}</h4>
                        <p class="match-score">Suitability: ${Math.round(crop.score * 100)}%</p>
                        <p>Ideal pH: ${crop.idealPH[0]} - ${crop.idealPH[1]}</p>
                        <p>Nitrogen Requirement: ${crop.nitrogenReq}</p>
                    </div>
                `).join('')}
            </div>
            <div class="soil-summary">
                <h4>Your Soil Analysis</h4>
                <p>Nitrogen: ${nitrogen} kg/ha</p>
                <p>Phosphorus: ${phosphorus} kg/ha</p>
                <p>Potassium: ${potassium} kg/ha</p>
                <p>pH: ${ph}</p>
            </div>
        `;
    } catch (error) {
        console.error('Error:', error);
        showError(cropResult, error.message);
    }
}


async function predictYield() {
    const region = document.getElementById('region-crop').value;
    const soilType = document.getElementById('soil-type').value;
    const fertilizer = document.getElementById('fertilizer').value;
    const irrigation = document.getElementById('irrigation').value;
    const daysToHarvest = document.getElementById('days-to-harvest').value;
    
    
    const validation = validateInputs({ region, soilType, fertilizer, irrigation, daysToHarvest });
    if (!validation.isValid) {
        alert(validation.message);
        return;
    }

    showLoading(yieldResult);

    try {
        const response = await fetch(${API_BASE_URL}/yield/predict, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                region,
                soilType,
                fertilizer,
                irrigation,
                daysToHarvest: parseInt(daysToHarvest)
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to predict yield');
        }

        const data = await response.json();
        
        
        yieldResult.innerHTML = `
            <h3>Yield Prediction for ${capitalizeFirstLetter(region)} Region</h3>
            <div class="yield-details">
                <p><strong>${data.predictedYield.toFixed(2)} tons/ha</strong></p>
                <p>Confidence Range: ${data.confidenceRange[0].toFixed(2)} - ${data.confidenceRange[1].toFixed(2)} tons/ha</p>
                <div class="range-bar">
                    <div class="range-fill" style="width: ${data.confidence * 100}%"></div>
                </div>
            </div>
            <div class="factors">
                <h4>Key Factors</h4>
                <ul>
                    <li>Region: ${capitalizeFirstLetter(region)}</li>
                    <li>Soil Type: ${capitalizeFirstLetter(soilType)}</li>
                    <li>Fertilizer: ${capitalizeFirstLetter(fertilizer)}</li>
                    <li>Irrigation: ${capitalizeFirstLetter(irrigation)}</li>
                    <li>Growing Period: ${daysToHarvest} days</li>
                </ul>
            </div>
            ${data.recommendations ? `
            <div class="optimization-tips">
                <h4>Optimization Tips</h4>
                <ul>
                    ${data.recommendations.map(tip => <li>${tip}</li>).join('')}
                </ul>
            </div>
            ` : ''}
        `;
    } catch (error) {
        console.error('Error:', error);
        showError(yieldResult, error.message);
    }
}


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


document.addEventListener('DOMContentLoaded', () => {
    
    
    if (cropForm) {
        cropForm.addEventListener('submit', (e) => {
            e.preventDefault();
            getCropRecommendations();
        });
    }
    
    if (yieldForm) {
        yieldForm.addEventListener('submit', (e) => {
            e.preventDefault();
            predictYield();
        });
    }
});