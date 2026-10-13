document.addEventListener('DOMContentLoaded', () => {
    const calcForm = document.getElementById('calc-form');
    if (!calcForm) return;

    const inputs = {
        distance: document.getElementById('calc-distance'),
        consumption: document.getElementById('calc-consumption'),
        price: document.getElementById('calc-price'),
        passengers: document.getElementById('calc-passengers')
    };

    const outputs = {
        totalCost: document.getElementById('res-total'),
        perPassenger: document.getElementById('res-per-person'),
        co2Saved: document.getElementById('res-co2')
    };

    function calculate() {
        // Parse inputs, defaulting to 0 or 1 if empty/invalid to prevent NaN/Infinity
        const distance = parseFloat(inputs.distance.value) || 0;
        const consumption = parseFloat(inputs.consumption.value) || 0;
        const price = parseFloat(inputs.price.value) || 0;
        const passengers = parseInt(inputs.passengers.value, 10) || 1;

        // Ensure minimum 1 passenger for division (driver counts as a person in the car)
        // Wait, standard carpool calculator splits cost among all people in the car?
        // Let's assume 'passengers' means total people in the car including the driver.
        // If it means 'additional passengers', we'd add 1. Let's use it as 'Total people'.
        // The prompt says "passengers" (Mitfahrer). If I have 1 Mitfahrer, there are 2 people.
        // We'll treat the input as total people in the car.
        const totalPeople = Math.max(1, passengers);

        // Calculations
        const totalLiters = (distance / 100) * consumption;
        const totalCost = totalLiters * price;
        const costPerPerson = totalCost / totalPeople;

        // CO2 savings estimate: ~2.37 kg CO2 per liter of petrol.
        // If 3 extra people ride along instead of driving their own identical cars,
        // we save (totalPeople - 1) * totalLiters * 2.37 kg.
        const co2PerLiter = 2.37;
        const co2SavedKg = (totalPeople - 1) * totalLiters * co2PerLiter;

        // Format outputs
        outputs.totalCost.textContent = totalCost.toFixed(2).replace('.', ',') + ' €';
        outputs.perPassenger.textContent = costPerPerson.toFixed(2).replace('.', ',') + ' €';

        if (co2SavedKg > 0) {
            outputs.co2Saved.textContent = co2SavedKg.toFixed(1).replace('.', ',') + ' kg';
        } else {
            outputs.co2Saved.textContent = '0 kg';
        }
    }

    // Add event listeners to all inputs
    Object.values(inputs).forEach(input => {
        input.addEventListener('input', calculate);
    });

    // Prevent form submission if someone presses enter
    calcForm.addEventListener('submit', (e) => {
        e.preventDefault();
        calculate();
    });

    // Initial calculation
    calculate();
});
