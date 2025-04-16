// Check if user is logged in and has correct role
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userType = localStorage.getItem('userType');
    
    if (!currentUser || !userType) {
        window.location.href = 'auth.html';
        return null;
    }
    
    // Redirect customers to their dashboard
    if (userType === 'customer') {
        window.location.href = 'dashboard.html';
        return null;
    }
    
    return currentUser;
}

// Initialize dashboard
function initializeDashboard() {
    const currentUser = checkAuth();
    if (!currentUser) return;
    
    // Update provider information
    document.getElementById('shop-name').textContent = currentUser.name;
    document.getElementById('shop-username').textContent = '@' + currentUser.email.split('@')[0];
    
    // Handle navigation
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    const sections = document.querySelectorAll('.dashboard-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.classList.contains('logout')) {
                handleLogout();
                return;
            }
            
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            
            // Update active states
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                }
            });
        });
    });

    // Load bookings
    loadBookings();
    
    // Load services
    loadServices();
    
    // Load bookings history
    loadBookingsHistory();
    
    // Load settings
    loadSettings();
    
    // Update stats
    updateStats();
    
    // Setup service modal events
    setupServiceModal();
}

// Load and display bookings
function loadBookings() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const providers = JSON.parse(localStorage.getItem('providers'));
    const bookings = providers[currentUser.phone]?.bookings || [];
    
    const bookingsList = document.querySelector('.bookings-list');
    
    // Clear existing content
    bookingsList.innerHTML = '';
    
    // Sort bookings by date (newest first)
    bookings.sort((a, b) => new Date(b.bookingTime) - new Date(a.bookingTime));
    
    // Get pending and in-progress bookings
    const activeBookings = bookings.filter(b => b.status === 'pending' || b.status === 'accepted' || b.status === 'in-progress');
    
    // Display active bookings
    if (activeBookings.length > 0) {
        activeBookings.forEach(booking => {
            const bookingCard = document.createElement('div');
            bookingCard.className = 'booking-card';
            bookingCard.innerHTML = `
                <div class="booking-header">
                    <h3>${booking.name}</h3>
                    <span class="status ${booking.status}">${booking.status}</span>
                </div>
                <div class="booking-details">
                    <p><i class="fas fa-user"></i> ${booking.customer.name}</p>
                    <p><i class="fas fa-car"></i> ${booking.customer.vehicle} (${booking.customer.vehicleNumber})</p>
                    <p><i class="fas fa-clock"></i> ${new Date(booking.bookingTime).toLocaleString()}</p>
                    <p><i class="fas fa-tag"></i> ${booking.price}</p>
                </div>
                <div class="booking-actions">
                    <button onclick="viewBooking('${booking.id}')" class="view-btn">View Details</button>
                    ${booking.status === 'pending' ? `<button onclick="updateBookingStatus('${booking.id}', 'accepted')" class="accept-btn">Accept</button>` : ''}
                    ${booking.status === 'accepted' ? `<button onclick="updateBookingStatus('${booking.id}', 'in-progress')" class="progress-btn">Start Service</button>` : ''}
                    ${booking.status === 'in-progress' ? `<button onclick="updateBookingStatus('${booking.id}', 'completed')" class="complete-btn">Mark Complete</button>` : ''}
                </div>
            `;
            bookingsList.appendChild(bookingCard);
        });
    } else {
        // Show empty state if no bookings
        bookingsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-times"></i>
                <p>No active bookings</p>
            </div>
        `;
    }
}

// Load booking history
function loadBookingsHistory() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const providers = JSON.parse(localStorage.getItem('providers'));
    const bookings = providers[currentUser.phone]?.bookings || [];
    
    const historyTableBody = document.getElementById('bookings-history-body');
    
    // Clear existing content
    historyTableBody.innerHTML = '';
    
    // Sort bookings by date (newest first)
    bookings.sort((a, b) => new Date(b.bookingTime) - new Date(a.bookingTime));
    
    // Get completed bookings
    const completedBookings = bookings.filter(b => b.status === 'completed');
    
    // Display completed bookings in history
    if (completedBookings.length > 0) {
        completedBookings.forEach(booking => {
            const bookingDate = new Date(booking.bookingTime);
            const formattedDate = `${bookingDate.toLocaleDateString()} - ${bookingDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${booking.name}</td>
                <td>${booking.customer.name}</td>
                <td>${booking.customer.vehicle} (${booking.customer.vehicleNumber})</td>
                <td>${formattedDate}</td>
                <td><span class="status ${booking.status}">${booking.status}</span></td>
                <td>${booking.price}</td>
            `;
            historyTableBody.appendChild(row);
        });
    } else {
        // Show empty state if no completed bookings
        historyTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-history">
                    <div class="empty-state">
                        <i class="fas fa-history"></i>
                        <p>No completed bookings yet</p>
                    </div>
                </td>
            </tr>
        `;
    }
}

