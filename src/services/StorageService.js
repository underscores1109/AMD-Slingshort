// src/services/StorageService.js

const SCANS_KEY = 'nutrigen_past_scans';
const MEALS_KEY = 'nutrigen_meal_logs';

export const saveScan = (scanData) => {
  const scans = getScans();
  const newScan = {
    id: Date.now(),
    date: new Date().toISOString(),
    ...scanData
  };
  localStorage.setItem(SCANS_KEY, JSON.stringify([newScan, ...scans]));
  return newScan;
};

export const getScans = () => {
  const scans = localStorage.getItem(SCANS_KEY);
  return scans ? JSON.parse(scans) : [];
};

export const clearScans = () => {
  localStorage.removeItem(SCANS_KEY);
};

export const logMeal = (mealData) => {
  const logs = getMealLogs();
  const newLog = {
    id: Date.now(),
    date: new Date().toISOString(),
    ...mealData
  };
  localStorage.setItem(MEALS_KEY, JSON.stringify([newLog, ...logs]));
};

export const getMealLogs = () => {
  const logs = localStorage.getItem(MEALS_KEY);
  return logs ? JSON.parse(logs) : [];
};
