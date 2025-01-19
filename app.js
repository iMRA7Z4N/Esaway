const exams = [
    {
        code: "12345",
        title: "FB-MATH-EXAM-V1-2025-1-18",
        questions: [
            { question: "ما هو 2 + 2؟", options: ["3", "4", "5"], answer: "4" },
            { question: "ما هو 3 * 3؟", options: ["6", "8", "9"], answer: "9" },
            { question: "انت حلو ؟", options: ["ايوه", "يب", "جميع ماسبق"], answer: "جميع ماسبق" },
        ],
        duration: 300,
    },
    {
        code: "ADMIN",
        title: "ADMIN STATION",
        questions: [],
        duration: 99999999999999,
    },
];


let currentExam, currentQuestionIndex = 0, timer, timeLeft, userAnswers;

document.getElementById("login-btn").addEventListener("click", () => {
    const code = document.getElementById("code").value.trim();
    const loginMessage = document.getElementById("login-message");

    currentExam = exams.find(exam => exam.code === code);
    if (currentExam) {
        loginMessage.textContent = "تم تسجيل الدخول بنجاح!";
        loginMessage.style.color = "green";
        updateExamTitle(code); // Update the title based on the exam code
        startTest();
    } else {
        loginMessage.textContent = "كود غير صحيح!";
        loginMessage.style.color = "red";
    }
});

function startTest() {
    // Hide the login section and show the test section
    document.getElementById("login-section").hidden = true;
    document.getElementById("test-section").hidden = false;

    // Initialize timer and user answers
    timeLeft = currentExam.duration;
    userAnswers = Array(currentExam.questions.length).fill(null);

    // Load the first question and start the timer
    loadQuestion();
    startTimer(currentExam.duration);
}

function loadQuestion() {
    const questionContainer = document.getElementById("question-container");
    const question = currentExam.questions[currentQuestionIndex];

    // Generate the question and options as HTML
    questionContainer.innerHTML = `
        <p>${currentQuestionIndex + 1}. ${question.question}</p>
        ${question.options
            .map(
                (option) => `
                <label>
                    <input type="radio" name="q${currentQuestionIndex}" value="${option}"
                        ${userAnswers[currentQuestionIndex] === option ? "checked" : ""}
                        onchange="saveAnswer('${option}')">
                    ${option}
                </label>
            `
            )
            .join("")}
    `;

    // Update navigation buttons and render the sidebar
    updateNavigationButtons();
    renderSidebar();
}

function updateNavigationButtons() {
    document.getElementById("prev-btn").disabled = currentQuestionIndex === 0;
    document.getElementById("next-btn").disabled = currentQuestionIndex === currentExam.questions.length - 1;
}

function saveAnswer(answer) {
    userAnswers[currentQuestionIndex] = answer;
    updateProgressBar();
}

function startTimer(duration) {
    timeLeft = duration;
    const timerElement = document.getElementById("time");
    timer = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
        timeLeft--;
        if (timeLeft < 0) {
            clearInterval(timer);
            alert("تم تسليم الاجابات");
            submitTest();
        }
    }, 1000);
}

function updateProgressBar() {
    const answeredQuestions = userAnswers.filter(answer => answer !== null).length;
    const totalQuestions = currentExam.questions.length;
    const progressPercentage = (answeredQuestions / totalQuestions) * 100;

    document.getElementById("progress-percentage").textContent = `${Math.round(progressPercentage)}%`;
    document.getElementById("progress-bar").style.width = `${progressPercentage}%`;
}

function navigateQuestion(direction) {
    currentQuestionIndex += direction;
    loadQuestion();
}

function submitTest() {
    clearInterval(timer);
    const score = userAnswers.filter((ans, i) => ans === currentExam.questions[i].answer).length;

    document.getElementById("test-section").hidden = true;
    document.getElementById("result-section").hidden = false;
    document.getElementById("result-message").textContent = `لقد حصلت على ${score} من ${currentExam.questions.length}`;
}

function renderSidebar() {
    const sidebarList = document.getElementById("question-list");
    sidebarList.innerHTML = currentExam.questions.map((_, index) => 
        `<li>
            <button onclick="goToQuestion(${index})" 
                class="${userAnswers[index] ? 'answered' : ''}">
                السؤال ${index + 1}
            </button>
        </li>`).join("");
}

function goToQuestion(index) {
    currentQuestionIndex = index;
    loadQuestion();
}

function resetApp() {
    userAnswers = [];
    currentQuestionIndex = 0;
    document.getElementById("result-section").hidden = true;
    document.getElementById("login-section").hidden = false;
}

function toggleTheme() {
    document.body.classList.toggle("dark-mode");
}

function clearAnswer() {
    userAnswers[currentQuestionIndex] = null; // Clear the current answer
    loadQuestion(); // Reload the question
    updateProgressBar(); // Update the progress bar
}

// Update exam title and question count based on code
function updateExamTitle(code) {
    const exam = exams.find((exam) => exam.code === code);
    const titleElement = document.getElementById("exam-title");
    const questionCountElement = document.getElementById("question-count");

    if (exam) {
        titleElement.textContent = exam.title; // Update title
        questionCountElement.textContent = `عدد الأسئلة: ${exam.questions.length}`; // Show question count
    } else {
        titleElement.textContent = "اختبار غير موجود"; // If the code doesn't exist
        questionCountElement.textContent = "";
    }
}

function toggleTheme() {
    const body = document.body;
    body.classList.toggle("dark-theme");
}

// قائمة عناوين الـ IP المسموح بها
const allowedIPs = ["154.178.229.65"];
let userIP = null;

// تخزين قائمة الامتحانات

