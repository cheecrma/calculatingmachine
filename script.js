// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    initShapeSelector();
    initCalcTypeSelector();
    initSubCalcSelector();
    initHexCalcSelector();
});

// Shape Selector
function initShapeSelector() {
    const shapeButtons = document.querySelectorAll('.shape-btn');
    const sections = document.querySelectorAll('.calc-section');

    shapeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const shape = this.dataset.shape;

            // Update active button
            shapeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Show corresponding section
            sections.forEach(s => s.classList.remove('active'));
            document.getElementById(`${shape}-section`).classList.add('active');
        });
    });
}

// Calc Type Selector (for triangle)
function initCalcTypeSelector() {
    const calcTypeButtons = document.querySelectorAll('.calc-type-btn');

    calcTypeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const calcType = this.dataset.calc;
            const parent = this.closest('.calc-section');

            // Update active button
            parent.querySelectorAll('.calc-type-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Show corresponding panel
            parent.querySelectorAll('.calc-panel').forEach(p => p.classList.remove('active'));
            document.getElementById(`triangle-${calcType}`).classList.add('active');
        });
    });
}

// Sub Calc Selector (for triangle angles)
function initSubCalcSelector() {
    const subCalcButtons = document.querySelectorAll('.sub-calc-btn[data-subcalc]');

    subCalcButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const subCalc = this.dataset.subcalc;
            const parent = this.closest('.calc-panel');

            // Update active button
            parent.querySelectorAll('.sub-calc-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Show corresponding panel
            parent.querySelectorAll('.sub-panel').forEach(p => p.classList.remove('active'));
            document.getElementById(`${subCalc}-panel`).classList.add('active');
        });
    });
}

// Hex Calc Selector
function initHexCalcSelector() {
    const hexCalcButtons = document.querySelectorAll('.sub-calc-btn[data-hexcalc]');

    hexCalcButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const hexCalc = this.dataset.hexcalc;
            const parent = this.closest('.calc-section');

            // Update active button
            parent.querySelectorAll('.sub-calc-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Show corresponding panel
            parent.querySelectorAll('.sub-panel').forEach(p => p.classList.remove('active'));
            document.getElementById(`hex-${hexCalc}-panel`).classList.add('active');
        });
    });
}

// Triangle - Sides Calculation (Pythagorean theorem for right triangle)
function calculateTriangleSides() {
    const a = parseFloat(document.getElementById('tri-a').value);
    const b = parseFloat(document.getElementById('tri-b').value);

    if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) {
        alert('올바른 값을 입력해주세요.');
        return;
    }

    // Calculate hypotenuse
    const c = Math.sqrt(a * a + b * b);

    // Calculate angles
    const angleA = Math.atan(b / a) * (180 / Math.PI);
    const angleB = Math.atan(a / b) * (180 / Math.PI);

    // Draw SVG
    drawTriangleSides('triangle-sides-svg', a, b, c, angleA, angleB);

    // Show results
    const resultArea = document.getElementById('triangle-sides-result');
    const valuesDiv = document.getElementById('triangle-sides-values');

    valuesDiv.innerHTML = `
        <div class="result-item">
            <span class="result-label">밑변 A</span>
            <span class="result-value">${a.toFixed(3)} mm</span>
        </div>
        <div class="result-item">
            <span class="result-label">높이 B</span>
            <span class="result-value">${b.toFixed(3)} mm</span>
        </div>
        <div class="result-item">
            <span class="result-label">빗변 C</span>
            <span class="result-value result-highlight">${c.toFixed(3)} mm</span>
        </div>
        <div class="result-item">
            <span class="result-label">각도 α (밑변과 빗변 사이)</span>
            <span class="result-value">${angleA.toFixed(3)}°</span>
        </div>
        <div class="result-item">
            <span class="result-label">각도 β (높이와 빗변 사이)</span>
            <span class="result-value">${angleB.toFixed(3)}°</span>
        </div>
    `;

    resultArea.classList.add('show');
}

