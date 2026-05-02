// Loader
window.addEventListener('load', () => {
  const loader = document.querySelector('.loader-wrapper');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
    }, 500);
  }
});

// Sticky Navbar
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = hamburger.querySelector('i');
    if (navLinks.classList.contains('active')) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-times');
    } else {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
  });
}

// Active link highlighting
const currentUrl = window.location.pathname;
const navItems = document.querySelectorAll('.nav-links a');
navItems.forEach(item => {
  // Basic active state check, handles root as well
  if (item.getAttribute('href') === currentUrl.substring(currentUrl.lastIndexOf('/') + 1) ||
    (currentUrl.endsWith('/') && item.getAttribute('href') === 'index.html')) {
    item.classList.add('active');
  }
});

// Scroll Animation
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
  const animElements = document.querySelectorAll('.animate-on-scroll');
  animElements.forEach(el => observer.observe(el));
});

// Regional Analytics Hierarchy Logic
document.addEventListener('DOMContentLoaded', () => {
  const stateToggleBtn = document.getElementById('maharashtraToggle');
  const divisionsContainer = document.getElementById('maharashtraDivisions');

  if (stateToggleBtn && divisionsContainer) {
    stateToggleBtn.addEventListener('click', () => {
      stateToggleBtn.classList.toggle('active');

      if (stateToggleBtn.classList.contains('active')) {
        divisionsContainer.classList.add('active');
        divisionsContainer.style.maxHeight = divisionsContainer.scrollHeight + 800 + 'px';
      } else {
        divisionsContainer.classList.remove('active');
        divisionsContainer.style.maxHeight = '0px';
      }
    });
  }
});

// Global variable to store constituency data for insights
let currentConstituencyData = null;

