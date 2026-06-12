/**
 * Aurum Inventory Intelligence Dashboard Script
 * Follows technical specifications from pricing_and_inventory_doc.md
 */

(function() {
  // 1. Data Generation Rules & Types
  const FLOORS = [
    { id: 2, name: 'LEVEL 01 · DUPLEX UPPER', label: 'L1', count: 14 },
    { id: 3, name: 'LEVEL 02', label: 'L2', count: 22 },
    { id: 4, name: 'LEVEL 03', label: 'L3', count: 22 },
    { id: 5, name: 'LEVEL 04', label: 'L4', count: 22 },
    { id: 6, name: 'LEVEL 05', label: 'L5', count: 22 },
    { id: 7, name: 'LEVEL 06 · SKY BRIDGE', label: 'L6', count: 8 },
    { id: 8, name: 'LEVEL 07 · PREMIUM', label: 'L7', count: 4 }
  ];

  // Procedural Unit Generation to guarantee exact totals & rules without bloated manual files
  function generateInventory() {
    const inventory = [];
    
    FLOORS.forEach(floor => {
      for (let i = 1; i <= floor.count; i++) {
        const unitIndex = i < 10 ? `0${i}` : `${i}`;
        const unitNumber = `${floor.id - 1}${unitIndex}`; // e.g. 101 for floor 2 (LEVEL 01)
        
        let size = 1200;
        let type = '1BR + Balcony';
        
        if (floor.id === 2) {
          // Duplexes (14 units)
          type = i % 2 === 0 ? '4BR Duplex' : '3BR Duplex';
          size = i % 2 === 0 ? 3800 : 2600; // Full-Floor Suite / Premium Suite
        } else if (floor.id === 7) {
          // Sky Bridge (8 units)
          type = i % 2 === 0 ? '3BR + Office + Bal' : '1BR + 2 Bal';
          size = i % 2 === 0 ? 2200 : 1150;
        } else if (floor.id === 8) {
          // Premium Suites (4 units)
          type = '3BR + Balcony';
          size = 2800;
        } else {
          // Standard / Boutique floors (f=3 to 6: 22 units each)
          if (i <= 4) {
            type = '1BR - In'; // Atrium/Courtyard facing
            size = 950; // Boutique Suite
          } else if (i <= 10) {
            type = '1BR + Balcony';
            size = 1180; // Standard Suite
          } else if (i <= 18) {
            type = '2BR + Balcony';
            size = 1650; // Premium Suite
          } else {
            type = 'Boutique Office';
            size = 850; // Boutique Suite
          }
        }

        // Determine Unit Class
        let unitClass = '';
        if (floor.id === 2) {
          unitClass = 'G+1 Duplex Unit';
        } else if (size >= 3500) {
          unitClass = 'Full-Floor Suite';
        } else if (size >= 2000) {
          unitClass = 'Premium Suite';
        } else if (size >= 1100) {
          unitClass = 'Standard Suite';
        } else {
          unitClass = 'Boutique Suite';
        }

        // Determine Aspect
        const aspect = (type === '1BR - In') ? 'Atrium / Courtyard Facing' : 'External Facing';

        // Pricing Tier
        const psfRate = size < 1500 ? 2500 : 2400;
        const purchasePrice = size * psfRate;

        inventory.push({
          id: `ARM-${unitNumber}`,
          unitNumber: unitNumber,
          floorId: floor.id,
          floorName: floor.name,
          type: type,
          size: size,
          unitClass: unitClass,
          aspect: aspect,
          psfRate: psfRate,
          price: purchasePrice,
          status: i % 7 === 0 ? 'Reserved' : 'Available' // some mock availability status
        });
      }
    });

    return inventory;
  }

  const inventoryData = generateInventory();
  
  // App state
  let selectedFloorId = 3; // LEVEL 02 as default active floor
  let selectedUnit = null;
  let comparisonList = []; // Array of unit IDs (max 3)
  
  // Filter variables
  let searchFilter = '';
  let classFilter = '';
  let statusFilter = '';
  let minPrice = 0;
  let maxPrice = 12000000;
  let minSize = 0;
  let maxSize = 5000;

  // DOM Elements cache
  let els = {};

  function initDOM() {
    els = {
      floorList: document.getElementById('ii-floor-stack'),
      unitGrid: document.getElementById('ii-unit-grid'),
      searchInput: document.getElementById('ii-search'),
      classFilter: document.getElementById('ii-filter-class'),
      statusFilter: document.getElementById('ii-filter-status'),
      priceFilter: document.getElementById('ii-filter-price'),
      sizeFilter: document.getElementById('ii-filter-size'),
      
      // Selected unit panel elements
      detailPanel: document.getElementById('ii-detail-panel'),
      emptyState: document.getElementById('ii-details-empty'),
      detailContent: document.getElementById('ii-details-content'),
      
      // Detail metrics
      detailId: document.getElementById('ii-detail-id'),
      detailClass: document.getElementById('ii-detail-class'),
      detailStatus: document.getElementById('ii-detail-status'),
      detailSize: document.getElementById('ii-detail-size'),
      detailPSF: document.getElementById('ii-detail-psf'),
      detailAspect: document.getElementById('ii-detail-aspect'),
      detailPrice: document.getElementById('ii-detail-price'),
      
      // EMI Calculator inputs & outputs
      calcDownPaymentPct: document.getElementById('ii-calc-dp-pct'),
      calcDownPaymentVal: document.getElementById('ii-calc-dp-val'),
      calcInterestRate: document.getElementById('ii-calc-ir'),
      calcTenure: document.getElementById('ii-calc-tenure'),
      calcLoanAmount: document.getElementById('ii-calc-loan'),
      calcMonthlyEMI: document.getElementById('ii-calc-emi'),
      
      // ROI outputs
      roiRentLow: document.getElementById('ii-roi-rent-low'),
      roiRentHigh: document.getElementById('ii-roi-rent-high'),
      roiPctLow: document.getElementById('ii-roi-pct-low'),
      roiPctHigh: document.getElementById('ii-roi-pct-high'),
      
      // Compare elements
      btnCompare: document.getElementById('ii-btn-compare'),
      comparisonDock: document.getElementById('ii-comparison-dock'),
      comparisonSlots: document.getElementById('ii-comparison-slots'),
      comparisonOverlay: document.getElementById('ii-comparison-overlay'),
      comparisonTableBody: document.getElementById('ii-comparison-table-body'),
      btnCloseComparison: document.getElementById('ii-close-comparison')
    };

    // Attach Event Listeners
    if (els.searchInput) els.searchInput.addEventListener('input', handleSearch);
    if (els.classFilter) els.classFilter.addEventListener('change', handleClassFilter);
    if (els.statusFilter) els.statusFilter.addEventListener('change', handleStatusFilter);
    if (els.priceFilter) els.priceFilter.addEventListener('input', handlePriceFilter);
    if (els.sizeFilter) els.sizeFilter.addEventListener('input', handleSizeFilter);
    
    // Calculator inputs
    if (els.calcDownPaymentPct) els.calcDownPaymentPct.addEventListener('input', recalculateCalculator);
    if (els.calcInterestRate) els.calcInterestRate.addEventListener('input', recalculateCalculator);
    if (els.calcTenure) els.calcTenure.addEventListener('input', recalculateCalculator);

    // Compare trigger & close
    if (els.btnCompare) els.btnCompare.addEventListener('click', toggleCompareUnit);
    if (els.btnCloseComparison) els.btnCloseComparison.addEventListener('click', hideComparisonOverlay);

    // Initial renders
    renderFloorStack();
    renderUnits();
  }

  // Render visual skyscraper stack (left column)
  function renderFloorStack() {
    if (!els.floorList) return;
    
    els.floorList.innerHTML = '';
    
    // Render from highest floor down to lowest floor
    [...FLOORS].reverse().forEach(floor => {
      const isSelected = floor.id === selectedFloorId;
      const floorBtn = document.createElement('div');
      floorBtn.className = `floor-bar ${isSelected ? 'active' : ''}`;
      floorBtn.dataset.floorId = floor.id;
      
      // Count available units on this floor
      const availableUnits = inventoryData.filter(u => u.floorId === floor.id && u.status === 'Available').length;
      
      floorBtn.innerHTML = `
        <span class="floor-badge">${floor.label}</span>
        <span class="floor-title">${floor.name}</span>
        <span class="floor-stats">${availableUnits}/${floor.count} Available</span>
      `;
      
      floorBtn.addEventListener('click', () => {
        selectedFloorId = floor.id;
        document.querySelectorAll('.floor-bar').forEach(el => el.classList.remove('active'));
        floorBtn.classList.add('active');
        renderUnits();
      });
      
      els.floorList.appendChild(floorBtn);
    });
  }

  // Render middle column unit cards
  function renderUnits() {
    if (!els.unitGrid) return;
    
    els.unitGrid.innerHTML = '';
    
    // Filter units based on selected floor and other UI controls
    const filtered = inventoryData.filter(unit => {
      if (unit.floorId !== selectedFloorId) return false;
      if (searchFilter && !unit.unitNumber.includes(searchFilter) && !unit.type.toLowerCase().includes(searchFilter.toLowerCase())) return false;
      if (classFilter && unit.unitClass !== classFilter) return false;
      if (statusFilter && unit.status !== statusFilter) return false;
      if (unit.price > maxPrice) return false;
      if (unit.size > maxSize) return false;
      return true;
    });

    if (filtered.length === 0) {
      els.unitGrid.innerHTML = `
        <div class="empty-results-message">
          <p>No units match the selected filters on this floor.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(unit => {
      const isSelected = selectedUnit && selectedUnit.id === unit.id;
      const isComparing = comparisonList.includes(unit.id);
      
      const card = document.createElement('div');
      card.className = `unit-card ${isSelected ? 'selected' : ''} ${unit.status.toLowerCase()}`;
      card.innerHTML = `
        <div class="unit-card-header">
          <span class="unit-num">#${unit.unitNumber}</span>
          <span class="unit-status-tag ${unit.status.toLowerCase()}">${unit.status}</span>
        </div>
        <div class="unit-card-title">${unit.type}</div>
        <div class="unit-card-details">
          <span>${unit.size.toLocaleString()} sqft</span>
          <span>${unit.psfRate} AED/sqft</span>
        </div>
        <div class="unit-card-footer">
          <span class="unit-price">${formatAED(unit.price)}</span>
          ${isComparing ? '<span class="comparing-indicator">Comparing</span>' : ''}
        </div>
      `;
      
      card.addEventListener('click', () => {
        selectUnit(unit);
        document.querySelectorAll('.unit-card').forEach(el => el.classList.remove('selected'));
        card.classList.add('selected');
      });
      
      els.unitGrid.appendChild(card);
    });
  }

  // Select Unit (Updates right column detail panel & dynamic calculator)
  function selectUnit(unit) {
    selectedUnit = unit;
    
    if (!els.detailContent || !els.emptyState) return;
    
    els.emptyState.style.display = 'none';
    els.detailContent.style.display = 'block';
    
    // Fill text info
    els.detailId.textContent = unit.id;
    els.detailClass.textContent = unit.unitClass;
    els.detailStatus.textContent = unit.status;
    els.detailStatus.className = `detail-val status-badge ${unit.status.toLowerCase()}`;
    els.detailSize.textContent = `${unit.size.toLocaleString()} sqft`;
    els.detailPSF.textContent = `${unit.psfRate.toLocaleString()} AED/sqft`;
    els.detailAspect.textContent = unit.aspect;
    els.detailPrice.textContent = formatAED(unit.price);
    
    // Compare Button State
    updateCompareButtonState();

    // Trigger calculation updates
    recalculateCalculator();
  }

  function updateCompareButtonState() {
    if (!els.btnCompare || !selectedUnit) return;
    const isComparing = comparisonList.includes(selectedUnit.id);
    
    if (isComparing) {
      els.btnCompare.textContent = 'Remove from Compare';
      els.btnCompare.classList.add('active');
    } else {
      els.btnCompare.textContent = 'Add to Compare';
      els.btnCompare.classList.remove('active');
    }
  }

  // EMI and ROI Amortization Math Logic
  function recalculateCalculator() {
    if (!selectedUnit) return;
    
    // Get values from inputs (fallback to defaults if needed)
    const dpPct = parseFloat(els.calcDownPaymentPct.value) || 20;
    const annualRate = parseFloat(els.calcInterestRate.value) || 6.5;
    const tenureYears = parseInt(els.calcTenure.value) || 25;
    
    // Purchase Price
    const P = selectedUnit.price;
    
    // Down Payment Amount
    const dpVal = P * (dpPct / 100);
    if (els.calcDownPaymentVal) els.calcDownPaymentVal.textContent = formatAED(dpVal);
    
    // Loan Amount
    const L = P - dpVal;
    if (els.calcLoanAmount) els.calcLoanAmount.textContent = formatAED(L);
    
    // Monthly Interest Rate (r) and Total Months (n)
    const r = annualRate / (100 * 12);
    const n = tenureYears * 12;
    
    // EMI reducing-balance calculation
    let emi = 0;
    if (L > 0) {
      if (r === 0) {
        emi = L / n;
      } else {
        emi = (L * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      }
    }
    
    if (els.calcMonthlyEMI) els.calcMonthlyEMI.textContent = formatAED(emi) + ' / mo';

    // Dynamic ROI calculations
    // Rent Estimate rates from doc: Conservative (280) & Optimistic (350) per sqft per year
    const rentRateLow = 280;
    const rentRateHigh = 350;
    
    const annualRentLow = selectedUnit.size * rentRateLow;
    const annualRentHigh = selectedUnit.size * rentRateHigh;
    
    const roiLow = (annualRentLow / P) * 100;
    const roiHigh = (annualRentHigh / P) * 100;

    if (els.roiRentLow) els.roiRentLow.textContent = formatAED(annualRentLow) + ' / yr';
    if (els.roiRentHigh) els.roiRentHigh.textContent = formatAED(annualRentHigh) + ' / yr';
    if (els.roiPctLow) els.roiPctLow.textContent = `${roiLow.toFixed(1)}%`;
    if (els.roiPctHigh) els.roiPctHigh.textContent = `${roiHigh.toFixed(1)}%`;
  }

  // Comparison logic
  function toggleCompareUnit() {
    if (!selectedUnit) return;
    
    const index = comparisonList.indexOf(selectedUnit.id);
    if (index > -1) {
      // Remove
      comparisonList.splice(index, 1);
    } else {
      // Add (cap to 3)
      if (comparisonList.length >= 3) {
        alert("You can compare a maximum of 3 units at a time.");
        return;
      }
      comparisonList.push(selectedUnit.id);
    }
    
    updateCompareButtonState();
    renderComparisonDock();
    renderUnits(); // update indicators
  }

  function renderComparisonDock() {
    if (!els.comparisonDock || !els.comparisonSlots) return;
    
    if (comparisonList.length === 0) {
      els.comparisonDock.classList.remove('visible');
      return;
    }
    
    els.comparisonDock.classList.add('visible');
    els.comparisonSlots.innerHTML = '';
    
    comparisonList.forEach(id => {
      const unit = inventoryData.find(u => u.id === id);
      if (!unit) return;
      
      const slot = document.createElement('div');
      slot.className = 'compare-slot-tag';
      slot.innerHTML = `
        <span>#${unit.unitNumber} (${unit.size} sqft)</span>
        <button class="remove-slot" data-id="${unit.id}">&times;</button>
      `;
      
      slot.querySelector('.remove-slot').addEventListener('click', (e) => {
        e.stopPropagation();
        const idToRemove = e.target.getAttribute('data-id');
        comparisonList = comparisonList.filter(id => id !== idToRemove);
        updateCompareButtonState();
        renderComparisonDock();
        renderUnits();
      });
      
      els.comparisonSlots.appendChild(slot);
    });

    // Add compare actions button inside dock if we have 2 or 3
    if (comparisonList.length >= 2) {
      const actionBtn = document.createElement('button');
      actionBtn.className = 'btn-trigger-compare-view';
      actionBtn.textContent = `Compare ${comparisonList.length} Units Now`;
      actionBtn.addEventListener('click', showComparisonOverlay);
      els.comparisonSlots.appendChild(actionBtn);
    }
  }

  function showComparisonOverlay() {
    if (comparisonList.length < 2) return;
    if (!els.comparisonOverlay || !els.comparisonTableBody) return;

    els.comparisonTableBody.innerHTML = '';
    
    const compareUnits = comparisonList.map(id => inventoryData.find(u => u.id === id));
    
    // Rows to render
    const rows = [
      { label: 'Unit Code', key: 'id' },
      { label: 'Floor', key: 'floorName' },
      { label: 'Unit Class', key: 'unitClass' },
      { label: 'Suite Type', key: 'type' },
      { label: 'Exposure', key: 'aspect' },
      { label: 'Built-Up Area', key: 'size', format: v => `${v.toLocaleString()} sqft` },
      { label: 'PSF Rate', key: 'psfRate', format: v => `${v.toLocaleString()} AED/sqft` },
      { label: 'Purchase Value', key: 'price', format: v => formatAED(v) },
      { label: 'Conservative Yield (ROI)', key: 'price', format: (price, unit) => {
          const rent = unit.size * 280;
          return `${((rent/price)*100).toFixed(1)}% (${formatAED(rent)}/yr)`;
        } 
      },
      { label: 'Optimistic Yield (ROI)', key: 'price', format: (price, unit) => {
          const rent = unit.size * 350;
          return `${((rent/price)*100).toFixed(1)}% (${formatAED(rent)}/yr)`;
        } 
      },
      { label: 'Estimated Monthly EMI*', key: 'price', format: (price) => {
          // Standard default mortgage estimate (20% dp, 6.5% interest, 25 years)
          const L = price * 0.8;
          const r = 6.5 / (100 * 12);
          const n = 25 * 12;
          const emi = (L * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
          return `${formatAED(emi)}/mo`;
        } 
      },
      { label: 'Milestone Down Payment (20%)', key: 'price', format: v => formatAED(v * 0.2) },
      { label: 'Availability', key: 'status' }
    ];

    rows.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td class="compare-row-header">${row.label}</td>`;
      
      compareUnits.forEach(unit => {
        let displayVal = '';
        if (row.format) {
          displayVal = row.format(unit[row.key], unit);
        } else {
          displayVal = unit[row.key];
        }
        
        tr.innerHTML += `<td>${displayVal}</td>`;
      });
      
      els.comparisonTableBody.appendChild(tr);
    });

    els.comparisonOverlay.classList.add('visible');
  }

  function hideComparisonOverlay() {
    if (els.comparisonOverlay) {
      els.comparisonOverlay.classList.remove('visible');
    }
  }

  // Filter Handlers
  function handleSearch(e) {
    searchFilter = e.target.value.trim().toLowerCase();
    renderUnits();
  }

  function handleClassFilter(e) {
    classFilter = e.target.value;
    renderUnits();
  }

  function handleStatusFilter(e) {
    statusFilter = e.target.value;
    renderUnits();
  }

  function handlePriceFilter(e) {
    maxPrice = parseFloat(e.target.value);
    document.getElementById('ii-price-val').textContent = formatAED(maxPrice);
    renderUnits();
  }

  function handleSizeFilter(e) {
    maxSize = parseFloat(e.target.value);
    document.getElementById('ii-size-val').textContent = `${maxSize.toLocaleString()} sqft`;
    renderUnits();
  }

  // Format Helpers
  function formatAED(val) {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      maximumFractionDigits: 0
    }).format(val);
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDOM);
  } else {
    initDOM();
  }
})();
