/**
 * Copyright (c) 2025 https://json-formatter.app
 * Released under the MIT License.
 * See LICENSE file in the project root for full license information.
 */

// script.js
function parseJSON() {
    const inputJson = document.getElementById("inputJson").value;
    try {
        const jsonObj = JSON.parse(inputJson);
        const output = generateOutput(jsonObj);
        document.getElementById("outputJson").innerHTML = output;

        var coll = document.getElementsByClassName("collapsible");
        for (var i = 0; i < coll.length; i++) {
            coll[i].addEventListener("click", function() {
                this.classList.toggle("active");
                var content = this.nextElementSibling;
                if (content.style.display === "block") {
                    content.style.display = "none";
                } else {
                    content.style.display = "block";
                }
                this.querySelector('.expand-text').textContent =
                    this.classList.contains('active') ? 'Collapse' : 'Expand';
            });
        }
    } catch (e) {
        document.getElementById("outputJson").textContent = "Invalid JSON: " + e.message;
    }
}

function generateOutput(jsonObj) {
    let output = '<button class="collapsible ind">array [' + jsonObj.length + '] <span class="expand-text">Expand</span></button><div class="content">';
    jsonObj.forEach((item, index) => {
        output += `<button class="collapsible ind index-ind">Index ${index} [{` + Object.keys(item).length + '}]</button>' +
            '<div class="content">';
        Object.entries(item).forEach(([key, value]) => {
            output += `<div>${key}: ${value}</div>`;
        });
        output += '</div>';
    });
    output += '</div>';
    return output;
}