// Draw Triangle for Sides Calculation
function drawTriangleSides(svgId, a, b, c, angleA, angleB) {
    const svg = document.getElementById(svgId);
    const width = 300;
    const height = 260;
    const padding = 70;
    const rightPadding = 90;

    // Scale to fit (leave more room on right for labels)
    const maxDim = Math.max(a, b);
    const availableWidth = width - padding - rightPadding;
    const availableHeight = height - padding * 2;
    const scale = Math.min(availableWidth / a, availableHeight / b) * 0.85;

    const scaledA = a * scale;
    const scaledB = b * scale;

    // Triangle points (right triangle)
    const x1 = padding;
    const y1 = height - padding + 10;
    const x2 = padding + scaledA;
    const y2 = height - padding + 10;
    const x3 = padding;
    const y3 = height - padding + 10 - scaledB;

    // Clamp text positions within bounds
    const midX = Math.min((x1 + x2) / 2, width - 50);
    const hypLabelX = Math.min((x2 + x3) / 2 + 15, width - 60);
    const hypLabelY = (y2 + y3) / 2;

    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    svg.innerHTML = `
        <!-- Triangle -->
        <polygon points="${x1},${y1} ${x2},${y2} ${x3},${y3}"
                 class="svg-shape" fill="rgba(26, 95, 122, 0.1)"/>

        <!-- Right angle marker -->
        <path d="M ${x1 + 12},${y1} L ${x1 + 12},${y1 - 12} L ${x1},${y1 - 12}"
              fill="none" stroke="#666" stroke-width="2"/>

        <!-- Labels with backgrounds -->
        <rect x="${midX - 45}" y="${y1 + 8}" width="90" height="20" fill="white" rx="3"/>
        <text x="${midX}" y="${y1 + 22}" fill="#1a5f7a" font-size="13" font-weight="bold" text-anchor="middle">
            A = ${a.toFixed(2)}
        </text>

        <rect x="${x1 - 85}" y="${(y1 + y3) / 2 - 10}" width="80" height="20" fill="white" rx="3"/>
        <text x="${x1 - 45}" y="${(y1 + y3) / 2 + 4}" fill="#1a5f7a" font-size="13" font-weight="bold" text-anchor="middle">
            B = ${b.toFixed(2)}
        </text>

        <rect x="${hypLabelX - 5}" y="${hypLabelY - 10}" width="85" height="20" fill="rgba(39,174,96,0.1)" rx="3"/>
        <text x="${hypLabelX}" y="${hypLabelY + 4}" fill="#27ae60" font-size="13" font-weight="bold" text-anchor="start">
            C = ${c.toFixed(2)}
        </text>

        <!-- Angle markers - 꼭지점 옆에 배치 -->
        <rect x="${x2 + 5}" y="${y2 - 22}" width="55" height="18" fill="rgba(255,255,255,0.95)" rx="3" stroke="#ddd" stroke-width="1"/>
        <text x="${x2 + 32}" y="${y2 - 9}" fill="#666" font-size="11" font-weight="bold" text-anchor="middle">
            α=${angleA.toFixed(1)}°
        </text>

        <rect x="${x3 - 60}" y="${y3 - 5}" width="55" height="18" fill="rgba(255,255,255,0.95)" rx="3" stroke="#ddd" stroke-width="1"/>
        <text x="${x3 - 33}" y="${y3 + 8}" fill="#666" font-size="11" font-weight="bold" text-anchor="middle">
            β=${angleB.toFixed(1)}°
        </text>
    `;
}

// Triangle - Angles Calculation (from 3 sides)
function calculateTriangleAngles() {
    const a = parseFloat(document.getElementById('tri-side-a').value);
    const b = parseFloat(document.getElementById('tri-side-b').value);
    const c = parseFloat(document.getElementById('tri-side-c').value);

    if (isNaN(a) || isNaN(b) || isNaN(c) || a <= 0 || b <= 0 || c <= 0) {
        alert('올바른 값을 입력해주세요.');
        return;
    }

    // Check if valid triangle
    if (a + b <= c || b + c <= a || c + a <= b) {
        alert('유효한 삼각형이 아닙니다.\n세 변의 길이를 확인해주세요.');
        return;
    }

    // Calculate angles using law of cosines
    const angleA = Math.acos((b*b + c*c - a*a) / (2*b*c)) * (180 / Math.PI);
    const angleB = Math.acos((a*a + c*c - b*b) / (2*a*c)) * (180 / Math.PI);
    const angleC = Math.acos((a*a + b*b - c*c) / (2*a*b)) * (180 / Math.PI);

    // Draw SVG
    drawTriangleAngles('triangle-angles-svg', a, b, c, angleA, angleB, angleC);

    // Show results
    const resultArea = document.getElementById('triangle-angles-result');
    const valuesDiv = document.getElementById('triangle-angles-values');

    valuesDiv.innerHTML = `
        <div class="result-item">
            <span class="result-label">변 a</span>
            <span class="result-value">${a.toFixed(3)} mm</span>
        </div>
        <div class="result-item">
            <span class="result-label">변 b</span>
            <span class="result-value">${b.toFixed(3)} mm</span>
        </div>
        <div class="result-item">
            <span class="result-label">변 c</span>
            <span class="result-value">${c.toFixed(3)} mm</span>
        </div>
        <div class="result-item">
            <span class="result-label">∠A (꼭지점 A)</span>
            <span class="result-value result-highlight">${angleA.toFixed(3)}°</span>
        </div>
        <div class="result-item">
            <span class="result-label">∠B (꼭지점 B)</span>
            <span class="result-value result-highlight">${angleB.toFixed(3)}°</span>
        </div>
        <div class="result-item">
            <span class="result-label">∠C (꼭지점 C)</span>
            <span class="result-value result-highlight">${angleC.toFixed(3)}°</span>
        </div>
    `;

    resultArea.classList.add('show');
}

