// Wait until the DOM is fully loaded and ready before running any scripts
// This is the jQuery shorthand for $(document).ready(function() {...})
$(document).ready(() => {

    // Role-to-skill mapping object.
    // Each key (like 'frontend') maps to a role name and its associated skills with tooltips.
    const roleSkills = {
        frontend: {
            name: "Frontend Developer",
            skills: {
                HTML: "Markup language for building web pages",
                CSS: "Styling for web layout and design",
                JavaScript: "Main frontend scripting language",
                React: "JavaScript UI library",
                Accessibility: "Design for inclusivity and access"
            }
        },
        backend: {
            name: "Backend Developer",
            skills: {
                Java: "Enterprise server-side language",
                Nodejs: "JavaScript runtime for backend",
                SQL: "Language for working with databases",
                Python: "High-level general-purpose language",
                APIs: "Interface for connecting applications"
            }
        },
        fullstack: {
            name: "Full Stack Developer",
            skills: {
                JavaScript: "Shared language between front and back",
                React: "Frontend component library",
                Nodejs: "Backend runtime",
                MongoDB: "NoSQL database",
                Git: "Version control system"
            }
        },
        devops: {
            name: "DevOps Engineer",
            skills: {
                Linux: "OS used on most servers",
                Docker: "Containerization platform",
                Kubernetes: "Container orchestration tool",
                AWS: "Cloud platform",
                CICD: "Continuous integration and deployment"
            }
        },
        data: {
            name: "Data Scientist",
            skills: {
                Python: "Popular for data analysis",
                R: "Statistical computing language",
                Pandas: "Python library for data manipulation",
                "Machine Learning": "Using data to predict outcomes",
                SQL: "Work with data stored in databases"
            }
        }
    };

    // Function to dynamically generate the skill list based on selected roles
    function updateSkills() {
        // jQuery selector to get all checked checkboxes under #roles
        // .map() transforms each element to its value (e.g., "frontend")
        // .get() converts the jQuery object into a plain JavaScript array
        const selected = $('#roles input:checked').map(function () {
            return $(this).val();
        }).get();

        // Object to collect skills and how often they appear across roles
        const skillMap = {};

        // For each selected role, gather its skills
        selected.forEach(roleKey => {
            const skills = roleSkills[roleKey].skills;

            // Loop over each skill and count how many roles include it
            for (const [skill, tooltip] of Object.entries(skills)) {
                if (!skillMap[skill]) {
                    skillMap[skill] = { count: 1, tooltip };
                } else {
                    skillMap[skill].count++;
                }
            }
        });

        // jQuery selector for the skill list container
        const $skillList = $('#skillList');

        // .empty() is a jQuery method that removes all children from the element
        $skillList.empty();

        // Sort skill names alphabetically
        const sortedSkills = Object.keys(skillMap).sort();

        // Loop through each sorted skill
        sortedSkills.forEach(skill => {
            const info = skillMap[skill];
            const shared = info.count > 1 ? 'shared' : ''; // Add 'shared' class if used in multiple roles
            const tooltip = info.tooltip;

            // jQuery creates a new <span> element with the badge class and title tooltip
            const $badge = $(`<span class="badge ${shared}" title="${tooltip}">${skill}</span>`);

            // Initially hide the badge, append it to the skill list, and fade it in for smooth appearance
            $badge.hide().appendTo($skillList).fadeIn(300);
        });

        // Use jQuery .slideDown() to reveal the skill section smoothly
        $('#skills').slideDown();
    }

    // jQuery .change() event: triggers updateSkills whenever any checkbox is changed (checked or unchecked)
    $('#roles input[type="checkbox"]').change(updateSkills);

    // jQuery .on('keyup') event: runs a function every time the user types into the role search input
    $('#roleSearch').on('keyup', function () {
        const filter = $(this).val().toLowerCase(); // Get the typed value and normalize case

        // Loop over each .role-option element
        $('#roles .role-option').each(function () {
            const text = $(this).text().toLowerCase(); // Get the text content of the label
            // .toggle() shows or hides the element based on the filter match
            $(this).toggle(text.includes(filter));
        });
    });

    // Export functionality: gathers selected roles and visible skills and downloads them as a .txt file
    $('#exportBtn').click(() => {
        // Use jQuery to collect checked checkbox values and convert to display names
        const selectedRoles = $('#roles input:checked').map(function () {
            return roleSkills[$(this).val()].name;
        }).get();

        // Gather visible skill names from rendered badges
        const skills = [];
        $('#skillList .badge').each(function () {
            const skillText = $(this).text().trim(); // Get and trim text content
            if (skillText) {
                skills.push(skillText);
            }
        });

        // Alert user if nothing is selected and prevent file download
        if (selectedRoles.length === 0 && skills.length === 0) {
            alert("Please select at least one role to export.");
            return;
        }

        // Format the download content as plain text
        const content = `Selected Roles:\n${selectedRoles.join(", ")}\n\nAssociated Skills:\n${skills.join(", ")}`;

        // Use Blob to create a text file and trigger a download using a temporary link
        const blob = new Blob([content], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob); // Create a temporary download URL
        link.download = "role-skills.txt";     // Set filename
        link.click();                          // Simulate a click to start the download
    });

    // Skill search filter
    // jQuery .on('keyup') binds live filtering logic to the skill search box
    $('#skillSearch').on('keyup', function () {
        const filter = $(this).val().toLowerCase(); // Get typed input

        // Loop through each badge and toggle its visibility based on text match
        $('#skillList .badge').each(function () {
            const text = $(this).text().toLowerCase(); // Normalize badge text
            $(this).toggle(text.includes(filter)); // Show/hide based on match
        });
    });
});
