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
  const BASE_URL = "oitstackf-production.up.railway.app";

  const tableContainer = document.getElementById('candidateTableContainer');
  if (!tableContainer) return;

  // Show a "Loading" state
  tableContainer.innerHTML = '<p>Loading candidates...</p>';

  try {
    // Call the deployed backend API
    const response = await fetch(`${BASE_URL}/api/constituency/${constituencyId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();
    const candidates = data.candidates;

    // Check if candidates array is empty
    if (!candidates || candidates.length === 0) {
      tableContainer.innerHTML = '<p>No candidate data found for this constituency.</p>';
      return;
    }

    // Build the table HTML dynamically
    let tableHtml = `
      <table class="candidate-table">
        <thead>
          <tr>
            <th>Candidate Name</th>
            <th>Sex</th>
            <th>Age</th>
            <th>Category</th>
            <th>Party</th>
            <th>General</th>
            <th>Postal</th>
            <th>Total</th>
            <th>Vote Percentage</th>
          </tr>
        </thead>
        <tbody>
    `;

    candidates.forEach(candidate => {
      tableHtml += `
        <tr>
          <td>${candidate.candidate_name || '-'}</td>
          <td>${candidate.sex || '-'}</td>
          <td>${candidate.age || '-'}</td>
          <td>${candidate.category || '-'}</td>
          <td>${candidate.party || '-'}</td>
          <td>${candidate.general || '0'}</td>
          <td>${candidate.postal || '0'}</td>
          <td>${candidate.total || '0'}</td>
          <td>${candidate.votes_percentage ? candidate.votes_percentage + '%' : '0%'}</td>
        </tr>
      `;
    });

    tableHtml += `
        </tbody>
      </table>
    `;

    // Render the final table into the container
    tableContainer.innerHTML = tableHtml;

  } catch (error) {
    console.error('Error fetching constituency data:', error);
    tableContainer.innerHTML = '<p style="color:red;">Unable to fetch data. Please try again later.</p>';
  }
}