// Calculate side from two sides and angle
function calculateSideFromAngle() {
    const b = parseFloat(document.getElementById('tri-known-b').value);
    const c = parseFloat(document.getElementById('tri-known-c').value);
    const angleA = parseFloat(document.getElementById('tri-known-angle').value);

    if (isNaN(b) || isNaN(c) || isNaN(angleA) || b <= 0 || c <= 0 || angleA <= 0 || angleA >= 180) {
        alert('올바른 값을 입력해주세요.\n각도는 0°~180° 사이여야 합니다.');
        return;
    }

    // Law of cosines: a² = b² + c² - 2bc·cos(A)
    const angleARad = angleA * Math.PI / 180;
    const a = Math.sqrt(b*b + c*c - 2*b*c*Math.cos(angleARad));

    // Calculate other angles
    const angleB = Math.acos((a*a + c*c - b*b) / (2*a*c)) * (180 / Math.PI);
    const angleC = 180 - angleA - angleB;

    // Draw SVG
    drawTriangleAngles('triangle-angles-svg', a, b, c, angleA, angleB, angleC);

    // Show results
    const resultArea = document.getElementById('triangle-angles-result');
    const valuesDiv = document.getElementById('triangle-angles-values');

    valuesDiv.innerHTML = `
        <div class="result-item">
            <span class="result-label">변 a (계산됨)</span>
            <span class="result-value result-highlight">${a.toFixed(3)} mm</span>
        </div>
        <div class="result-item">
            <span class="result-label">변 b (입력)</span>
            <span class="result-value">${b.toFixed(3)} mm</span>
        </div>
        <div class="result-item">
            <span class="result-label">변 c (입력)</span>
            <span class="result-value">${c.toFixed(3)} mm</span>
        </div>
        <div class="result-item">
            <span class="result-label">∠A (입력)</span>
            <span class="result-value">${angleA.toFixed(3)}°</span>
        </div>
        <div class="result-item">
            <span class="result-label">∠B (계산됨)</span>
            <span class="result-value result-highlight">${angleB.toFixed(3)}°</span>
        </div>
        <div class="result-item">
            <span class="result-label">∠C (계산됨)</span>
            <span class="result-value result-highlight">${angleC.toFixed(3)}°</span>
        </div>
    `;

    resultArea.classList.add('show');
}

// Store SSA solutions for switching between them
let ssaSolutions = null;

// Calculate from two sides and opposite angle (SSA - Ambiguous case)
function calculateFromTwoSidesOpposite() {
    const a = parseFloat(document.getElementById('tri-ssa-a').value);
    const b = parseFloat(document.getElementById('tri-ssa-b').value);
    const angleA = parseFloat(document.getElementById('tri-ssa-angleA').value);

    if (isNaN(a) || isNaN(b) || isNaN(angleA) || a <= 0 || b <= 0 || angleA <= 0 || angleA >= 180) {
        alert('올바른 값을 입력해주세요.\n각도는 0°~180° 사이여야 합니다.');
        return;
    }

    const angleARad = angleA * Math.PI / 180;

    // Use Law of Sines: sin(B) = b * sin(A) / a
    const sinB = b * Math.sin(angleARad) / a;

    // Check if triangle is possible
    if (sinB > 1) {
        alert('이 조건으로는 삼각형을 만들 수 없습니다.\n(sin(B) > 1)');
        document.getElementById('ssa-solution-selector').style.display = 'none';
        return;
    }

    const angleB1 = Math.asin(sinB) * (180 / Math.PI);
    const angleB2 = 180 - angleB1;

    // Check for valid solutions
    const solutions = [];

    // Solution 1: B is acute (or right angle)
    if (angleA + angleB1 < 180) {
        const angleC1 = 180 - angleA - angleB1;
        const c1 = a * Math.sin(angleC1 * Math.PI / 180) / Math.sin(angleARad);
        solutions.push({ a, b, c: c1, angleA, angleB: angleB1, angleC: angleC1 });
    }

    // Solution 2: B is obtuse (only if B2 is significantly different from B1)
    // Use tolerance for floating point comparison
    const isDifferent = Math.abs(angleB2 - angleB1) > 0.01;
    if (isDifferent && angleA + angleB2 < 180 && angleB2 > 0) {
        const angleC2 = 180 - angleA - angleB2;
        const c2 = a * Math.sin(angleC2 * Math.PI / 180) / Math.sin(angleARad);
        solutions.push({ a, b, c: c2, angleA, angleB: angleB2, angleC: angleC2 });
    }

    if (solutions.length === 0) {
        alert('이 조건으로는 삼각형을 만들 수 없습니다.');
        document.getElementById('ssa-solution-selector').style.display = 'none';
        return;
    }

    ssaSolutions = solutions;

    // Show solution selector if two solutions exist
    const selector = document.getElementById('ssa-solution-selector');
    if (solutions.length === 2) {
        selector.style.display = 'block';
        selector.querySelectorAll('.solution-btn').forEach((btn, i) => {
            btn.classList.toggle('active', i === 0);
        });
    } else {
        selector.style.display = 'none';
    }

    // Show first solution
    showSSASolution(1);
}

