// Helper function to format dates as "Month Year"
function formatDate(dateStr) {
    if (!dateStr)
        return "Present";
    var date = new Date(dateStr);
    var options = { month: "short", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
}
document.addEventListener("DOMContentLoaded", function () {
    var _a, _b;
    var form = document.getElementById("resume-form");
    // Add dynamic skill fields
    (_a = document.getElementById("add-skill")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
        var container = document.getElementById("skills-container");
        var skillItem = document.createElement("div");
        skillItem.classList.add("skills-item");
        skillItem.innerHTML = "\n            <label>Skill:</label>\n            <input type=\"text\" class=\"skill-input\" placeholder=\"Enter skill\" required>\n        ";
        container.appendChild(skillItem);
    });
    // Add and remove bullet points
    function addBulletEvent(containerClass, bulletInputClass, addButtonClass, listClass) {
        document.addEventListener("click", function (e) {
            var _a;
            var target = e.target;
            // Add Bullet Point
            if (target.classList.contains(addButtonClass)) {
                var parent_1 = target.closest(".".concat(containerClass));
                var input = parent_1.querySelector(".".concat(bulletInputClass));
                var ul = parent_1.querySelector(".".concat(listClass));
                if (input.value.trim()) {
                    var li = document.createElement("li");
                    li.innerHTML = "".concat(input.value.trim(), " <button type=\"button\" class=\"remove-bullet\">X</button>");
                    ul.appendChild(li);
                    input.value = ""; // Clear input
                }
            }
            // Remove Bullet Point
            if (target.classList.contains("remove-bullet")) {
                (_a = target.closest("li")) === null || _a === void 0 ? void 0 : _a.remove();
            }
        });
    }
    addBulletEvent("experience-item", "experience-detail-input", "add-experience-bullet", "experience-details");
    addBulletEvent("education-item", "education-detail-input", "add-education-bullet", "education-details");
    // Save form data to localStorage
    form === null || form === void 0 ? void 0 : form.addEventListener("submit", function (e) {
        e.preventDefault();
        var name = document.getElementById("name").value;
        var title = document.getElementById("title").value;
        var contact = document.getElementById("contact").value;
        var objective = document.getElementById("objective").value;
        var experiences = [];
        document.querySelectorAll(".experience-item").forEach(function (item) {
            var role = item.querySelector(".experience-role").value;
            var start = item.querySelector(".experience-start").value;
            var end = item.querySelector(".experience-end").value || "Present";
            var details = [];
            item.querySelectorAll(".experience-details li").forEach(function (li) {
                var _a;
                details.push(((_a = li.textContent) === null || _a === void 0 ? void 0 : _a.replace("X", "").trim()) || "");
            });
            experiences.push({ role: role, start: start, end: end, details: details });
        });
        var education = [];
        document.querySelectorAll(".education-item").forEach(function (item) {
            var degree = item.querySelector(".education-degree").value;
            var institute = item.querySelector(".education-institute").value;
            var start = item.querySelector(".education-start").value;
            var end = item.querySelector(".education-end").value;
            var details = [];
            item.querySelectorAll(".education-details li").forEach(function (li) {
                var _a;
                details.push(((_a = li.textContent) === null || _a === void 0 ? void 0 : _a.replace("X", "").trim()) || "");
            });
            education.push({ degree: degree, institute: institute, start: start, end: end, details: details });
        });
        var skills = [];
        document.querySelectorAll(".skill-input").forEach(function (skillInput) {
            skills.push(skillInput.value.trim());
        });
        var resumeData = { name: name, title: title, contact: contact, objective: objective, experiences: experiences, education: education, skills: skills };
        localStorage.setItem("resumeData", JSON.stringify(resumeData));
        window.location.href = "resume.html";
    });
    // Load data into resume template
    var resumeData = localStorage.getItem("resumeData");
    if (resumeData) {
        var data = JSON.parse(resumeData);
        document.getElementById("name").textContent = data.name || "";
        document.getElementById("title").textContent = data.title || "";
        document.getElementById("contact").textContent = data.contact || "";
        document.getElementById("objective").textContent = data.objective || "";
        var experienceList_1 = document.getElementById("experience-list");
        data.experiences.forEach(function (exp) {
            var startFormatted = formatDate(exp.start);
            var endFormatted = exp.end === "Present" ? "Present" : formatDate(exp.end);
            var div = document.createElement("div");
            div.innerHTML = "\n                <div class=\"title-format\">\n                    <h4>".concat(exp.role, "</h4> \n                    <h4 class=\"fw-400\">").concat(startFormatted, " - ").concat(endFormatted, "</h4>\n                </div>\n                <ul>\n                    ").concat(exp.details.map(function (detail) { return "<li>".concat(detail.trim(), "</li>"); }).join(""), "\n                </ul>\n            ");
            experienceList_1.appendChild(div);
        });
        var educationList_1 = document.getElementById("education-list");
        data.education.forEach(function (edu) {
            var startFormatted = formatDate(edu.start);
            var endFormatted = formatDate(edu.end);
            var div = document.createElement("div");
            div.innerHTML = "\n                <div class=\"title-format\">\n                    <h4>".concat(edu.degree, "</h4> \n                    <h4 class=\"fw-400\">").concat(startFormatted, " - ").concat(endFormatted, "</h4>\n                </div>\n                <ul>\n                    ").concat(edu.details.map(function (detail) { return "<li>".concat(detail.trim(), "</li>"); }).join(""), "\n                </ul>\n            ");
            educationList_1.appendChild(div);
        });
        var skillsList_1 = document.getElementById("skills-list");
        data.skills.forEach(function (skill) {
            var li = document.createElement("li");
            li.textContent = skill;
            skillsList_1.appendChild(li);
        });
    }
    // PDF Generation
    (_b = document.getElementById("download-btn")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", function () {
        var resume = document.getElementById("resume");
        var opt = {
            margin: 0, // Uniform margins
            filename: "Resume.pdf",
            image: { type: "jpeg", quality: 1 }, // High-quality rendering
            html2canvas: {
                scale: 1, // Keeps high resolution without overscaling
                scrollY: 0, // Prevents scrolling issues
                useCORS: true // Ensures external fonts and images are loaded
            },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
        };
        html2pdf()
            .set(opt)
            .from(resume)
            .save();
    });
});
