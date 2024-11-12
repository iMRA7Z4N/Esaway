// دالة للترجمة التلقائية
function translateText() {
    var fromLang = document.getElementById("from-lang").value;
    var toLang = document.getElementById("to-lang").value;
    var inputText = document.getElementById("input-text").value;

    if (inputText.trim() === "") {
        document.getElementById("output-text").value = "";
        return;
    }

    // استخدام API للترجمة (مثل Google Translate أو أي خدمة أخرى)
    var url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(inputText)}&langpair=${fromLang}|${toLang}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            // عرض الترجمة في مربع النص
            document.getElementById("output-text").value = data.responseData.translatedText;
        })
        .catch(error => {
            console.error("Error translating text:", error);
        });
}

// دالة لنسخ الرابط
function copyLink() {
    var copyText = window.location.href;
    navigator.clipboard.writeText(copyText).then(function() {
        alert("تم نسخ الرابط إلى الحافظة!");
    }, function() {
        alert("فشل نسخ الرابط.");
    });
}