function showSSASolution(solutionNum) {
    if (!ssaSolutions || ssaSolutions.length < solutionNum) return;

    const sol = ssaSolutions[solutionNum - 1];

    // Update button states
    document.querySelectorAll('#ssa-solution-selector .solution-btn').forEach((btn, i) => {
        btn.classList.toggle('active', i === solutionNum - 1);
    });

    // Draw SVG
    drawTriangleAngles('triangle-angles-svg', sol.a, sol.b, sol.c, sol.angleA, sol.angleB, sol.angleC);

    // Show results
    const resultArea = document.getElementById('triangle-angles-result');
    const valuesDiv = document.getElementById('triangle-angles-values');

    const solutionLabel = ssaSolutions.length > 1 ? ` (해 ${solutionNum}/${ssaSolutions.length})` : '';

    valuesDiv.innerHTML = `
        <div class="result-item">
            <span class="result-label">변 a (입력)</span>
            <span class="result-value">${sol.a.toFixed(3)} mm</span>
        </div>
        <div class="result-item">
            <span class="result-label">변 b (입력)</span>
            <span class="result-value">${sol.b.toFixed(3)} mm</span>
        </div>
        <div class="result-item">
            <span class="result-label">변 c (계산됨)${solutionLabel}</span>
            <span class="result-value result-highlight">${sol.c.toFixed(3)} mm</span>
        </div>
        <div class="result-item">
            <span class="result-label">∠A (입력)</span>
            <span class="result-value">${sol.angleA.toFixed(3)}°</span>
        </div>
        <div class="result-item">
            <span class="result-label">∠B (계산됨)${solutionLabel}</span>
            <span class="result-value result-highlight">${sol.angleB.toFixed(3)}°</span>
        </div>
        <div class="result-item">
            <span class="result-label">∠C (계산됨)${solutionLabel}</span>
            <span class="result-value result-highlight">${sol.angleC.toFixed(3)}°</span>
        </div>
    `;

    resultArea.classList.add('show');
}

// Calculate from one side and two angles (ASA)
function calculateFromOneAndTwoAngles() {
    const c = parseFloat(document.getElementById('tri-asa-c').value);
    const angleA = parseFloat(document.getElementById('tri-asa-angleA').value);
    const angleB = parseFloat(document.getElementById('tri-asa-angleB').value);

    if (isNaN(c) || isNaN(angleA) || isNaN(angleB) || c <= 0 || angleA <= 0 || angleB <= 0) {
        alert('올바른 값을 입력해주세요.');
        return;
    }

    // Check if valid angles (sum must be less than 180)
    if (angleA + angleB >= 180) {
        alert('두 각도의 합이 180° 미만이어야 합니다.');
        return;
    }

    // Calculate third angle
    const angleC = 180 - angleA - angleB;

    // Use Law of Sines: a/sin(A) = b/sin(B) = c/sin(C)
    const angleARad = angleA * Math.PI / 180;
    const angleBRad = angleB * Math.PI / 180;
    const angleCRad = angleC * Math.PI / 180;

    const a = c * Math.sin(angleARad) / Math.sin(angleCRad);
    const b = c * Math.sin(angleBRad) / Math.sin(angleCRad);

    // Draw SVG
    drawTriangleAngles('triangle-angles-svg', a, b, c, angleA, angleB, angleC);

    // Show results
    const resultArea = document.getElementById('triangle-angles-result');
    const valuesDiv = document.getElementById('triangle-angles-values');

    valuesDiv.innerHTML = `
        <div class="result-item">
            <span class="result-label">변 a (계산됨)</span>
            <span class="result-value result-highlight">${a.toFixed(3)} mm</span>
        </div>
        <div class="result-item">
            <span class="result-label">변 b (계산됨)</span>
            <span class="result-value result-highlight">${b.toFixed(3)} mm</span>
        </div>
        <div class="result-item">
            <span class="result-label">변 c (입력)</span>
            <span class="result-value">${c.toFixed(3)} mm</span>
        </div>
        <div class="result-item">
            <span class="result-label">∠A (입력)</span>
            <span class="result-value">${angleA.toFixed(3)}°</span>
        </div>
        <div class="result-item">
            <span class="result-label">∠B (입력)</span>
            <span class="result-value">${angleB.toFixed(3)}°</span>
        </div>
        <div class="result-item">
            <span class="result-label">∠C (계산됨)</span>
            <span class="result-value result-highlight">${angleC.toFixed(3)}°</span>
        </div>
    `;

    resultArea.classList.add('show');
}

