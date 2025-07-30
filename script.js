let currentTree = 1;
let partCounter = 0;
let blocks = [];
let newTreeStarted = false; // <-- Fix for skipped Tree ID

function addBlock() {
  // ✅ Fix: handle new tree ID only when block is added
  if (newTreeStarted) {
    currentTree++;
    newTreeStarted = false;
    partCounter = 0;
  }
  document.getElementById("height").focus();


  const heightInput = document.getElementById('height');
  const widthInput = document.getElementById('width');
  const height = parseFloat(heightInput.value);
  const width = parseFloat(widthInput.value);

  if (isNaN(height) || isNaN(width) || height <= 0 || width <= 0) {
    alert("Please enter valid height (in meters) and width (in inches).");
    return;
  }

  // Auto-generate Tree ID with suffixes
  let treeID = `T${currentTree}`;
  if (partCounter > 0) {
    treeID += `(${String.fromCharCode(96 + partCounter)})`; // a, b, c...
  }

  // Calculate area correctly
  const area = ((height * width * width) / 16).toFixed(3);

  const block = {
    id: Date.now(),
    treeID,
    height,
    width,
    area: parseFloat(area)
  };

  blocks.push(block);
  partCounter++;

  updateTable();
  clearInputs();
}

function updateTable() {
  const tbody = document.getElementById('blockTableBody');
  tbody.innerHTML = "";

  let totalArea = 0;

  blocks.forEach((block) => {
    totalArea += block.area;

    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${block.treeID}</td>
      <td><span class="height">${block.height}</span></td>
      <td><span class="width">${block.width}</span></td>
      <td>${block.area}</td>
      <td>
        <button onclick="editBlock(${block.id})">Edit</button>
        <button onclick="deleteBlock(${block.id})">Delete</button>
      </td>
    `;

    tbody.appendChild(row);
  });

  document.getElementById('totalArea').innerText = totalArea.toFixed(3);
}

function clearInputs() {
  document.getElementById('height').value = '';
  document.getElementById('width').value = '';
}

function startNewTree() {
  newTreeStarted = true; // ✅ Tree ID is now deferred
  partCounter = 0;
}

function deleteBlock(id) {
  blocks = blocks.filter(block => block.id !== id);
  updateTable();
}

function editBlock(id) {
  const block = blocks.find(b => b.id === id);
  if (!block) return;

  const newHeight = prompt("Enter new height in meters:", block.height);
  const newWidth = prompt("Enter new width in inches:", block.width);

  const height = parseFloat(newHeight);
  const width = parseFloat(newWidth);

  if (isNaN(height) || isNaN(width) || height <= 0 || width <= 0) {
    alert("Invalid values. Edit cancelled.");
    return;
  }

  const area = ((height * width * width) / 16).toFixed(3);

  block.height = height;
  block.width = width;
  block.area = parseFloat(area);

  updateTable();
}

function resetAll() {
  if (confirm("Are you sure you want to reset everything?")) {
    currentTree = 1;
    partCounter = 0;
    newTreeStarted = false;
    blocks = [];
    updateTable();
  }
}

function generateReport() {
  const reportDiv = document.getElementById('reportSection');
  reportDiv.innerHTML = ""; // Clear previous report

  const table = document.createElement("table");
  table.innerHTML = `
    <thead>
      <tr>
        <th>Tree ID</th>
        <th>Height (m)</th>
        <th>Width (cm)</th>
      </tr>
    </thead>
    <tbody>
      ${blocks.map(block => {
        const heightColor = getHeightColor(block.height);
        const widthCM = block.width * 2.54;
        const widthColor = getWidthColor(widthCM);

        return `
          <tr>
            <td>${block.treeID}</td>
            <td style="background-color:${heightColor};">${block.height}</td>
            <td style="background-color:${widthColor};">${widthCM.toFixed(2)} cm</td>
          </tr>
        `;
      }).join("")}
    </tbody>
  `;
  reportDiv.appendChild(table);

  const legend = document.createElement("div");
  legend.innerHTML = generateLegendHTML();
  reportDiv.appendChild(legend);
}

function getHeightColor(height) {
  if (height < 2) return "yellow";
  if (height < 3) return "orange";
  if (height < 4) return "lightcoral";
  if (height < 5) return "lightgreen";
  if (height < 6) return "lightblue";
  if (height < 7) return "violet";
  return "pink";
}

function getWidthColor(cm) {
  if (cm < 30) return "lightgray";
  if (cm <= 45) return "lightyellow";
  if (cm <= 60) return "lightgreen";
  if (cm <= 75) return "lightcyan";
  if (cm <= 90) return "lightskyblue";
  if (cm <= 105) return "plum";
  if (cm <= 120) return "lightsalmon";
  if (cm <= 135) return "moccasin";
  if (cm <= 150) return "burlywood";
  if (cm <= 180) return "thistle";
  return "tomato";
}

function generateLegendHTML() {
  return `
    <h3>Legend</h3>
    <div style="display: flex; flex-wrap: wrap; gap: 10px;">
      <div><strong>Height Ranges (m):</strong></div>
      <div style="background:yellow;padding:5px;">0–2</div>
      <div style="background:orange;padding:5px;">2–3</div>
      <div style="background:lightcoral;padding:5px;">3–4</div>
      <div style="background:lightgreen;padding:5px;">4–5</div>
      <div style="background:lightblue;padding:5px;">5–6</div>
      <div style="background:violet;padding:5px;">6–7</div>
      <div style="background:pink;padding:5px;">7–8</div>
    </div>
    <br/>
    <div style="display: flex; flex-wrap: wrap; gap: 10px;">
      <div><strong>Width Ranges (cm):</strong></div>
      <div style="background:lightgray;padding:5px;">&lt;30</div>
      <div style="background:lightyellow;padding:5px;">31–45</div>
      <div style="background:lightgreen;padding:5px;">46–60</div>
      <div style="background:lightcyan;padding:5px;">61–75</div>
      <div style="background:lightskyblue;padding:5px;">76–90</div>
      <div style="background:plum;padding:5px;">91–105</div>
      <div style="background:lightsalmon;padding:5px;">106–120</div>
      <div style="background:moccasin;padding:5px;">121–135</div>
      <div style="background:burlywood;padding:5px;">136–150</div>
      <div style="background:thistle;padding:5px;">151–180</div>
      <div style="background:tomato;padding:5px;">181+</div>
    </div>
  `;
}


// Auto focus height field on load
window.onload = () => {
  document.getElementById("height").focus();
};

// Enter key triggers addBlock()
document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addBlock();
  }
});
