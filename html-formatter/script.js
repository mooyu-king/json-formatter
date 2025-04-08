document.getElementById('formatHtmlButton').addEventListener('click', function() {
    const inputHtml = document.getElementById('inputHtml').value;

    try {
        // 检查输入的 HTML 是否有效
        if (!inputHtml.trim()) {
            throw new Error("Input cannot be empty.");
        }

        // 尝试解析输入的 HTML
        const parser = new DOMParser();
        const parsedDocument = parser.parseFromString(inputHtml, 'text/html');

        // 检查是否存在解析错误
        const parserError = parsedDocument.getElementsByTagName("parsererror");
        if (parserError.length > 0) {
            throw new Error("Error parsing HTML: " + parserError[0].textContent);
        }

        // 使用自定义的格式化逻辑
        const formattedHtml = formatHtml(parsedDocument.documentElement);

        const outputHtmlElement = document.getElementById('outputHtml');
        if (outputHtmlElement) {
            outputHtmlElement.textContent = formattedHtml;
        }

        // 显示下载按钮
        const downloadButton = document.getElementById('downloadLink');
        if (downloadButton) {
            downloadButton.style.display = 'block'; // 显示下载链接
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

// 自定义格式化函数
function formatHtml(node, indent = 0) {
    const indentSpace = '    '; // 每层缩进使用4个空格
    let formattedHtml = '';
    const children = node.childNodes;

    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child.nodeType === Node.ELEMENT_NODE) {
            // 添加缩进和开始标签
            formattedHtml += `${indentSpace.repeat(indent)}<${child.nodeName.toLowerCase()}`;
            for (let j = 0; j < child.attributes.length; j++) {
                const attr = child.attributes[j];
                formattedHtml += ` ${attr.name}="${attr.value}"`;
            }
            formattedHtml += '>\n';
            // 递归处理子节点
            formattedHtml += formatHtml(child, indent + 1);
            // 添加缩进和结束标签
            formattedHtml += `${indentSpace.repeat(indent)}</${child.nodeName.toLowerCase()}>\n`;
        } else if (child.nodeType === Node.TEXT_NODE) {
            // 处理文本节点
            const textContent = child.textContent.trim();
            if (textContent) {
                formattedHtml += `${indentSpace.repeat(indent)}${textContent}\n`;
            }
        }
    }

    return formattedHtml;
}

// 处理上传文件
document.getElementById('htmlFile').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const fileStatusElement = document.getElementById('fileStatus'); // 找到显示文件状态的元素
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('inputHtml').value = e.target.result; // 将文件内容填入输入框
            document.getElementById('formatHtmlButton').click(); // 自动格式化
        };
        reader.readAsText(file);
        fileStatusElement.textContent = file.name; // 显示文件名
    } else {
        fileStatusElement.textContent = 'No file selected'; // 如果没有文件，则显示默认信息
    }
});

// 复制格式化结果到剪贴板的功能
document.getElementById('copyButton').addEventListener('click', function() {
    const outputHtml = document.getElementById('outputHtml').textContent;
    navigator.clipboard.writeText(outputHtml).then(() => {
        alert('Formatted HTML copied to clipboard!');
    }).catch(err => {
        alert('Failed to copy: ', err);
    });
});
