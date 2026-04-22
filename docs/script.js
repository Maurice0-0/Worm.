let count = 0;

const countElement = document.getElementById("count");
const plusBtn = document.getElementById("plusBtn");
const minusBtn = document.getElementById("minusBtn");
const resetBtn = document.getElementById("resetBtn");

function updateDisplay() {
  countElement.textContent = count;
}

plusBtn.addEventListener("click", function () {
  count++;
  updateDisplay();
});

minusBtn.addEventListener("click", function () {
  count--;
  updateDisplay();
});

resetBtn.addEventListener("click", function () {
  count = 0;
  updateDisplay();
});