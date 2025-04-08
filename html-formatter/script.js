/**
 * Copyright (c) 2025 https://json-formatter.app
 * Released under the MIT License.
 * See LICENSE file in the project root for full license information.
 */

// script.js
document.getElementById('formatHtmlButton').addEventListener('click', function() {
    const inputHtml = document.getElementById('inputHtml').value;

    try {
        if (!inputHtml.trim()) {
            throw new Error("Input cannot be empty.");
        }

        const parser = new DOMParser();
        const parsedDocument = parser.parseFromString(inputHtml, 'text/html');

        const parserError = parsedDocument.getElementsByTagName("parsererror");
        if (parserError.length > 0) {
            throw new Error("Error parsing HTML: " + parserError[0].textContent);
        }

        const formattedHtml = formatHtml(parsedDocument.documentElement);

        const outputHtmlElement = document.getElementById('outputHtml');
        if (outputHtmlElement) {
            outputHtmlElement.textContent = formattedHtml;
        }

        const downloadButton = document.getElementById('downloadLink');
        if (downloadButton) {
            downloadButton.style.display = 'block';
            const link = document.getElementById('formattedFileLink');
            const blob = new Blob([formattedHtml], { type: 'text/html' });
            link.href = URL.createObjectURL(blob);
            link.download = 'formatted.html';
        }
    } catch (error) {
        const outputHtmlElement = document.getElementById('outputHtml');
        if (outputHtmlElement) {
            outputHtmlElement.textContent = 'Error formatting HTML: ' + error.message;
        }
    }
});

function formatHtml(node, indent = 0) {
    const indentSpace = '    ';
    let formattedHtml = '';
    const children = node.childNodes;

    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child.nodeType === Node.ELEMENT_NODE) {
            formattedHtml += `${indentSpace.repeat(indent)}<${child.nodeName.toLowerCase()}`;
            for (let j = 0; j < child.attributes.length; j++) {
                const attr = child.attributes[j];
                formattedHtml += ` ${attr.name}="${attr.value}"`;
            }
            formattedHtml += '>\n';
            formattedHtml += formatHtml(child, indent + 1);
            formattedHtml += `${indentSpace.repeat(indent)}</${child.nodeName.toLowerCase()}>\n`;
        } else if (child.nodeType === Node.TEXT_NODE) {
            const textContent = child.textContent.trim();
            if (textContent) {
                formattedHtml += `${indentSpace.repeat(indent)}${textContent}\n`;
            }
        }
    }

    return formattedHtml;
}

document.getElementById('htmlFile').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const fileStatusElement = document.getElementById('fileStatus');
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('inputHtml').value = e.target.result;
            document.getElementById('formatHtmlButton').click();
        };
        reader.readAsText(file);
        fileStatusElement.textContent = file.name;
    } else {
        fileStatusElement.textContent = 'No file selected';
    }
});

document.getElementById('copyButton').addEventListener('click', function() {
    const outputHtml = document.getElementById('outputHtml').textContent;
    navigator.clipboard.writeText(outputHtml).then(() => {
        alert('Formatted HTML copied to clipboard!');
    }).catch(err => {
        alert('Failed to copy: ', err);
    });
});
