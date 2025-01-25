const scriptURL = "https://script.google.com/macros/s/AKfycby6ypV2AG1M7-vKpU_F2LRzLnX8Ix22WVz3SdMYvgewdJ5scM9pD_FOdSyFnLxOQ89H1g/exec";

document.getElementById("predictorForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const form = document.forms.predictorForm;
    const formData = new FormData(form);
    const submitButton = document.getElementById("submit");
    const rank = parseInt(document.getElementById("rank").value);
    const location = document.getElementById("location").value.trim().toLowerCase();
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    fetch(scriptURL, { method: "POST", body: formData })
        .then(() => swal("Success", "Submitted Successfully.", "success"))
        .catch(() => swal("Error", "Something went wrong. Please try again!", "error"));
    submitButton.disabled = true;
    submitButton.innerText = "Processing...";
    const { eligibleColleges, notEligibleColleges } = predictColleges(rank, location, colleges);
    const resultElement = document.getElementById("result");
    const notEligibleElement = document.getElementById("noteligible");
    if (eligibleColleges.length === 0) {
        resultElement.innerHTML = "<h3>Predicted Institute</h3><p>No eligible colleges found for the given criteria.</p>";
    } else {
        const eligibleList = eligibleColleges.map(
            (college) => `<li>${college.name} - ${college.location} (Min Rank: ${college.minRank})</li>`
        ).join("");
        resultElement.innerHTML = `<h3>Predicted Institute</h3><ul>${eligibleList}</ul>`;
    }
    if (notEligibleColleges.length > 0) {
        const notEligibleList = notEligibleColleges.map(
            (college) => `<li>${college.name} - ${college.location} (Min Rank: ${college.minRank})</li>`
        ).join("");
        notEligibleElement.innerHTML += `<ul>${notEligibleList}</ul>`;
    }
    submitButton.disabled = false;
    submitButton.innerText = "Predict Institute";
});

function predictColleges(rank, location, colleges) {
    const eligibleColleges = colleges.filter((college) => rank <= college.minRank);
    const notEligibleColleges = colleges.filter((college) => rank > college.minRank);
    const locationMatch = eligibleColleges.filter(
        (college) => college.location.toLowerCase() === location
    );
    const locationMismatch = eligibleColleges.filter(
        (college) => college.location.toLowerCase() !== location
    );
    locationMatch.sort((a, b) => a.minRank - b.minRank);
    locationMismatch.sort((a, b) => a.minRank - b.minRank);
    return {
        eligibleColleges: [...locationMatch, ...locationMismatch],
        notEligibleColleges,
    };
}

const colleges = [
    { name: "Sunbeam Pune", location: "Pune", minRank: 410, course: "DAC" },
    { name: "ACTS", location: "Pune", minRank: 782, course: "DAC" },
    { name: "Sunbeam Karad", location: "Karad/Pune", minRank: 1284, course: "DAC" },
    { name: "IACSD", location: "Pune", minRank: 1340, course: "DAC" },
    { name: "VITA", location: "Mumbai", minRank: 1692, course: "DAC" },
    { name: "CDAC Kharghar", location: "Mumbai", minRank: 1730, course: "DAC" },
    { name: "KNOW IT", location: "Pune", minRank: 1850, course: "DAC" },
    { name: "IET", location: "Pune", minRank: 2260, course: "DAC" },
    { name: "Infoway", location: "Pune", minRank: 2506, course: "DAC" },
    { name: "MET", location: "Mumbai", minRank: 2960, course: "DAC" },
    { name: "CDAC Banglore", location: "Banglore", minRank: 3720, course: "DAC" },
    { name: "CDAC Hyderabad", location: "Hyderabad", minRank: 4047, course: "DAC" },
    { name: "CDAC Noida", location: "Noida", minRank: 5387, course: "DAC" },
    { name: "CDAC Chennai", location: "Chennai", minRank: 5449, course: "DAC" },

];
