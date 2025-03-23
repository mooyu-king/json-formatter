/**
 * Copyright (c) 2025 https://json-formatter.app
 * Released under the MIT License.
 * See LICENSE file in the project root for full license information.
 */

// script.js
const translations = {
    en: {
        inputTitle: "Input XML Text",
        uploadTitle: "Upload XML File",
        outputTitle: "Formatted XML Text",
        formatXmlButton: "Format XML",
        uploadXmlButton: "Upload and Format",
        copyButton: "Copy to Clipboard",
        downloadText: "Download formatted file:",
        invalidXml: "Invalid XML file",
        copied: "Copied to clipboard!",
        copyFailed: "Copy failed!",
        noFileSelected: "No file selected",
        chooseFile: "Choose File",
    }
};

function updateLanguage(lang) {
    document.getElementById('inputTitle').textContent = translations[lang].inputTitle;
    document.getElementById('uploadTitle').textContent = translations[lang].uploadTitle;
    document.getElementById('outputTitle').textContent = translations[lang].outputTitle;
    document.getElementById('formatXmlButton').textContent = translations[lang].formatXmlButton;
    document.getElementById('uploadXmlButton').textContent = translations[lang].uploadXmlButton;
    document.getElementById('copyButton').textContent = translations[lang].copyButton;
    document.getElementById('downloadText').textContent = translations[lang].downloadText;
    document.getElementById('fileStatus').textContent = translations[lang].noFileSelected;
    document.getElementById('fileLabel').textContent = translations[lang].chooseFile;
}

document.getElementById('language').addEventListener('change', function() {
    const lang = this.value;
    updateLanguage(lang);
});

updateLanguage('en');

function updateLanguage(lang) {
    document.getElementById('inputTitle').textContent = translations[lang].inputTitle;
    document.getElementById('uploadTitle').textContent = translations[lang].uploadTitle;
    document.getElementById('outputTitle').textContent = translations[lang].outputTitle;
    document.getElementById('formatXmlButton').textContent = translations[lang].formatXmlButton;
    document.getElementById('uploadXmlButton').textContent = translations[lang].uploadXmlButton;
    document.getElementById('copyButton').textContent = translations[lang].copyButton;
    document.getElementById('downloadText').textContent = translations[lang].downloadText;
    document.getElementById('fileStatus').textContent = translations[lang].noFileSelected;
    document.getElementById('fileLabel').textContent = translations[lang].chooseFile;
}

document.getElementById('formatXmlButton').addEventListener('click', function() {
    formatXml();
});

document.getElementById('xmlFile').addEventListener('change', function() {
    if (this.files.length > 0) {
        const file = this.files[0];
        document.getElementById('fileStatus').textContent = file.name;
    } else {
        document.getElementById('fileStatus').textContent = translations[document.getElementById('language').value].noFileSelected;
    }
});

document.getElementById('uploadXmlButton').addEventListener('click', function() {
    const fileInput = document.getElementById('xmlFile');
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                validateAndFormatXml(event.target.result, file.name);
            } catch (e) {
                console.error("Error parsing XML:", e);
                alert(translations[document.getElementById('language').value].invalidXml);
            }
        };
        reader.readAsText(file);
    } else {
        alert(translations[document.getElementById('language').value].noFileSelected);
    }
});

function formatXml(xmlString) {
    const inputText = xmlString || document.getElementById('inputXml').value;
    validateAndFormatXml(inputText);
}

function validateAndFormatXml(inputText, fileName = '') {
    try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(inputText, "text/xml");

        const parseError = xmlDoc.getElementsByTagName("parsererror");
        if (parseError.length > 0) {
            throw new Error("Invalid XML input: " + parseError[0].textContent);
        }

        const serializer = new XMLSerializer();
        const formattedXml = serializer.serializeToString(xmlDoc);
        document.getElementById('outputXml').textContent = vkbeautify.xml(formattedXml, 2);
        if (fileName) {
            showDownloadLink(vkbeautify.xml(formattedXml, 2), fileName);
        }
    } catch (error) {
        document.getElementById('inputXml').classList.add('error');
        alert(translations[document.getElementById('language').value].invalidXml);
    }
}

function showDownloadLink(formattedXml, originalFileName) {
    const blob = new Blob([formattedXml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.getElementById('formattedFileLink');
    link.href = url;
    link.download = originalFileName.replace('.xml', '-formatted.xml');
    link.textContent = 'Download ' + originalFileName.replace('.xml', '-formatted.xml');
    document.getElementById('downloadLink').style.display = 'block';
}