// Draw Triangle for Angles Calculation (improved text positioning)
function drawTriangleAngles(svgId, a, b, c, angleA, angleB, angleC) {
    const svg = document.getElementById(svgId);
    const width = 320;
    const height = 320;
    const padding = 75;

    // Calculate triangle coordinates with better scaling
    const maxSide = Math.max(a, b, c);
    const scale = (Math.min(width, height) - padding * 2.5) / maxSide * 0.7;

    // Place base (side c) at bottom, centered
    const baseWidth = c * scale;
    const x1 = (width - baseWidth) / 2;
    const y1 = height - padding - 20;
    const x2 = x1 + baseWidth;
    const y2 = height - padding - 20;

    // Calculate third point using angles
    const radA = angleA * Math.PI / 180;
    let x3 = x1 + b * scale * Math.cos(radA);
    let y3 = y1 - b * scale * Math.sin(radA);

    // Ensure point C is within bounds
    x3 = Math.max(padding, Math.min(width - padding, x3));
    y3 = Math.max(padding + 40, y3);

    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    // Side label positions
    const sideCY = Math.min(y1 + 28, height - 20);

    // Angle labels - positioned OUTSIDE the triangle
    const angleLabelWidth = 72;
    const angleLabelHeight = 20;

    // ∠A: bottom-left, outside (below and left of vertex A)
    const angleALabelX = Math.max(5, x1 - angleLabelWidth - 5);
    const angleALabelY = y1 + 15;

    // ∠B: bottom-right, outside (below and right of vertex B)
    const angleBLabelX = Math.min(width - angleLabelWidth - 5, x2 + 5);
    const angleBLabelY = y2 + 15;

    // ∠C: top, outside (above vertex C)
    const angleCLabelX = Math.max(5, Math.min(width - angleLabelWidth - 5, x3 - angleLabelWidth / 2));
    const angleCLabelY = Math.max(25, y3 - 30);

    svg.innerHTML = `
        <!-- Triangle -->
        <polygon points="${x1},${y1} ${x2},${y2} ${x3},${y3}"
                 class="svg-shape" fill="rgba(26, 95, 122, 0.1)"/>

        <!-- Vertex points -->
        <circle cx="${x1}" cy="${y1}" r="5" fill="#1a5f7a"/>
        <circle cx="${x2}" cy="${y2}" r="5" fill="#1a5f7a"/>
        <circle cx="${x3}" cy="${y3}" r="5" fill="#1a5f7a"/>

        <!-- Vertex labels (A, B, C near the points) -->
        <text x="${x1 - 12}" y="${y1 - 8}" font-size="14" font-weight="bold" fill="#1a5f7a" text-anchor="middle">A</text>
        <text x="${x2 + 12}" y="${y2 - 8}" font-size="14" font-weight="bold" fill="#1a5f7a" text-anchor="middle">B</text>
        <text x="${x3}" y="${y3 - 12}" font-size="14" font-weight="bold" fill="#1a5f7a" text-anchor="middle">C</text>

        <!-- Side Labels -->
        <!-- 변 c: 삼각형 아래에 표시 -->
        <rect x="${(x1 + x2) / 2 - 30}" y="${y1 + 8}" width="60" height="18" fill="rgba(255,255,255,0.95)" rx="3"/>
        <text x="${(x1 + x2) / 2}" y="${y1 + 21}" fill="#1a5f7a" font-size="12" font-weight="bold" text-anchor="middle">
            c = ${c.toFixed(1)}
        </text>

        <!-- 변 a: 오른쪽 변 -->
        <rect x="${(x2 + x3) / 2 + 5}" y="${(y2 + y3) / 2 - 9}" width="60" height="18" fill="rgba(255,255,255,0.95)" rx="3"/>
        <text x="${(x2 + x3) / 2 + 10}" y="${(y2 + y3) / 2 + 5}" fill="#1a5f7a" font-size="12" font-weight="bold" text-anchor="start">
            a = ${a.toFixed(1)}
        </text>

        <!-- 변 b: 왼쪽 변 -->
        <rect x="${(x1 + x3) / 2 - 65}" y="${(y1 + y3) / 2 - 9}" width="60" height="18" fill="rgba(255,255,255,0.95)" rx="3"/>
        <text x="${(x1 + x3) / 2 - 10}" y="${(y1 + y3) / 2 + 5}" fill="#1a5f7a" font-size="12" font-weight="bold" text-anchor="end">
            b = ${b.toFixed(1)}
        </text>

        <!-- Angle Labels OUTSIDE the triangle -->
        <rect x="${angleALabelX}" y="${angleALabelY}" width="${angleLabelWidth}" height="${angleLabelHeight}" fill="rgba(39,174,96,0.2)" rx="4" stroke="#27ae60" stroke-width="1"/>
        <text x="${angleALabelX + angleLabelWidth/2}" y="${angleALabelY + 14}" fill="#27ae60" font-size="12" font-weight="bold" text-anchor="middle">
            ∠A=${angleA.toFixed(1)}°
        </text>

        <rect x="${angleBLabelX}" y="${angleBLabelY}" width="${angleLabelWidth}" height="${angleLabelHeight}" fill="rgba(39,174,96,0.2)" rx="4" stroke="#27ae60" stroke-width="1"/>
        <text x="${angleBLabelX + angleLabelWidth/2}" y="${angleBLabelY + 14}" fill="#27ae60" font-size="12" font-weight="bold" text-anchor="middle">
            ∠B=${angleB.toFixed(1)}°
        </text>

        <rect x="${angleCLabelX}" y="${angleCLabelY}" width="${angleLabelWidth}" height="${angleLabelHeight}" fill="rgba(39,174,96,0.2)" rx="4" stroke="#27ae60" stroke-width="1"/>
        <text x="${angleCLabelX + angleLabelWidth/2}" y="${angleCLabelY + 14}" fill="#27ae60" font-size="12" font-weight="bold" text-anchor="middle">
            ∠C=${angleC.toFixed(1)}°
        </text>
    `;
}