// Load services
function loadServices() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const providers = JSON.parse(localStorage.getItem('providers'));
    
    // Initialize services array if it doesn't exist
    if (!providers[currentUser.phone].services) {
        providers[currentUser.phone].services = [
            {
                id: 'service-1',
                name: 'Basic Oil Change',
                category: 'Maintenance',
                duration: 45,
                price: 800,
                status: 'active'
            },
            {
                id: 'service-2',
                name: 'Premium Oil Change + Filter',
                category: 'Maintenance',
                duration: 60,
                price: 1200,
                status: 'active'
            },
            {
                id: 'service-3',
                name: 'Basic AC Service',
                category: 'AC',
                duration: 90,
                price: 1500,
                status: 'active'
            },
            {
                id: 'service-4',
                name: 'Premium AC Service',
                category: 'AC',
                duration: 120,
                price: 2500,
                status: 'active'
            },
            {
                id: 'service-5',
                name: 'Brake Pad Replacement',
                category: 'Brakes',
                duration: 90,
                price: 1800,
                status: 'active'
            },
            {
                id: 'service-6',
                name: 'Battery Replacement',
                category: 'Electrical',
                duration: 30,
                price: 4500,
                status: 'active'
            }
        ];
        localStorage.setItem('providers', JSON.stringify(providers));
    }
    
    const services = providers[currentUser.phone].services || [];
    const servicesTableBody = document.getElementById('services-table-body');
    
    // Clear existing content
    servicesTableBody.innerHTML = '';
    
    // Display services
    services.forEach(service => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${service.name}</td>
            <td>${service.category}</td>
            <td>${service.duration} min</td>
            <td>₹${service.price}</td>
            <td><span class="status-badge ${service.status}">${service.status}</span></td>
            <td class="action-buttons">
                <button class="edit-btn" onclick="editService('${service.id}')">Edit</button>
                <button class="disable-btn" onclick="toggleServiceStatus('${service.id}')">
                    ${service.status === 'active' ? 'Disable' : 'Enable'}
                </button>
            </td>
        `;
        servicesTableBody.appendChild(row);
    });
    
    // Setup add service button
    document.getElementById('add-service-btn').addEventListener('click', showAddServiceModal);
}

// View booking details
function viewBooking(bookingTime) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const providers = JSON.parse(localStorage.getItem('providers'));
    const booking = providers[currentUser.phone].bookings.find(b => b.bookingTime === bookingTime);
    
    if (!booking) return;
    
    const modal = document.getElementById('booking-modal');
    const details = document.getElementById('booking-details');
    
    details.innerHTML = `
        <div class="booking-info">
            <h3>Service Details</h3>
            <p><strong>Service:</strong> ${booking.name}</p>
            <p><strong>Price:</strong> ${booking.price}</p>
            <p><strong>Status:</strong> <span class="status ${booking.status}">${booking.status}</span></p>
            <p><strong>Booking Time:</strong> ${new Date(booking.bookingTime).toLocaleString()}</p>
            
            <h3>Customer Details</h3>
            <p><strong>Name:</strong> ${booking.customer.name}</p>
            <p><strong>Phone:</strong> ${booking.customer.phone}</p>
            <p><strong>Vehicle:</strong> ${booking.customer.vehicle}</p>
            <p><strong>Vehicle Number:</strong> ${booking.customer.vehicleNumber}</p>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Update booking status
function updateBookingStatus(bookingTime, newStatus) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const providers = JSON.parse(localStorage.getItem('providers'));
    
    const bookingIndex = providers[currentUser.phone].bookings.findIndex(b => b.bookingTime === bookingTime);
    
    if (bookingIndex !== -1) {
        // Get the booking and update its status
        const booking = providers[currentUser.phone].bookings[bookingIndex];
        booking.status = newStatus;
        localStorage.setItem('providers', JSON.stringify(providers));
        
        // Also update the status in customer's bookings
        const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        const customerBookingIndex = bookings.findIndex(b => b.id === booking.id);
        
        if (customerBookingIndex !== -1) {
            bookings[customerBookingIndex].status = newStatus;
            localStorage.setItem('bookings', JSON.stringify(bookings));
            
            // Show notification about the update
            showNotification(`Booking status updated to ${newStatus}`, 'success');
        }
        
        // Reload bookings display
        loadBookings();
        // Update stats
        updateStats();
    }
}

// Update dashboard stats
function updateStats() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const providers = JSON.parse(localStorage.getItem('providers'));
    const bookings = providers[currentUser.phone]?.bookings || [];
    
    const pendingCount = bookings.filter(b => b.status === 'pending').length;
    const completedCount = bookings.filter(b => b.status === 'completed').length;
    
    // Get unique customers count
    const uniqueCustomers = new Set(bookings.map(b => b.customer.phone)).size;
    
    document.getElementById('pending-count').textContent = pendingCount;
    document.getElementById('completed-count').textContent = completedCount;
    document.getElementById('customer-count').textContent = uniqueCustomers;
}

// Load settings
function loadSettings() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    document.getElementById('settings-shop-name').value = currentUser.name;
    document.getElementById('settings-username').value = currentUser.email.split('@')[0];
    document.getElementById('settings-email').value = currentUser.email;
    document.getElementById('settings-phone').value = currentUser.phone;
    document.getElementById('settings-hours').value = currentUser.businessHours || '';
}