// وظيفة لجلب عنوان IP الخاص بالمستخدم
async function fetchUserIP() {
    try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        userIP = data.ip;
        console.log("IP الخاص بك:", userIP);
    } catch (error) {
        console.error("فشل في جلب عنوان IP:", error);
    }
}

// التحقق من صلاحية عنوان IP قبل تنفيذ أي إجراء
function isAllowed() {
    if (!allowedIPs.includes(userIP)) {
        alert("عذراً، ليس لديك صلاحية للقيام بهذا الإجراء.");
        return false;
    }
    return true;
}

// عرض نموذج إضافة سؤال
function showAddQuestionForm() {
    if (!isAllowed()) return; // التحقق من الـ IP
    document.getElementById("add-question-form").style.display = "block";
}

// إخفاء نموذج إضافة سؤال
function hideAddQuestionForm() {
    document.getElementById("add-question-form").style.display = "none";
}

// إضافة سؤال جديد
function addQuestion() {
    if (!isAllowed()) return; // التحقق من الـ IP

    const examCode = document.getElementById("exam-code").value.trim();
    const questionText = document.getElementById("question-text").value.trim();
    const optionsText = document.getElementById("options").value.trim();
    const correctAnswer = document.getElementById("correct-answer").value.trim();

    if (!examCode || !questionText || !optionsText || !correctAnswer) {
        alert("يرجى تعبئة جميع الحقول!");
        return;
    }

    const options = optionsText.split(",").map(option => option.trim());

    // البحث عن الامتحان أو إنشاؤه إذا لم يكن موجودًا
    let exam = exams.find(e => e.code === examCode);
    if (!exam) {
        exam = { code: examCode, questions: [] };
        exams.push(exam);
    }

    // إضافة السؤال إلى الامتحان
    exam.questions.push({
        question: questionText,
        options: options,
        answer: correctAnswer
    });

    alert("تمت إضافة السؤال بنجاح!");
    hideAddQuestionForm();
}

// عرض نموذج إضافة اختبار جديد
function showAddExamForm() {
    if (!isAllowed()) return; // التحقق من الـ IP
    document.getElementById("add-exam-form").style.display = "block";
}

// إخفاء نموذج إضافة اختبار جديد
function hideAddExamForm() {
    document.getElementById("add-exam-form").style.display = "none";
}

// إضافة اختبار جديد
function addNewExam() {
    if (!isAllowed()) return; // التحقق من الـ IP

    const code = document.getElementById("new-exam-code").value.trim();
    const title = document.getElementById("new-exam-title").value.trim();
    const duration = parseInt(document.getElementById("new-exam-duration").value.trim());

    if (!code || !title || isNaN(duration)) {
        alert("يرجى ملء جميع الحقول بشكل صحيح!");
        return;
    }

    // التحقق من عدم تكرار كود الاختبار
    if (exams.find(exam => exam.code === code)) {
        alert("هذا الكود مستخدم بالفعل لاختبار آخر!");
        return;
    }

    // إضافة الاختبار الجديد إلى القائمة
    exams.push({
        code: code,
        title: title,
        questions: [], // يبدأ بدون أسئلة
        duration: duration
    });

    alert("تمت إضافة الاختبار بنجاح!");
    hideAddExamForm();
}

// استدعاء وظيفة جلب عنوان IP عند تحميل الصفحة
fetchUserIP();

// حفظ الامتحانات في LocalStorage
function saveExamsToLocalStorage() {
    localStorage.setItem("exams", JSON.stringify(exams));
}

// تحميل الامتحانات من LocalStorage
function loadExamsFromLocalStorage() {
    const savedExams = localStorage.getItem("exams");
    if (savedExams) {
        exams = JSON.parse(savedExams);
    }
}

// عند تحميل الصفحة، تحميل الامتحانات من LocalStorage
document.addEventListener("DOMContentLoaded", () => {
    loadExamsFromLocalStorage();
});

// إضافة سؤال جديد مع حفظه
function addQuestion() {
    const examCode = document.getElementById("exam-code").value.trim();
    const questionText = document.getElementById("question-text").value.trim();
    const optionsText = document.getElementById("options").value.trim();
    const correctAnswer = document.getElementById("correct-answer").value.trim();

    if (!examCode || !questionText || !optionsText || !correctAnswer) {
        alert("يرجى تعبئة جميع الحقول!");
        return;
    }

    const options = optionsText.split(",").map(option => option.trim());

    // البحث عن الامتحان أو إنشاؤه إذا لم يكن موجودًا
    let exam = exams.find(e => e.code === examCode);
    if (!exam) {
        exam = { code: examCode, title: "اختبار جديد", questions: [], duration: 300 };
        exams.push(exam);
    }

    // إضافة السؤال إلى الامتحان
    exam.questions.push({
        question: questionText,
        options: options,
        answer: correctAnswer
    });

    saveExamsToLocalStorage(); // حفظ التغييرات في LocalStorage
    alert("تمت إضافة السؤال بنجاح!");
    hideAddQuestionForm();
}

// إضافة اختبار جديد مع حفظه
function addNewExam() {
    const code = document.getElementById("new-exam-code").value.trim();
    const title = document.getElementById("new-exam-title").value.trim();
    const duration = parseInt(document.getElementById("new-exam-duration").value.trim());

    if (!code || !title || isNaN(duration)) {
        alert("يرجى ملء جميع الحقول بشكل صحيح!");
        return;
    }

    if (exams.find(exam => exam.code === code)) {
        alert("هذا الكود مستخدم بالفعل لاختبار آخر!");
        return;
    }

    exams.push({
        code: code,
        title: title,
        questions: [],
        duration: duration
    });

    saveExamsToLocalStorage(); // حفظ التغييرات في LocalStorage
    alert("تمت إضافة الاختبار بنجاح!");
    hideAddExamForm();
}
