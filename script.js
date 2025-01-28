const scriptURL = "YOUR_GOOGLE_SCRIPT_URL";

document.getElementById("predictorForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const submitButton = document.getElementById("submit");
    const rank = parseInt(document.getElementById("rank").value);
    const location = document.getElementById("location").value.trim().toLowerCase();
    
    submitButton.disabled = true;
    submitButton.innerText = "Processing...";

    // Clear previous results
    document.getElementById("result").innerHTML = "";
    document.getElementById("noteligible").innerHTML = "";

    // If using Google Apps Script integration
    const formData = new FormData(document.forms.predictorForm);
    
    fetch(scriptURL, { method: "POST", body: formData })
        .then(() => {
            const { eligibleColleges, notEligibleColleges } = predictColleges(rank, location, colleges);
            const resultElement = document.getElementById("result");
            const notEligibleElement = document.getElementById("noteligible");

            if (eligibleColleges.length === 0) {
                resultElement.innerHTML = "<h3>Predicted Institutes</h3><p>No eligible colleges found for the given criteria.</p>";
            } else {
                const eligibleList = eligibleColleges.map(
                    (college) => `<li>${college.name} - ${college.location} (Min Rank: ${college.minRank})</li>`
                ).join("");
                resultElement.innerHTML = `<h3>Eligible Institutes</h3><ul>${eligibleList}</ul>`;
            }

            if (notEligibleColleges.length > 0) {
                const notEligibleList = notEligibleColleges.map(
                    (college) => `<li>${college.name} - ${college.location} (Min Rank: ${college.minRank})</li>`
                ).join("");
                notEligibleElement.innerHTML = `<h3>Non-Eligible Institutes</h3><ul>${notEligibleList}</ul>`;
            }
            
            swal("Success", "Prediction processed successfully!", "success");
        })
        .catch(() => swal("Error", "Something went wrong. Please try again!", "error"))
        .finally(() => {
            submitButton.disabled = false;
            submitButton.innerText = "Predict Institute";
        });
});

// Rest of your predictColleges function and colleges array remains same