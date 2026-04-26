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

// Function to fetch and display constituency data
async function loadConstituencyData(constituencyId) {
  // Update this URL to match your deployed Render/Railway backend
  const BASE_URL = "https://oitstackf-production.up.railway.app";
  // const BASE_URL = "http://localhost:3000";


  const container2009 = document.getElementById('candidateTableContainer2009');
  const container2014 = document.getElementById('candidateTableContainer2014');
  const container2019 = document.getElementById('candidateTableContainer2019');

  if (!container2009 || !container2014 || !container2019) return;

  // Show "Loading" states
  container2009.innerHTML = '<p>Loading 2009 candidates...</p>';
  container2014.innerHTML = '<p>Loading 2014 candidates...</p>';
  container2019.innerHTML = '<p>Loading 2019 candidates...</p>';

  try {
    // Call the deployed backend API
    const response = await fetch(`${BASE_URL}/api/constituency/${constituencyId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();

    // Render 2009 Table
    renderTable(container2009, data.records_2009, false, "2009");

    // Render 2014 Table
    renderTable(container2014, data.records_2014, true, "2014");

    // Render 2019 Table
    renderTable(container2019, data.records_2019, true, "2019");

  } catch (error) {
    console.error('Error fetching constituency data:', error);
    const errorMsg = '<p style="color:red;">Unable to fetch data. Please try again later.</p>';
    container2009.innerHTML = errorMsg;
    container2014.innerHTML = errorMsg;
    container2019.innerHTML = errorMsg;
  }
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