// Rectangle Calculation
function calculateRectangle() {
    const width = parseFloat(document.getElementById('rect-width').value);
    const height = parseFloat(document.getElementById('rect-height').value);

    if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
        alert('올바른 값을 입력해주세요.');
        return;
    }

    // Calculate diagonal
    const diagonal = Math.sqrt(width * width + height * height);

    // Calculate area and perimeter
    const area = width * height;
    const perimeter = 2 * (width + height);

    // Draw SVG
    drawRectangle('rectangle-svg', width, height, diagonal);

    // Show results
    const resultArea = document.getElementById('rectangle-result');
    const valuesDiv = document.getElementById('rectangle-values');

    valuesDiv.innerHTML = `
        <div class="result-item">
            <span class="result-label">가로</span>
            <span class="result-value">${width.toFixed(3)} mm</span>
        </div>
        <div class="result-item">
            <span class="result-label">세로</span>
            <span class="result-value">${height.toFixed(3)} mm</span>
        </div>
        <div class="result-item">
            <span class="result-label">대각선</span>
            <span class="result-value result-highlight">${diagonal.toFixed(3)} mm</span>
        </div>
        <div class="result-item">
            <span class="result-label">넓이</span>
            <span class="result-value">${area.toFixed(3)} mm²</span>
        </div>
        <div class="result-item">
            <span class="result-label">둘레</span>
            <span class="result-value">${perimeter.toFixed(3)} mm</span>
        </div>
    `;

    resultArea.classList.add('show');
}

// Draw Rectangle
function drawRectangle(svgId, width, height, diagonal) {
    const svg = document.getElementById(svgId);
    const svgWidth = 300;
    const svgHeight = 260;
    const padding = 60;

    // Scale to fit with room for labels
    const maxDim = Math.max(width, height);
    const scale = (Math.min(svgWidth - 80, svgHeight - 80) - padding) / maxDim * 0.75;

    const scaledW = width * scale;
    const scaledH = height * scale;

    const x1 = (svgWidth - scaledW) / 2;
    const y1 = (svgHeight - scaledH) / 2 + 10;
    const x2 = x1 + scaledW;
    const y2 = y1 + scaledH;

    svg.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);

    svg.innerHTML = `
        <!-- Rectangle -->
        <rect x="${x1}" y="${y1}" width="${scaledW}" height="${scaledH}"
              class="svg-shape" fill="rgba(26, 95, 122, 0.1)"/>

        <!-- Diagonal -->
        <line x1="${x1}" y1="${y2}" x2="${x2}" y2="${y1}"
              stroke="#27ae60" stroke-width="3" stroke-dasharray="8,4"/>

        <!-- Labels with backgrounds -->
        <rect x="${(x1 + x2) / 2 - 55}" y="${y2 + 10}" width="110" height="22" fill="white" rx="3"/>
        <text x="${(x1 + x2) / 2}" y="${y2 + 26}" fill="#1a5f7a" font-size="13" font-weight="bold" text-anchor="middle">
            가로 = ${width.toFixed(2)}
        </text>

        <rect x="${x2 + 8}" y="${(y1 + y2) / 2 - 11}" width="100" height="22" fill="white" rx="3"/>
        <text x="${x2 + 12}" y="${(y1 + y2) / 2 + 4}" fill="#1a5f7a" font-size="13" font-weight="bold" text-anchor="start">
            세로 = ${height.toFixed(2)}
        </text>

        <rect x="${(x1 + x2) / 2 - 60}" y="${(y1 + y2) / 2 - 25}" width="120" height="22" fill="rgba(39,174,96,0.1)" rx="3"/>
        <text x="${(x1 + x2) / 2}" y="${(y1 + y2) / 2 - 9}" fill="#27ae60" font-size="13" font-weight="bold" text-anchor="middle">
            대각선 = ${diagonal.toFixed(2)}
        </text>
    `;
}