// Handle settings form submission
document.getElementById('settings-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const providers = JSON.parse(localStorage.getItem('providers'));
    
    const updatedProvider = {
        ...currentUser,
        email: document.getElementById('settings-email').value,
        phone: document.getElementById('settings-phone').value,
        businessHours: document.getElementById('settings-hours').value
    };
    
    providers[currentUser.phone] = updatedProvider;
    localStorage.setItem('providers', JSON.stringify(providers));
    localStorage.setItem('currentUser', JSON.stringify(updatedProvider));
    
    alert('Settings updated successfully!');
});

// Handle logout
function handleLogout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Close modal when clicking on X or outside
document.querySelector('.close')?.addEventListener('click', () => {
    document.getElementById('booking-modal').style.display = 'none';
});

window.addEventListener('click', (e) => {
    const modal = document.getElementById('booking-modal');
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Setup service modal events
function setupServiceModal() {
    // Close service modal when clicking X
    document.querySelector('.close-service-modal')?.addEventListener('click', () => {
        document.getElementById('service-modal').style.display = 'none';
    });
    
    // Close service modal when clicking outside
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('service-modal');
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Cancel button in service modal
    document.querySelector('.cancel-service-btn')?.addEventListener('click', () => {
        document.getElementById('service-modal').style.display = 'none';
    });
    
    // Service form submission
    document.getElementById('service-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        saveService();
    });
}

// Show add service modal
function showAddServiceModal() {
    // Reset form
    document.getElementById('service-form').reset();
    document.getElementById('service-id').value = '';
    document.getElementById('service-modal-title').textContent = 'Add New Service';
    
    // Show modal
    const modal = document.getElementById('service-modal');
    modal.style.display = 'block';
}

// Edit service
function editService(serviceId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const providers = JSON.parse(localStorage.getItem('providers'));
    const services = providers[currentUser.phone].services || [];
    
    // Find service by id
    const service = services.find(s => s.id === serviceId);
    if (!service) return;
    
    // Fill form with service data
    document.getElementById('service-id').value = service.id;
    document.getElementById('service-name').value = service.name;
    document.getElementById('service-category').value = service.category;
    document.getElementById('service-duration').value = service.duration;
    document.getElementById('service-price').value = service.price;
    document.getElementById('service-status').value = service.status;
    
    // Update modal title
    document.getElementById('service-modal-title').textContent = 'Edit Service';
    
    // Show modal
    const modal = document.getElementById('service-modal');
    modal.style.display = 'block';
}

// Save service (add or update)
function saveService() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const providers = JSON.parse(localStorage.getItem('providers'));
    
    // Get form values
    const serviceId = document.getElementById('service-id').value;
    const name = document.getElementById('service-name').value;
    const category = document.getElementById('service-category').value;
    const duration = parseInt(document.getElementById('service-duration').value);
    const price = parseInt(document.getElementById('service-price').value);
    const status = document.getElementById('service-status').value;
    
    // Validate inputs
    if (!name || !category || isNaN(duration) || isNaN(price)) {
        alert('Please fill all fields with valid values');
        return;
    }
    
    // Initialize services array if it doesn't exist
    if (!providers[currentUser.phone].services) {
        providers[currentUser.phone].services = [];
    }
    
    // Check if adding new or updating existing
    if (serviceId) {
        // Update existing service
        const serviceIndex = providers[currentUser.phone].services.findIndex(s => s.id === serviceId);
        if (serviceIndex !== -1) {
            providers[currentUser.phone].services[serviceIndex] = {
                id: serviceId,
                name,
                category,
                duration,
                price,
                status
            };
        }
    } else {
        // Add new service
        const newServiceId = 'service-' + Date.now();
        providers[currentUser.phone].services.push({
            id: newServiceId,
            name,
            category,
            duration,
            price,
            status
        });
    }
    
    // Save changes
    localStorage.setItem('providers', JSON.stringify(providers));
    
    // Close modal
    document.getElementById('service-modal').style.display = 'none';
    
    // Reload services
    loadServices();
    
    // Show success message
    alert(serviceId ? 'Service updated successfully' : 'Service added successfully');
}

// Toggle service status (active/inactive)
function toggleServiceStatus(serviceId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const providers = JSON.parse(localStorage.getItem('providers'));
    const services = providers[currentUser.phone].services || [];
    
    // Find service by id
    const serviceIndex = services.findIndex(s => s.id === serviceId);
    if (serviceIndex === -1) return;
    
    // Toggle status
    const currentStatus = services[serviceIndex].status;
    services[serviceIndex].status = currentStatus === 'active' ? 'inactive' : 'active';
    
    // Save changes
    localStorage.setItem('providers', JSON.stringify(providers));
    
    // Reload services
    loadServices();
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    // Set notification content and type
    notification.textContent = message;
    notification.className = `notification ${type}`;
    
    // Show notification
    notification.classList.add('show');
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', initializeDashboard);