// Function to fetch and display constituency data
async function loadConstituencyData(constituencyId) {
  // Update this URL to match your deployed Render/Railway backend
  const BASE_URL = "https://oitstackf-production.up.railway.app";
  // const BASE_URL = "http://localhost:3000";


  const container2009 = document.getElementById('candidateTableContainer2009');
  const container2014 = document.getElementById('candidateTableContainer2014');
  const container2019 = document.getElementById('candidateTableContainer2019');
  const container2024 = document.getElementById('candidateTableContainer2024');

  if (!container2009 || !container2014 || !container2019 || !container2024) return;

  // Show "Loading" states
  container2009.innerHTML = '<p>Loading 2009 candidates...</p>';
  container2014.innerHTML = '<p>Loading 2014 candidates...</p>';
  container2019.innerHTML = '<p>Loading 2019 candidates...</p>';
  container2024.innerHTML = '<p>Loading 2024 candidates...</p>';

  try {
    // Call the deployed backend API
    const response = await fetch(`${BASE_URL}/api/constituency/${constituencyId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();
    currentConstituencyData = data; // Store globally for insights

    // Render 2009 Table
    renderTable(container2009, data.records_2009, false, "2009");

    // Render 2014 Table
    renderTable(container2014, data.records_2014, true, "2014");

    // Render 2019 Table
    renderTable(container2019, data.records_2019, true, "2019");

    // Render 2024 Table
    renderTable(container2024, data.records_2024, true, "2024");

    // Initialize Insights Button
    initInsights();

  } catch (error) {
    console.error('Error fetching constituency data:', error);
    const errorMsg = '<p style="color:red;">Unable to fetch data. Please try again later.</p>';
    container2009.innerHTML = errorMsg;
    container2014.innerHTML = errorMsg;
    container2019.innerHTML = errorMsg;
    container2024.innerHTML = errorMsg;
  }
}

// Insights Logic
let charts = {}; // Store chart instances to destroy them before re-rendering

function initInsights() {
  const modal = document.getElementById('insightsModal');
  const btn = document.getElementById('insightsBtn');
  const closeSpan = document.querySelector('.close-modal');

  if (!btn || !modal) return;

  btn.onclick = () => {
    modal.style.display = "block";
    setTimeout(() => {
      renderAllCharts();
    }, 100);
  };

  closeSpan.onclick = () => {
    modal.style.display = "none";
  };

  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

function renderAllCharts() {
  if (!currentConstituencyData) return;

  const years = [2009, 2014, 2019, 2024];
  years.forEach(year => {
    const records = currentConstituencyData[`records_${year}`];
    renderPieChart(`chart${year}`, records, year);
  });
}

// Register Chart.js DataLabels plugin safely
try {
  if (typeof ChartDataLabels !== 'undefined') {
    Chart.register(ChartDataLabels);
    console.log('ChartDataLabels plugin registered successfully');
  } else {
    console.warn('ChartDataLabels plugin not found. Slices will not have labels.');
  }
} catch (e) {
  console.error('Error registering ChartDataLabels:', e);
}

// Party Color Mapping (Avoiding Green)
const partyColorMap = {
  'BJP': '#f97316', // Vibrant Orange
  'INC': '#0ea5e9', // Bright Sky Blue (Updated from Royal Blue)
  'NCP': '#fde047', // Vibrant Yellow
  'NCP(SP)': '#7c3aed', // Vibrant Purple
  'SHS': '#e11d48', // Vibrant Crimson
  'SHUBT': '#ec4899', // Vibrant Pink
  'BSP': '#4338ca', // Deep Indigo
  'MNS': '#ea580c', // Dark Orange
  'IND': '#d1d5db', // Light Gray
  'OTHERS': '#cbd5e1' // Light Slate
};

function getPartyColor(party) {
  if (!party) return partyColorMap['IND'];
  const p = party.toUpperCase().replace(/[\(\)\s]/g, ''); // Remove parens and spaces
  
  if (p.includes('BJP')) return partyColorMap['BJP'];
  if (p.includes('INC') || p.includes('CONGRESS')) return partyColorMap['INC'];
  
  // Prioritize NCPSP / NCP(SP) before general NCP
  if (p.includes('NCPSP')) return partyColorMap['NCP(SP)'];
  if (p.includes('NCP')) return partyColorMap['NCP'];
  
  if (p.includes('SHS') || p.includes('SHIV') || p.includes('SENA')) {
    if (p.includes('UBT')) return partyColorMap['SHUBT'];
    return partyColorMap['SHS'];
  }
  if (p.includes('BSP')) return partyColorMap['BSP'];
  if (p.includes('MNS')) return partyColorMap['MNS'];
  if (p === 'OTH' || p === 'OTHERS') return partyColorMap['OTHERS'];
  
  // Fallback to vibrant colors from the image (excluding green)
  const fallbacks = ['#f43f5e', '#8b5cf6', '#3b82f6', '#f59e0b', '#06b6d4'];
  const index = Math.abs(party.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % fallbacks.length;
  return fallbacks[index];
}

function renderPieChart(canvasId, records, year) {
  console.log(`Attempting to render chart for ${year} on ${canvasId}`);
  if (!records || records.length === 0) {
    console.warn(`No records found for ${year}`);
    return;
  }

  // Take top 5 candidates, others = 100% - sum(top 5)
  const topCount = 5;
  const topCandidates = records.slice(0, topCount);
  
  const topPercentageSum = topCandidates.reduce((sum, c) => sum + parseFloat(c.votes_percentage || 0), 0);
  const othersPercentage = Math.max(0, 100 - topPercentageSum).toFixed(2);

  let labels = topCandidates.map(c => c.candidate_name);
  let partyLabels = topCandidates.map(c => c.party || "IND");
  let dataPoints = topCandidates.map(c => parseFloat(c.votes_percentage || 0));
  let backgroundColors = topCandidates.map(c => getPartyColor(c.party));

  if (parseFloat(othersPercentage) > 0.5) {
    labels.push("Others");
    partyLabels.push("OTH");
    dataPoints.push(parseFloat(othersPercentage));
    backgroundColors.push(partyColorMap['OTHERS']);
  }

  const ctx = document.getElementById(canvasId).getContext('2d');
  
  if (charts[canvasId]) {
    charts[canvasId].destroy();
  }

  // Light but clearly visible colors
  const premiumColors = [
    '#93c5fd', // Light Blue (600 -> 300)
    '#86efac', // Light Green
    '#fde047', // Light Yellow
    '#fda4af', // Light Rose
    '#c4b5fd', // Light Violet
    '#cbd5e1'  // Light Slate (Others)
  ];

  charts[canvasId] = new Chart(ctx, {
    type: 'pie', // Switched back to pie chart as requested
    data: {
      labels: labels,
      datasets: [{
        data: dataPoints,
        backgroundColor: backgroundColors,
        borderWidth: 1.5,
        borderColor: '#ffffff',
        hoverOffset: 15
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            color: '#000000', // Black as requested
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 15,
            font: { family: "'Inter', sans-serif", size: 11, weight: '500' }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          titleColor: '#000',
          bodyColor: '#000',
          titleFont: { size: 14, weight: 'bold' },
          bodyFont: { size: 13 },
          padding: 15,
          cornerRadius: 10,
          displayColors: true,
          borderColor: '#e2e8f0',
          borderWidth: 1,
          callbacks: {
            label: function(context) {
              const party = partyLabels[context.dataIndex];
              return ` ${party}: ${context.raw}%`;
            }
          }
        },
        datalabels: {
          color: '#000000', // Black labels on light slices
          font: { weight: 'bold', size: 11 },
          formatter: (value, ctx) => {
            if (value < 5) return ''; 
            return partyLabels[ctx.dataIndex];
          },
          anchor: 'center',
          align: 'center'
        }
      },
      animation: {
        animateScale: true,
        animateRotate: true,
        duration: 1500,
        easing: 'easeOutQuart'
      }
    }
  });
}

// Reusable helper function to render tables
function renderTable(container, candidates, showSymbol, year) {
  const titleId = `recordYearTitle${year}`;
  const titleElement = document.getElementById(titleId);

  if (!candidates || candidates.length === 0) {
    container.style.display = 'none';
    if (titleElement && titleElement.parentElement) {
      titleElement.parentElement.style.display = 'none';
    }
    return;
  }

  // Ensure container and title are visible if data exists
  container.style.display = 'block';
  if (titleElement && titleElement.parentElement) {
    titleElement.parentElement.style.display = 'block';
  }

  let tableHtml = `
    <table class="candidate-table">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Candidate</th>
          <th>Sex</th>
          <th>Age</th>
          <th>Cat</th>
          <th>Party</th>
          ${showSymbol ? '<th>Symbol</th>' : ''}
          <th>General</th>
          <th>Postal</th>
          <th>Total</th>
          <th>Performance</th>
        </tr>
      </thead>
      <tbody>
  `;

  candidates.forEach(candidate => {
    const isWinner = candidate.rank_no == 1;
    const votePercent = parseFloat(candidate.votes_percentage) || 0;
    const genderIcon = candidate.sex === 'Male' ? '<i class="fa-solid fa-mars" style="color: #3b82f6;"></i>' : 
                      (candidate.sex === 'Female' ? '<i class="fa-solid fa-venus" style="color: #ec4899;"></i>' : '');
    
    tableHtml += `
      <tr class="${isWinner ? 'winner-row' : ''}">
        <td class="rank-cell">
          <span class="rank-badge ${isWinner ? 'rank-winner' : ''}">${candidate.rank_no || '-'}</span>
        </td>
        <td class="candidate-name-cell">
          <div class="candidate-name">${candidate.candidate_name || '-'}</div>
        </td>
        <td class="gender-cell">${genderIcon} <span>${candidate.sex || '-'}</span></td>
        <td><span class="meta-data">${candidate.age || '-'}</span></td>
        <td><span class="meta-data">${candidate.category || '-'}</span></td>
        <td><span class="party-badge">${candidate.party || '-'}</span></td>
        ${showSymbol ? `<td><span class="symbol-text">${candidate.symbol || '-'}</span></td>` : ''}
        <td class="vote-number">${candidate.general.toLocaleString()}</td>
        <td class="vote-number">${candidate.postal.toLocaleString()}</td>
        <td class="vote-number"><strong>${candidate.total.toLocaleString()}</strong></td>
        <td>
          <div class="performance-data">
            <div class="pie-chart" style="--percent: ${votePercent}%"></div>
            <span class="vote-percent-text">${votePercent}%</span>
          </div>
        </td>
      </tr>
    `;
  });

  tableHtml += `
      </tbody>
    </table>
  `;

  container.innerHTML = tableHtml;
}
