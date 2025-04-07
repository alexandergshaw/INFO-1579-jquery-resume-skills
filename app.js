$(document).ready(() => {
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

    function updateSkills() {
        const selected = $('#roles input:checked').map(function () {
            return $(this).val();
        }).get();

        const skillMap = {};

        selected.forEach(roleKey => {
            const skills = roleSkills[roleKey].skills;
            for (const [skill, tooltip] of Object.entries(skills)) {
                if (!skillMap[skill]) {
                    skillMap[skill] = { count: 1, tooltip };
                } else {
                    skillMap[skill].count++;
                }
            }
        });

        const $skillList = $('#skillList');
        $skillList.empty();

        const sortedSkills = Object.keys(skillMap).sort();

        sortedSkills.forEach(skill => {
            const info = skillMap[skill];
            const shared = info.count > 1 ? 'shared' : '';
            const tooltip = info.tooltip;
            const $badge = $(`<span class="badge ${shared}" title="${tooltip}">${skill}</span>`);
            $badge.hide().appendTo($skillList).fadeIn(300);
        });

        $('#skills').slideDown();
    }

    $('#roles input[type="checkbox"]').change(updateSkills);

    $('#roleSearch').on('keyup', function () {
        const filter = $(this).val().toLowerCase();
        $('#roles .role-option').each(function () {
            const text = $(this).text().toLowerCase();
            $(this).toggle(text.includes(filter));
        });
    });

    $('#exportBtn').click(() => {
        // Get selected roles and map them to display names
        const selectedRoles = $('#roles input:checked').map(function () {
            return roleSkills[$(this).val()].name;
        }).get();

        // Collect skill text from currently visible badges
        const skills = [];
        $('#skillList .badge').each(function () {
            const skillText = $(this).text().trim();
            if (skillText) {
                skills.push(skillText);
            }
        });

        // If nothing is selected, show a message and skip download
        if (selectedRoles.length === 0 && skills.length === 0) {
            alert("Please select at least one role to export.");
            return;
        }

        // Format content
        const content = `Selected Roles:\n${selectedRoles.join(", ")}\n\nAssociated Skills:\n${skills.join(", ")}`;

        // Create and trigger download
        const blob = new Blob([content], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = "role-skills.txt";
        link.click();
    });
    $('#skillSearch').on('keyup', function () {
        const filter = $(this).val().toLowerCase();

        $('#skillList .badge').each(function () {
            const text = $(this).text().toLowerCase();
            $(this).toggle(text.includes(filter));
        });
    });
});