// Regular Hexagon Calculation - By Side
function calculateHexagonBySide() {
    const side = parseFloat(document.getElementById('hex-side').value);

    if (isNaN(side) || side <= 0) {
        alert('올바른 값을 입력해주세요.');
        return;
    }

    calculateHexagonCommon(side);
}

// Regular Hexagon Calculation - By Height
function calculateHexagonByHeight() {
    const height = parseFloat(document.getElementById('hex-height').value);

    if (isNaN(height) || height <= 0) {
        alert('올바른 값을 입력해주세요.');
        return;
    }

    // height = a × √3, so a = height / √3
    const side = height / Math.sqrt(3);

    calculateHexagonCommon(side);
}

// Common Hexagon Calculation
function calculateHexagonCommon(side) {
    // Regular hexagon formulas
    // 짧은 대각선 (한 꼭지점 건너): a × √3
    const shortDiagonal = side * Math.sqrt(3);

    // 긴 대각선 (반대편 꼭지점): a × 2
    const longDiagonal = side * 2;

    // 높이 (위아래 변 사이 거리): a × √3
    const height = side * Math.sqrt(3);

    // 너비 (좌우 꼭지점 사이): a × 2
    const width = side * 2;

    // 중심에서 꼭지점까지 거리: a
    const circumradius = side;

    // 중심에서 변까지 거리 (내접원 반지름): a × √3 / 2
    const inradius = side * Math.sqrt(3) / 2;

    // 넓이: (3√3 / 2) × a²
    const area = (3 * Math.sqrt(3) / 2) * side * side;

    // 둘레: 6a
    const perimeter = 6 * side;

    // Draw SVG (horizontal orientation - rotated 90 degrees)
    drawHexagon('hexagon-svg', side, shortDiagonal, longDiagonal, height);

    // Show results
    const resultArea = document.getElementById('hexagon-result');
    const valuesDiv = document.getElementById('hexagon-values');

    valuesDiv.innerHTML = `
        <div class="result-item">
            <span class="result-label">한 변 (a)</span>
            <span class="result-value">${side.toFixed(3)} mm</span>
        </div>
        <div class="result-item">
            <span class="result-label">긴 대각선 (a×2)</span>
            <span class="result-value result-highlight">${longDiagonal.toFixed(3)} mm</span>
        </div>
        <div class="result-item">
            <span class="result-label">짧은 대각선 (a×√3)</span>
            <span class="result-value result-highlight">${shortDiagonal.toFixed(3)} mm</span>
        </div>
        <div class="result-item">
            <span class="result-label">높이 (a×√3)</span>
            <span class="result-value">${height.toFixed(3)} mm</span>
        </div>
        <div class="result-item">
            <span class="result-label">너비 (a×2)</span>
            <span class="result-value">${width.toFixed(3)} mm</span>
        </div>
        <div class="result-item">
            <span class="result-label">중심→꼭지점</span>
            <span class="result-value">${circumradius.toFixed(3)} mm</span>
        </div>
        <div class="result-item">
            <span class="result-label">중심→변 (내접원)</span>
            <span class="result-value">${inradius.toFixed(3)} mm</span>
        </div>
        <div class="result-item">
            <span class="result-label">넓이</span>
            <span class="result-value">${area.toFixed(3)} mm²</span>
        </div>
        <div class="result-item">
            <span class="result-label">둘레</span>
            <span class="result-value">${perimeter.toFixed(3)} mm</span>
        </div>
    `;

    resultArea.classList.add('show');
}

