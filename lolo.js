document.addEventListener("DOMContentLoaded", () => {
  const display = document.getElementById("timer-display");
  const historyList = document.getElementById("history");
  const startBtn = document.getElementById("startBtn");
  const stopBtn = document.getElementById("stopBtn");
  const resetBtn = document.getElementById("resetBtn");
  const clearHistoryBtn = document.getElementById("clearHistoryBtn");

  let timer = null;
  let startTime = 0;
  let elapsedTime = 0;
  let isRunning = false;

  function formatTime(ms) {
      let hours = Math.floor(ms / (1000 * 60 * 60));
      let minutes = Math.floor((ms / (1000 * 60)) % 60);
      let seconds = Math.floor((ms / 1000) % 60);
      let milliseconds = Math.floor((ms % 1000) / 10);

      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}:${String(milliseconds).padStart(2, "0")}`;
  }

  function updateTimer() {
      elapsedTime = Date.now() - startTime;
      display.textContent = formatTime(elapsedTime);
  }

  function startTimer() {
      if (!isRunning) {
          startTime = Date.now() - elapsedTime;
          timer = setInterval(updateTimer, 10);
          isRunning = true;
      }
  }

  function stopTimer() {
      if (isRunning) {
          clearInterval(timer);
          elapsedTime = Date.now() - startTime;
          isRunning = false;
      }
  }

  function resetTimer() {
      if (elapsedTime > 0) {
          saveHistory();
      }
      clearInterval(timer);
      elapsedTime = 0;
      isRunning = false;
      display.textContent = "00:00:00:00";
  }

  function saveHistory() {
      const now = new Date();
      const entry = {
          date: now.toLocaleDateString(),
          time: now.toLocaleTimeString(),
          duration: display.textContent
      };

      let history = JSON.parse(localStorage.getItem("timerHistory")) || [];
      history.unshift(entry);
      localStorage.setItem("timerHistory", JSON.stringify(history));
      renderHistory();
  }

  function renderHistory() {
      historyList.innerHTML = "";
      const history = JSON.parse(localStorage.getItem("timerHistory")) || [];

      history.forEach(entry => {
          let listItem = document.createElement("li");
          listItem.textContent = `${entry.date} - ${entry.time}: ${entry.duration}`;
          listItem.classList.add("history-item");
          historyList.appendChild(listItem);
      });
  }

  function clearHistory() {
      localStorage.removeItem("timerHistory");
      historyList.innerHTML = "";
  }

  startBtn.addEventListener("click", startTimer);
  stopBtn.addEventListener("click", stopTimer);
  resetBtn.addEventListener("click", resetTimer);
  clearHistoryBtn.addEventListener("click", clearHistory);

  renderHistory();
});
