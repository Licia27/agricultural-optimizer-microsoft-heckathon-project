CREATE TABLE CropRecommendations (
    RecommendationID INTEGER PRIMARY KEY AUTOINCREMENT,
    PhosphateContent REAL NOT NULL,    -- e.g., mg/kg or ppm
    PhValue REAL NOT NULL,             -- Standard pH scale
    NitrogenContent REAL NOT NULL,     -- e.g., mg/kg or ppm
    PotassiumContent REAL NOT NULL,    -- e.g., mg/kg or ppm
    RecommendedCrop TEXT NOT NULL      -- The crop suggested for these conditions
);


CREATE TABLE YieldPredictions (
    PredictionID INTEGER PRIMARY KEY AUTOINCREMENT,
    SoilType TEXT NOT NULL,            -- e.g., 'Loamy', 'Sandy', 'Clay'
    FertilizerUsage REAL NOT NULL,     -- e.g., kg/hectare or lbs/acre
    DaysToHarvest INTEGER NOT NULL,    -- Expected number of days from planting/stage to harvest
    Region TEXT NOT NULL,              -- Geographic area, e.g., 'Central Valley', 'Midwest'
    IrrigationUsage REAL NOT NULL,     -- e.g., mm/season, gallons/acre, or index
    Crop TEXT NOT NULL,                -- The specific crop being analyzed, e.g., 'Corn', 'Wheat'
    PredictedYieldPerHectare REAL NOT NULL -- The output prediction
);