// Draw Regular Hexagon (horizontal orientation - long diagonal is horizontal)
function drawHexagon(svgId, side, shortDiag, longDiag, hexHeight) {
    const svg = document.getElementById(svgId);
    const svgWidth = 300;
    const svgHeight = 240;
    const padding = 40;

    // Scale to fit with room for labels
    const maxDim = longDiag;
    const scale = (svgWidth - padding * 2 - 20) / maxDim * 0.85;

    const scaledSide = side * scale;
    const centerX = svgWidth / 2;
    const centerY = svgHeight / 2 + 15;

    // Calculate hexagon points (pointy-top orientation rotated 90° = flat-side on left/right)
    const points = [];
    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const x = centerX + scaledSide * Math.cos(angle);
        const y = centerY + scaledSide * Math.sin(angle);
        points.push({ x, y });
    }

    const pointsStr = points.map(p => `${p.x},${p.y}`).join(' ');

    svg.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);

    svg.innerHTML = `
        <!-- Legend at top -->
        <rect x="5" y="5" width="290" height="28" fill="rgba(255,255,255,0.9)" rx="4"/>
        <rect x="10" y="12" width="10" height="10" fill="#e65100"/>
        <text x="25" y="20" font-size="9" fill="#333">한 변</text>

        <line x1="65" y1="17" x2="80" y2="17" stroke="#9c27b0" stroke-width="2" stroke-dasharray="4,2"/>
        <text x="85" y="20" font-size="9" fill="#333">긴 대각선</text>

        <line x1="145" y1="17" x2="160" y2="17" stroke="#27ae60" stroke-width="2" stroke-dasharray="4,2"/>
        <text x="165" y="20" font-size="9" fill="#333">짧은 대각선</text>

        <line x1="230" y1="17" x2="245" y2="17" stroke="#2196f3" stroke-width="2"/>
        <text x="250" y="20" font-size="9" fill="#333">높이</text>

        <!-- Hexagon -->
        <polygon points="${pointsStr}"
                 class="svg-shape" fill="rgba(26, 95, 122, 0.1)"/>

        <!-- 한 변 강조 -->
        <line x1="${points[0].x}" y1="${points[0].y}" x2="${points[1].x}" y2="${points[1].y}"
              stroke="#e65100" stroke-width="4"/>

        <!-- 긴 대각선 (가로) -->
        <line x1="${points[0].x}" y1="${points[0].y}" x2="${points[3].x}" y2="${points[3].y}"
              stroke="#9c27b0" stroke-width="2" stroke-dasharray="6,3"/>

        <!-- 짧은 대각선 (한 칸 건너: 1→3) -->
        <line x1="${points[0].x}" y1="${points[0].y}" x2="${points[2].x}" y2="${points[2].y}"
              stroke="#27ae60" stroke-width="2" stroke-dasharray="6,3"/>

        <!-- 높이 표시 -->
        <line x1="${centerX + scaledSide * 0.3}" y1="${points[1].y}" x2="${centerX + scaledSide * 0.3}" y2="${points[4].y}"
              stroke="#2196f3" stroke-width="2"/>

        <!-- 꼭지점 번호 -->
        ${points.map((p, i) => {
            const offsetX = (p.x - centerX) * 0.18;
            const offsetY = (p.y - centerY) * 0.22;
            return `<circle cx="${p.x}" cy="${p.y}" r="4" fill="#1a5f7a"/>
                    <text x="${p.x + offsetX}" y="${p.y + offsetY}" fill="#1a5f7a" text-anchor="middle" dominant-baseline="middle" font-weight="bold" font-size="11">${i + 1}</text>`;
        }).join('')}

        <!-- Value Labels with backgrounds -->
        <rect x="${(points[0].x + points[1].x) / 2 - 35}" y="${(points[0].y + points[1].y) / 2 - 22}" width="70" height="16" fill="rgba(255,255,255,0.95)" rx="3"/>
        <text x="${(points[0].x + points[1].x) / 2}" y="${(points[0].y + points[1].y) / 2 - 10}"
              fill="#e65100" font-size="11" font-weight="bold" text-anchor="middle">a=${side.toFixed(2)}</text>

        <rect x="${centerX - 55}" y="${centerY - 8}" width="110" height="16" fill="rgba(156,39,176,0.1)" rx="3"/>
        <text x="${centerX}" y="${centerY + 4}"
              fill="#9c27b0" font-size="11" font-weight="bold" text-anchor="middle">긴=${longDiag.toFixed(2)}</text>

        <rect x="${(points[0].x + points[2].x) / 2 - 40}" y="${(points[0].y + points[2].y) / 2 - 20}" width="80" height="16" fill="rgba(39,174,96,0.1)" rx="3"/>
        <text x="${(points[0].x + points[2].x) / 2}" y="${(points[0].y + points[2].y) / 2 - 8}"
              fill="#27ae60" font-size="10" font-weight="bold" text-anchor="middle">짧은=${shortDiag.toFixed(2)}</text>

        <rect x="${centerX + scaledSide * 0.3 + 5}" y="${centerY - 8}" width="70" height="16" fill="rgba(33,150,243,0.1)" rx="3"/>
        <text x="${centerX + scaledSide * 0.3 + 10}" y="${centerY + 4}"
              fill="#2196f3" font-size="10" font-weight="bold" text-anchor="start">높이=${hexHeight.toFixed(2)}</text>
    `;
}

// Enter key support for inputs
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const panel = this.closest('.sub-panel') || this.closest('.calc-panel') || this.closest('.calc-section');
                const btn = panel.querySelector('.calculate-btn');
                if (btn) btn.click();
            }
        });
    });
});
