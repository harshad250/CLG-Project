// Check if user is logged in and has correct role
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userType = localStorage.getItem('userType');
    
    if (!currentUser || !userType) {
        window.location.href = 'auth.html';
        return null;
    }
    
    // Redirect service providers to their dashboard
    if (userType !== 'customer') {
        window.location.href = 'provider-dashboard.html';
        return null;
    }
    
    return currentUser;
}

// Initialize dashboard
function initializeDashboard() {
    const currentUser = checkAuth();
    if (!currentUser) return;
    
    // Update user information in sidebar
    document.getElementById('user-name').textContent = currentUser.name || '';
    const userEmailElement = document.querySelector('.user-email');
    if (userEmailElement) {
        userEmailElement.textContent = currentUser.email || 'john@example.com';
    }
    
    // Update user information in profile section
    updateProfileInfo(currentUser);
    
    // Initialize theme preference
    initTheme();
    
    // Update vehicle information if available
    updateVehicleInfo(currentUser);
    
    // Handle navigation with smooth transitions
    setupNavigation();

    // Setup all interactive elements
    setupInteractiveElements();
    
    // Load dashboard data
    loadDashboardData();

    // Setup search functionality
    setupSearch();
    
    // Setup notifications
    setupNotifications();
    
    // Setup profile edit functionality
    setupProfileEdit();
}

// Initialize theme (light/dark mode)
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    
    // Add theme toggle if it exists
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        // Update initial button state based on saved theme
        const themeIcon = themeToggle.querySelector('i');
        const themeText = themeToggle.querySelector('span');
        
        if (themeIcon) {
            themeIcon.className = savedTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
        
        if (themeText) {
            themeText.textContent = savedTheme === 'light' ? 'Dark Mode' : 'Light Mode';
        }
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.body.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            // Update theme on body
            document.body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Update icon and text
            if (themeIcon) {
                themeIcon.className = newTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
            }
            
            if (themeText) {
                themeText.textContent = newTheme === 'light' ? 'Dark Mode' : 'Light Mode';
            }
        });
    }
}

// Update profile information
function updateProfileInfo(currentUser) {
    // Update profile header
    const profileName = document.getElementById('profile-name');
    const profileEmail = document.getElementById('profile-email');
    const profilePhone = document.getElementById('profile-phone');
    
    if (profileName) profileName.textContent = currentUser.name || '';
    if (profileEmail) profileEmail.textContent = currentUser.email || 'john@example.com';
    if (profilePhone) profilePhone.textContent = currentUser.phone || '+91 9876543210';
    
    // Update profile details
    const userFullname = document.getElementById('user-fullname');
    const userEmail = document.getElementById('user-email');
    const userPhone = document.getElementById('user-phone');
    const userVehicle = document.getElementById('user-vehicle');
    const userVehicleNumber = document.getElementById('user-vehicle-number');
    const memberSince = document.getElementById('member-since');
    
    if (userFullname) userFullname.textContent = currentUser.name || '';
    if (userEmail) userEmail.textContent = currentUser.email || 'john@example.com';
    if (userPhone) userPhone.textContent = currentUser.phone || '+91 9876543210';
    
    // Update vehicle information in profile
    if (userVehicle) userVehicle.textContent = currentUser.vehicle || '';
    if (userVehicleNumber) userVehicleNumber.textContent = currentUser.vehicleNumber || '';
    
    // Set member since date (current date if not available)
    if (memberSince) {
        const date = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        memberSince.textContent = date.toLocaleDateString('en-US', options);
    }
    
    // Update profile pictures throughout the dashboard
    updateProfilePictures(currentUser);
}

// Update profile pictures throughout the dashboard
function updateProfilePictures(currentUser) {
    const profilePicture = currentUser.profilePicture || 'https://via.placeholder.com/150';
    
    // Update sidebar profile picture
    const sidebarProfilePic = document.getElementById('sidebar-profile-pic');
    if (sidebarProfilePic) {
        sidebarProfilePic.src = profilePicture;
    }
    
    // Update header avatar
    const userAvatar = document.querySelector('.user-avatar img');
    if (userAvatar) {
        userAvatar.src = profilePicture;
    }
    
    // Update profile page avatar
    const profileAvatarPic = document.getElementById('profile-avatar-pic');
    if (profileAvatarPic) {
        profileAvatarPic.src = profilePicture;
    }
}

// Setup profile edit functionality
function setupProfileEdit() {
    const editProfileBtn = document.querySelector('.edit-profile-btn');
    if (!editProfileBtn) return;
    
    editProfileBtn.addEventListener('click', () => {
        // Create modal for profile editing
        let modal = document.getElementById('profile-edit-modal');
        if (!modal) {
            const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
            const profilePicture = currentUser.profilePicture || 'https://via.placeholder.com/150';
            
            modal = document.createElement('div');
            modal.id = 'profile-edit-modal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Edit Profile</h2>
                        <span class="close-modal">&times;</span>
                    </div>
                    <div class="modal-body">
                        <div class="profile-picture-upload">
                            <div class="current-picture">
                                <img src="${profilePicture}" alt="Profile Picture" id="preview-profile-pic">
                            </div>
                            <div class="upload-controls">
                                <label for="profile-pic-upload" class="upload-btn">
                                    <i class="fas fa-camera"></i> Change Picture
                                </label>
                                <input type="file" id="profile-pic-upload" accept="image/*" style="display: none;">
                                <p class="upload-hint">Recommended: Square image, max 2MB</p>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="edit-name">Full Name</label>
                            <input type="text" id="edit-name" value="${currentUser.name || ''}" placeholder="Full Name" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-email">Email Address</label>
                            <input type="email" id="edit-email" value="${currentUser.email || ''}" placeholder="Email Address" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-phone">Phone Number</label>
                            <input type="tel" id="edit-phone" value="${currentUser.phone || ''}" placeholder="Phone Number" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-vehicle">Vehicle Model</label>
                            <input type="text" id="edit-vehicle" value="${currentUser.vehicle || ''}" placeholder="Vehicle Model" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-vehicle-number">Vehicle Number</label>
                            <input type="text" id="edit-vehicle-number" value="${currentUser.vehicleNumber || ''}" placeholder="Vehicle Number (e.g., MH-01-AB-1234)" required>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="cancel-edit">Cancel</button>
                        <button class="save-profile">Save Changes</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Setup image upload preview
            const fileInput = document.getElementById('profile-pic-upload');
            const previewImg = document.getElementById('preview-profile-pic');
            
            fileInput.addEventListener('change', function() {
                if (this.files && this.files[0]) {
                    const file = this.files[0];
                    
                    // Check file size (max 2MB)
                    if (file.size > 2 * 1024 * 1024) {
                        showNotification('Image size should be less than 2MB', 'error');
                        return;
                    }
                    
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        previewImg.src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            });
            
            // Setup close button
            const closeBtn = modal.querySelector('.close-modal');
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 300);
            });
            
            // Setup cancel button
            const cancelBtn = modal.querySelector('.cancel-edit');
            cancelBtn.addEventListener('click', () => {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 300);
            });
            
            // Setup save button
            const saveBtn = modal.querySelector('.save-profile');
            saveBtn.addEventListener('click', () => {
                // Get form values
                const name = document.getElementById('edit-name').value;
                const email = document.getElementById('edit-email').value;
                const phone = document.getElementById('edit-phone').value;
                const vehicle = document.getElementById('edit-vehicle').value;
                const vehicleNumber = document.getElementById('edit-vehicle-number').value;
                const profilePicture = document.getElementById('preview-profile-pic').src;
                
                // Validate form
                if (!name || !email || !phone || !vehicle || !vehicleNumber) {
                    showNotification('Please fill in all fields', 'error');
                    return;
                }
                
                // Update user data
                const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
                const updatedUser = {
                    ...currentUser,
                    name,
                    email,
                    phone,
                    vehicle,
                    vehicleNumber,
                    profilePicture,
                    vehicles: [{
                        model: vehicle,
                        number: vehicleNumber,
                        status: 'Active'
                    }]
                };
                
                // Save updated user data
                localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                
                // Update UI
                updateProfileInfo(updatedUser);
                updateVehicleInfo(updatedUser);
                
                // Close modal
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 300);
                
                // Show success notification
                showNotification('Profile updated successfully', 'success');
            });
        }
        
        // Show modal with animation
        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    });
}

// Update vehicle information
function updateVehicleInfo(currentUser) {
    const vehicleList = document.querySelector('.vehicle-list');
    if (!vehicleList) return;
    
    // Clear existing vehicle cards
    vehicleList.innerHTML = '';
    
    // Check if user has vehicle information
    if (currentUser.vehicle && currentUser.vehicleNumber) {
        // Create a card for the user's vehicle
        const vehicleCard = document.createElement('div');
        vehicleCard.className = 'vehicle-card';
        vehicleCard.innerHTML = `
            <img src="https://via.placeholder.com/300x200" alt="Vehicle">
            <div class="vehicle-info">
                <h3>${currentUser.vehicle || ''}</h3>
                <div class="vehicle-details">
                    <p class="vehicle-number">${currentUser.vehicleNumber || ''}</p>
                    <p class="vehicle-status">Status: Active</p>
                </div>
                <button class="service-btn">Book Service</button>
            </div>
        `;
        vehicleList.appendChild(vehicleCard);
    } else if (currentUser.vehicles && currentUser.vehicles.length > 0) {
        // If user has vehicles array, create a card for each vehicle
        currentUser.vehicles.forEach(vehicle => {
            if (vehicle.model && vehicle.number) {
                const vehicleCard = document.createElement('div');
                vehicleCard.className = 'vehicle-card';
                vehicleCard.innerHTML = `
                    <img src="https://via.placeholder.com/300x200" alt="Vehicle">
                    <div class="vehicle-info">
                        <h3>${vehicle.model || ''}</h3>
                        <div class="vehicle-details">
                            <p class="vehicle-number">${vehicle.number || ''}</p>
                            <p class="vehicle-status">Status: ${vehicle.status || 'Active'}</p>
                        </div>
                        <button class="service-btn">Book Service</button>
                    </div>
                `;
                vehicleList.appendChild(vehicleCard);
            }
        });
    } else {
        // If no vehicle information, show a message to add a vehicle
        vehicleList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-car-alt"></i>
                <p>No vehicles added yet</p>
                <button class="add-vehicle-btn">Add Vehicle</button>
            </div>
        `;
    }
    
    // Setup vehicle service buttons after creating the cards
    setupVehicleServiceButtons();
}

// Setup navigation with smooth transitions
function setupNavigation() {
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
            
            // Update active states with smooth transitions
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Add fade-out effect to all sections
            sections.forEach(section => {
                if (section.classList.contains('active')) {
                    section.classList.add('fade-out');
                    
                    // After fade out completes, switch sections
                    setTimeout(() => {
                        sections.forEach(s => {
                            s.classList.remove('active', 'fade-out', 'fade-in');
                            if (s.id === targetId) {
                                s.classList.add('active', 'fade-in');
                            }
                        });
                    }, 300);
                }
            });
            
            // If no active sections (first load)
            if (!document.querySelector('.dashboard-section.active')) {
                sections.forEach(s => {
                    s.classList.remove('active', 'fade-in');
                    if (s.id === targetId) {
                        s.classList.add('active', 'fade-in');
                    }
                });
            }
        });
    });
}

// Setup service booking functionality
function setupServiceBooking() {
    const bookButtons = document.querySelectorAll('.book-now');
    bookButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            const serviceCard = e.target.closest('.service-card');
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            const providerUsername = serviceCard.querySelector('.provider-username').value.trim();
            
            if (!providerUsername) {
                alert('Please enter a provider username');
                return;
            }

            // Find provider by username
            const providers = JSON.parse(localStorage.getItem('providers')) || {};
            let targetProvider = null;
            for (let provider of Object.values(providers)) {
                if (provider.username === providerUsername) {
                    targetProvider = provider;
                    break;
                }
            }

            if (!targetProvider) {
                alert('Provider not found. Please check the username and try again.');
                return;
            }

            const service = serviceCard.querySelector('h3').textContent;
            const price = serviceCard.querySelector('p').textContent;
            
            // Store service details for payment page
            const bookingDetails = {
                name: service,
                price: price,
                vehicle: currentUser.vehicle,
                vehicleNumber: currentUser.vehicleNumber,
                provider: {
                    username: targetProvider.username,
                    shopName: targetProvider.shopName,
                    phone: targetProvider.phone
                },
                status: 'pending',
                bookingTime: new Date().toISOString()
            };

            sessionStorage.setItem('selectedService', JSON.stringify(bookingDetails));
            
            // Add booking to provider's list
            providers[targetProvider.phone].bookings = providers[targetProvider.phone].bookings || [];
            providers[targetProvider.phone].bookings.push({
                ...bookingDetails,
                customer: {
                    name: currentUser.name,
                    phone: currentUser.phone,
                    vehicle: currentUser.vehicle,
                    vehicleNumber: currentUser.vehicleNumber
                }
            });
            
            localStorage.setItem('providers', JSON.stringify(providers));
            
            window.location.href = 'payment.html';
        });
    });
}

// Setup all interactive elements
function setupInteractiveElements() {
    // Setup service booking buttons
    setupServiceButtons();
    
    // Setup stat cards click events
    setupStatCards();
    
    // Setup activity cards
    setupActivityCards();
    
    // Setup vehicle service buttons
    setupVehicleServiceButtons();
    
    // Setup upcoming service actions
    setupUpcomingServiceActions();
}

// Setup service buttons
function setupServiceButtons() {
    const bookButtons = document.querySelectorAll('.book-now');
    
    bookButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const serviceCard = e.target.closest('.service-card');
            const serviceName = serviceCard.querySelector('h3').textContent;
            
            // Show booking confirmation with animation
            showBookingConfirmation(serviceName);
        });
    });
}

// Show booking confirmation with animation
function showBookingConfirmation(serviceName) {
    // Create modal element if it doesn't exist
    let modal = document.getElementById('booking-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'booking-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Service Provider Selection</h2>
                    <span class="close-modal">&times;</span>
                </div>
                <div class="modal-body">
                    <h3>You're booking: <span id="selected-service"></span></h3>
                    <p>Please select a service provider from the list below or search by email:</p>
                    
                    <div class="provider-search">
                        <input type="text" id="provider-email-search" placeholder="Search provider by email..." />
                        <button id="search-provider-btn"><i class="fas fa-search"></i></button>
                    </div>
                    
                    <div class="provider-list">
                        <div class="provider-card" data-provider="auto-care" data-email="autocare@example.com">
                            <div class="provider-logo">
                                <i class="fas fa-tools"></i>
                            </div>
                            <div class="provider-info">
                                <h4>Auto Care Workshop</h4>
                                <p>&#9733;&#9733;&#9733;&#9733;&#9733; (4.8)</p>
                                <p>2.5 km away</p>
                                <p class="provider-email">autocare@example.com</p>
                            </div>
                        </div>
                        <div class="provider-card" data-provider="premium-garage" data-email="premium@example.com">
                            <div class="provider-logo">
                                <i class="fas fa-car-alt"></i>
                            </div>
                            <div class="provider-info">
                                <h4>Premium Auto Garage</h4>
                                <p>&#9733;&#9733;&#9733;&#9733; (4.5)</p>
                                <p>3.2 km away</p>
                                <p class="provider-email">premium@example.com</p>
                            </div>
                        </div>
                        <div class="provider-card" data-provider="quick-service" data-email="quick@example.com">
                            <div class="provider-logo">
                                <i class="fas fa-oil-can"></i>
                            </div>
                            <div class="provider-info">
                                <h4>Quick Service Center</h4>
                                <p>&#9733;&#9733;&#9733;&#9733;&#9733; (4.9)</p>
                                <p>4.7 km away</p>
                                <p class="provider-email">quick@example.com</p>
                            </div>
                        </div>
                    </div>
                    
                    <div id="custom-provider-section" style="display: none;">
                        <h4>Provider Found:</h4>
                        <div id="custom-provider-card" class="provider-card">
                            <!-- Custom provider info will be inserted here -->
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="cancel-booking">Cancel</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Setup modal events
        const closeBtn = modal.querySelector('.close-modal');
        const cancelBtn = modal.querySelector('.cancel-booking');
        const providerCards = modal.querySelectorAll('.provider-list .provider-card');
        const searchBtn = modal.querySelector('#search-provider-btn');
        const emailInput = modal.querySelector('#provider-email-search');
        
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        });
        
        cancelBtn.addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        });
        
        // Search provider by email
        searchBtn.addEventListener('click', () => {
            searchProviderByEmail(emailInput.value, modal, serviceName);
        });
        
        // Also trigger search on Enter key
        emailInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                searchProviderByEmail(emailInput.value, modal, serviceName);
            }
        });
        
        providerCards.forEach(card => {
            card.addEventListener('click', () => {
                selectProviderCard(card, modal, providerCards, serviceName);
            });
        });
    }
    
    // Update modal content for current service
    modal.querySelector('#selected-service').textContent = serviceName;
    
    // Show modal with animation
    modal.style.display = 'block';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

// Search for a provider by email
function searchProviderByEmail(email, modal, serviceName) {
    if (!email) {
        showNotification('Please enter an email address', 'error');
        return;
    }
    
    // First check in the existing provider cards
    const providerList = modal.querySelector('.provider-list');
    const existingCards = providerList.querySelectorAll('.provider-card');
    let providerFound = false;
    
    existingCards.forEach(card => {
        const providerEmail = card.dataset.email;
        if (providerEmail && providerEmail.toLowerCase() === email.toLowerCase()) {
            // Select this provider card
            const providerCards = modal.querySelectorAll('.provider-list .provider-card');
            selectProviderCard(card, modal, providerCards, serviceName);
            providerFound = true;
            
            // Highlight the card with a pulse animation
            card.classList.add('pulse-animation');
            setTimeout(() => {
                card.classList.remove('pulse-animation');
            }, 1500);
        }
    });
    
    if (!providerFound) {
        // Check in the providers database in localStorage
        const providers = JSON.parse(localStorage.getItem('providers')) || {};
        let foundProvider = null;
        
        // Look for provider by email
        for (const phone in providers) {
            const provider = providers[phone];
            if (provider.email && provider.email.toLowerCase() === email.toLowerCase()) {
                foundProvider = provider;
                break;
            }
        }
        
        if (foundProvider) {
            // Show the custom provider section
            const customSection = modal.querySelector('#custom-provider-section');
            const customCard = modal.querySelector('#custom-provider-card');
            
            // Clear any existing selection
            const allCards = modal.querySelectorAll('.provider-card');
            allCards.forEach(c => c.classList.remove('selected'));
            
            // Create the custom provider card
            customCard.innerHTML = `
                <div class="provider-logo">
                    <i class="fas fa-user-cog"></i>
                </div>
                <div class="provider-info">
                    <h4>${foundProvider.name}</h4>
                    <p><i class="fas fa-envelope"></i> ${foundProvider.email}</p>
                    <p><i class="fas fa-phone"></i> ${foundProvider.phone}</p>
                </div>
            `;
            
            // Set data attributes
            customCard.dataset.email = foundProvider.email;
            customCard.dataset.phone = foundProvider.phone;
            customCard.dataset.name = foundProvider.name;
            
            // Show the section and select the card
            customSection.style.display = 'block';
            customCard.classList.add('selected');
            
            // Add click event to the custom card
            customCard.addEventListener('click', () => {
                selectProviderCard(customCard, modal, allCards, serviceName);
            });
            
            // Add confirm button if not already present
            addConfirmButton(modal, serviceName);
            
            showNotification(`Provider found: ${foundProvider.name}`, 'success');
        } else {
            // Provider not found - offer to create a new provider
            const customSection = modal.querySelector('#custom-provider-section');
            const customCard = modal.querySelector('#custom-provider-card');
            
            // Clear any existing selection
            const allCards = modal.querySelectorAll('.provider-card');
            allCards.forEach(c => c.classList.remove('selected'));
            
            // Create a form to input provider details
            customCard.innerHTML = `
                <div class="provider-logo">
                    <i class="fas fa-user-plus"></i>
                </div>
                <div class="provider-info">
                    <h4>Create New Provider</h4>
                    <p>No provider found with email: ${email}</p>
                    <div class="new-provider-form">
                        <input type="text" id="new-provider-name" placeholder="Provider Name" required />
                        <input type="text" id="new-provider-email" value="${email}" readonly />
                        <input type="text" id="new-provider-phone" placeholder="Phone Number" />
                    </div>
                </div>
            `;
            
            // Set data attributes
            customCard.dataset.email = email;
            customCard.dataset.isNew = 'true';
            
            // Show the section and select the card
            customSection.style.display = 'block';
            customCard.classList.add('selected');
            
            // Add confirm button if not already present
            if (!modal.querySelector('.confirm-booking')) {
                const confirmBtn = document.createElement('button');
                confirmBtn.className = 'confirm-booking';
                confirmBtn.textContent = 'Create Provider & Book';
                modal.querySelector('.modal-footer').appendChild(confirmBtn);
                
                confirmBtn.addEventListener('click', () => {
                    const nameInput = document.getElementById('new-provider-name');
                    const phoneInput = document.getElementById('new-provider-phone');
                    
                    if (!nameInput.value) {
                        showNotification('Please enter provider name', 'error');
                        nameInput.focus();
                        return;
                    }
                    
                    // Create new provider and process booking
                    const newProviderName = nameInput.value;
                    const newProviderPhone = phoneInput.value || `9${Math.floor(Math.random() * 900000000) + 100000000}`;
                    
                    // Create provider in localStorage
                    const providers = JSON.parse(localStorage.getItem('providers')) || {};
                    providers[newProviderPhone] = {
                        name: newProviderName,
                        email: email,
                        phone: newProviderPhone,
                        bookings: [],
                        createdAt: new Date()
                    };
                    localStorage.setItem('providers', JSON.stringify(providers));
                    
                    // Process the booking with the new provider
                    processBooking(serviceName, newProviderName, email);
                    
                    // Close modal
                    modal.classList.remove('show');
                    setTimeout(() => {
                        modal.style.display = 'none';
                    }, 300);
                });
            }
            
            showNotification('Enter details to create a new provider', 'info');
        }
    }
}

// Select a provider card and add confirm button
function selectProviderCard(card, modal, allCards, serviceName) {
    // Clear any previous selection
    allCards.forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    
    // Add confirm button if not already present
    addConfirmButton(modal, serviceName);
}

// Add confirm booking button
function addConfirmButton(modal, serviceName) {
    // Add confirm button if not already present
    if (!modal.querySelector('.confirm-booking')) {
        const confirmBtn = document.createElement('button');
        confirmBtn.className = 'confirm-booking';
        confirmBtn.textContent = 'Confirm Booking';
        modal.querySelector('.modal-footer').appendChild(confirmBtn);
        
        confirmBtn.addEventListener('click', () => {
            const selectedProvider = modal.querySelector('.provider-card.selected');
            if (selectedProvider) {
                let providerName = '';
                let providerEmail = '';
                
                // Check if it's a custom provider or from the list
                if (selectedProvider.id === 'custom-provider-card') {
                    providerName = selectedProvider.dataset.name;
                    providerEmail = selectedProvider.dataset.email;
                } else {
                    providerName = selectedProvider.querySelector('h4').textContent;
                    providerEmail = selectedProvider.dataset.email;
                }
                
                processBooking(serviceName, providerName, providerEmail);
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 300);
            } else {
                showNotification('Please select a service provider', 'error');
            }
        });
    }
}

// Process booking after provider selection
function processBooking(serviceName, providerName, providerEmail) {
    // Create a new booking in the system
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {
        name: 'John Doe',
        vehicles: [{
            model: 'Honda City',
            number: 'MH-01-AB-1234',
            status: 'Active'
        }]
    };
    
    // Get selected vehicle
    let vehicle = '';
    let vehicleNumber = '';
    
    // Check if a vehicle was selected from the vehicle section
    const selectedVehicle = JSON.parse(sessionStorage.getItem('selectedVehicle'));
    if (selectedVehicle) {
        vehicle = selectedVehicle.model;
        vehicleNumber = selectedVehicle.number;
    } else if (currentUser.vehicle && currentUser.vehicleNumber) {
        // Use the primary vehicle from user profile
        vehicle = currentUser.vehicle;
        vehicleNumber = currentUser.vehicleNumber;
    } else if (currentUser.vehicles && currentUser.vehicles.length > 0) {
        // Use the first vehicle in the list
        vehicle = currentUser.vehicles[0].model;
        vehicleNumber = currentUser.vehicles[0].number;
    }
    
    // Create a unique booking ID
    const bookingId = Date.now().toString();
    const bookingTime = new Date();
    
    // Create booking object for customer dashboard
    const customerBooking = {
        id: bookingId,
        service: serviceName,
        provider: providerName,
        providerEmail: providerEmail, // Store provider email for reference
        vehicle: vehicle,
        vehicleNumber: vehicleNumber,
        date: bookingTime,
        status: 'pending',
        price: `₹${getServicePrice(serviceName)}`
    };
    
    // Save to customer's bookings in localStorage
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    bookings.push(customerBooking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    // Now add the booking to the provider's dashboard
    const providers = JSON.parse(localStorage.getItem('providers')) || {};
    
    // Find the provider by email first (more reliable than name)
    let providerPhone = null;
    if (providerEmail) {
        for (const phone in providers) {
            if (providers[phone].email && providers[phone].email.toLowerCase() === providerEmail.toLowerCase()) {
                providerPhone = phone;
                break;
            }
        }
    }
    
    // If not found by email, try by name as fallback
    if (!providerPhone) {
        for (const phone in providers) {
            if (providers[phone].name === providerName) {
                providerPhone = phone;
                break;
            }
        }
    }
    
    // If provider not found, create a new one
    if (!providerPhone) {
        // Generate a unique phone number for the provider
        providerPhone = `9${Math.floor(Math.random() * 900000000) + 100000000}`; // Random 10-digit number starting with 9
        
        // Create the provider object
        providers[providerPhone] = {
            name: providerName,
            email: providerEmail || `${providerName.toLowerCase().replace(/\s+/g, '')}@example.com`,
            phone: providerPhone,
            bookings: [],
            createdAt: new Date()
        };
    }
    
    // Ensure the provider has a bookings array
    if (!providers[providerPhone].bookings) {
        providers[providerPhone].bookings = [];
    }
    
    // Create booking object for provider dashboard
    const providerBooking = {
        id: bookingId,
        bookingTime: bookingTime,
        name: serviceName,
        price: `₹${getServicePrice(serviceName)}`,
        status: 'pending',
        customer: {
            name: currentUser.name || 'Customer',
            phone: currentUser.phone || '0000000000',
            email: currentUser.email || 'customer@example.com',
            vehicle: vehicle,
            vehicleNumber: vehicleNumber
        }
    };
    
    // Add to provider's bookings
    providers[providerPhone].bookings.push(providerBooking);
    localStorage.setItem('providers', JSON.stringify(providers));
    
    // Show success notification
    showNotification(`Your ${serviceName} appointment has been booked with ${providerName}`, 'success');
    
    // Refresh dashboard data
    loadDashboardData();
}

// Setup stat cards click events
function setupStatCards() {
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach(card => {
        card.addEventListener('click', () => {
            const statType = card.querySelector('.stat-info p').textContent.toLowerCase();
            
            // Navigate to appropriate section based on stat type
            if (statType.includes('vehicle')) {
                navigateToSection('my-vehicles');
            } else if (statType.includes('history')) {
                navigateToSection('service-history');
            } else if (statType.includes('upcoming')) {
                navigateToSection('upcoming-services');
            } else if (statType.includes('provider')) {
                navigateToSection('find-service');
            }
        });
    });
}

// Navigate to a specific section
function navigateToSection(sectionId) {
    const navLink = document.querySelector(`.sidebar-nav a[href="#${sectionId}"]`);
    if (navLink) {
        navLink.click();
    }
}

// Setup activity cards
function setupActivityCards() {
    const activityCards = document.querySelectorAll('.activity-card');
    
    activityCards.forEach(card => {
        card.addEventListener('click', () => {
            const activityStatus = card.querySelector('.activity-status').textContent.toLowerCase();
            
            if (activityStatus.includes('upcoming')) {
                navigateToSection('upcoming-services');
            } else {
                navigateToSection('service-history');
            }
        });
    });
}

// Setup vehicle service buttons
function setupVehicleServiceButtons() {
    // Setup service buttons for existing vehicles
    const serviceButtons = document.querySelectorAll('.service-btn');
    serviceButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const vehicleCard = e.target.closest('.vehicle-card');
            const vehicleModel = vehicleCard.querySelector('h3').textContent;
            const vehicleNumber = vehicleCard.querySelector('.vehicle-number').textContent;
            
            // Store selected vehicle in session storage
            sessionStorage.setItem('selectedVehicle', JSON.stringify({
                model: vehicleModel,
                number: vehicleNumber
            }));
            
            // Navigate to services section
            navigateToSection('find-service');
        });
    });
    
    // Setup add vehicle button if it exists
    const addVehicleBtn = document.querySelector('.add-vehicle-btn');
    if (addVehicleBtn) {
        addVehicleBtn.addEventListener('click', () => {
            // Show add vehicle modal
            showAddVehicleModal();
        });
    }
}

// Show add vehicle modal
function showAddVehicleModal() {
    // Create modal if it doesn't exist
    let modal = document.getElementById('add-vehicle-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'add-vehicle-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Add Vehicle</h2>
                    <span class="close-modal">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="vehicle-model">Vehicle Model</label>
                        <input type="text" id="vehicle-model" placeholder="e.g. Honda City">
                    </div>
                    <div class="form-group">
                        <label for="vehicle-number">Vehicle Number</label>
                        <input type="text" id="vehicle-number" placeholder="e.g. MH-01-AB-1234">
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="cancel-edit">Cancel</button>
                    <button class="save-vehicle">Save Vehicle</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Setup close button
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        });
        
        // Setup cancel button
        const cancelBtn = modal.querySelector('.cancel-edit');
        cancelBtn.addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        });
        
        // Setup save button
        const saveBtn = modal.querySelector('.save-vehicle');
        saveBtn.addEventListener('click', () => {
            const vehicleModel = document.getElementById('vehicle-model').value.trim();
            const vehicleNumber = document.getElementById('vehicle-number').value.trim();
            
            if (!vehicleModel || !vehicleNumber) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            // Get current user
            const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
            
            // Add new vehicle
            if (!currentUser.vehicles) {
                currentUser.vehicles = [];
            }
            
            currentUser.vehicles.push({
                model: vehicleModel,
                number: vehicleNumber,
                status: 'Active'
            });
            
            // Save updated user data
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Update vehicle display
            updateVehicleInfo(currentUser);
            
            // Update stat count
            const statCards = document.querySelectorAll('.stat-card');
            statCards.forEach(card => {
                const statType = card.querySelector('.stat-info p').textContent.toLowerCase();
                if (statType.includes('vehicle')) {
                    const countElement = card.querySelector('.stat-info h3');
                    countElement.textContent = currentUser.vehicles.length;
                }
            });
            
            // Show success notification
            showNotification('Vehicle added successfully', 'success');
            
            // Close modal
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        });
    }
    
    // Show modal with animation
    modal.style.display = 'block';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

// Show service selection modal
function showServiceSelectionModal() {
    // Create modal if it doesn't exist
    let modal = document.getElementById('service-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'service-modal';
        modal.classList.add('modal');
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Select Service</h2>
                <div class="service-list">
                    <div class="service-option" data-service="Oil Change" data-price="₹1399">
                        <i class="fas fa-oil-can"></i>
                        <h3>Oil Change</h3>
                        <p>From ₹1399</p>
                        <div class="provider-select">
                            <input type="text" placeholder="Enter provider username" class="provider-username">
                        </div>
                    </div>
                    <div class="service-option" data-service="Dent Removal" data-price="₹2999">
                        <i class="fas fa-car-crash"></i>
                        <h3>Dent Removal</h3>
                        <p>From ₹2999</p>
                        <div class="provider-select">
                            <input type="text" placeholder="Enter provider username" class="provider-username">
                        </div>
                    </div>
                    <div class="service-option" data-service="AC Service" data-price="₹1699">
                        <i class="fas fa-snowflake"></i>
                        <h3>AC Service</h3>
                        <p>From ₹1699</p>
                        <div class="provider-select">
                            <input type="text" placeholder="Enter provider username" class="provider-username">
                        </div>
                    </div>
                </div>
            </div>`;
        document.body.appendChild(modal);

        // Add click handlers for service options
        const serviceOptions = modal.querySelectorAll('.service-option');
        serviceOptions.forEach(option => {
            option.addEventListener('click', () => {
                const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                const providerUsername = option.querySelector('.provider-username').value.trim();

                if (!providerUsername) {
                    alert('Please enter a provider username');
                    return;
                }

                // Find provider by username
                const providers = JSON.parse(localStorage.getItem('providers')) || {};
                let targetProvider = null;
                for (let provider of Object.values(providers)) {
                    if (provider.username === providerUsername) {
                        targetProvider = provider;
                        break;
                    }
                }

                if (!targetProvider) {
                    alert('Provider not found. Please check the username and try again.');
                    return;
                }

                const bookingDetails = {
                    name: option.dataset.service,
                    price: option.dataset.price,
                    vehicle: currentUser.vehicle,
                    vehicleNumber: currentUser.vehicleNumber,
                    provider: {
                        username: targetProvider.username,
                        shopName: targetProvider.shopName,
                        phone: targetProvider.phone
                    },
                    status: 'pending',
                    bookingTime: new Date().toISOString()
                };

                sessionStorage.setItem('selectedService', JSON.stringify(bookingDetails));

                // Add booking to provider's list
                providers[targetProvider.phone].bookings = providers[targetProvider.phone].bookings || [];
                providers[targetProvider.phone].bookings.push({
                    ...bookingDetails,
                    customer: {
                        name: currentUser.name,
                        phone: currentUser.phone,
                        vehicle: currentUser.vehicle,
                        vehicleNumber: currentUser.vehicleNumber
                    }
                });

                localStorage.setItem('providers', JSON.stringify(providers));

                window.location.href = 'payment.html';
            });
        });

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    modal.style.display = 'block';
}

// Setup upcoming service actions
function setupUpcomingServiceActions() {
    const rescheduleButtons = document.querySelectorAll('.reschedule-btn');
    const cancelButtons = document.querySelectorAll('.cancel-btn');
    
    // Setup reschedule buttons
    rescheduleButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const serviceCard = e.target.closest('.upcoming-service-card');
            const serviceName = serviceCard.querySelector('h4').textContent;
            const bookingId = serviceCard.dataset.bookingId;
            
            // Show reschedule modal
            showRescheduleModal(serviceName, serviceCard, bookingId);
        });
    });
    
    // Setup cancel buttons
    cancelButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const serviceCard = e.target.closest('.upcoming-service-card');
            const serviceName = serviceCard.querySelector('h4').textContent;
            const bookingId = serviceCard.dataset.bookingId;
            
            // Show cancel confirmation
            showCancelConfirmation(serviceName, serviceCard, bookingId);
        });
    });
    
    // Add refresh button if it doesn't exist
    const refreshButton = document.querySelector('.refresh-bookings');
    if (!refreshButton) {
        const upcomingSection = document.getElementById('upcoming-services');
        if (upcomingSection) {
            const sectionHeader = upcomingSection.querySelector('h2');
            if (sectionHeader) {
                const refreshBtn = document.createElement('button');
                refreshBtn.className = 'refresh-bookings';
                refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
                refreshBtn.title = 'Check for status updates';
                sectionHeader.appendChild(refreshBtn);
                
                refreshBtn.addEventListener('click', () => {
                    // Add spinning animation
                    refreshBtn.classList.add('spinning');
                    
                    // Check for updates
                    checkBookingStatusUpdates();
                    
                    // Stop spinning after 1 second
                    setTimeout(() => {
                        refreshBtn.classList.remove('spinning');
                    }, 1000);
                });
            }
        }
    }
}

// Check for booking status updates
function checkBookingStatusUpdates() {
    // Get customer bookings
    const customerBookings = JSON.parse(localStorage.getItem('bookings')) || [];
    
    // Get all provider bookings
    const providers = JSON.parse(localStorage.getItem('providers')) || {};
    let updated = false;
    
    // Loop through customer bookings and check for status updates
    customerBookings.forEach(booking => {
        if (!booking.id) return; // Skip bookings without IDs
        
        // Look for this booking in provider bookings
        for (const phone in providers) {
            const providerBookings = providers[phone].bookings || [];
            const matchingBooking = providerBookings.find(b => b.id === booking.id);
            
            if (matchingBooking && matchingBooking.status !== booking.status) {
                // Update customer booking status
                booking.status = matchingBooking.status;
                updated = true;
                
                // Show notification about status change
                showNotification(`Your ${booking.service} appointment status has been updated to ${matchingBooking.status}`, 'info');
            }
        }
    });
    
    // If any updates were made, save and refresh
    if (updated) {
        localStorage.setItem('bookings', JSON.stringify(customerBookings));
        loadUpcomingServices();
        loadRecentActivity();
    }
}

// Show reschedule modal
function showRescheduleModal(serviceName, serviceCard, bookingId) {
    // Create modal element if it doesn't exist
    let modal = document.getElementById('reschedule-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'reschedule-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Reschedule Appointment</h2>
                    <span class="close-modal">&times;</span>
                </div>
                <div class="modal-body">
                    <h3>You're rescheduling: <span id="reschedule-service"></span></h3>
                    <div class="date-selection">
                        <label for="new-date">Select New Date:</label>
                        <input type="date" id="new-date" min="${new Date().toISOString().split('T')[0]}">
                    </div>
                    <div class="time-selection">
                        <label for="new-time">Select New Time:</label>
                        <select id="new-time">
                            <option value="09:00">9:00 AM</option>
                            <option value="10:00">10:00 AM</option>
                            <option value="11:00">11:00 AM</option>
                            <option value="12:00">12:00 PM</option>
                            <option value="13:00">1:00 PM</option>
                            <option value="14:00">2:00 PM</option>
                            <option value="15:00">3:00 PM</option>
                            <option value="16:00">4:00 PM</option>
                            <option value="17:00">5:00 PM</option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="cancel-reschedule">Cancel</button>
                    <button class="confirm-reschedule">Confirm Reschedule</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Setup modal events
        const closeBtn = modal.querySelector('.close-modal');
        const cancelBtn = modal.querySelector('.cancel-reschedule');
        const confirmBtn = modal.querySelector('.confirm-reschedule');
        
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        });
        
        cancelBtn.addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        });
        
        confirmBtn.addEventListener('click', () => {
            const newDate = modal.querySelector('#new-date').value;
            const newTime = modal.querySelector('#new-time').value;
            
            if (!newDate) {
                alert('Please select a date');
                return;
            }
            
            // Process rescheduling
            processReschedule(serviceName, serviceCard, newDate, newTime);
            
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        });
    }
    
    // Update modal content for current service
    modal.querySelector('#reschedule-service').textContent = serviceName;
    
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    modal.querySelector('#new-date').value = tomorrow.toISOString().split('T')[0];
    
    // Show modal with animation
    modal.style.display = 'block';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

// Process rescheduling
function processReschedule(serviceName, serviceCard, newDate, newTime, bookingId) {
    const newDateObj = new Date(newDate + 'T' + newTime);
    const day = newDateObj.getDate();
    const month = newDateObj.toLocaleString('default', { month: 'short' });
    
    // Update the date display in the card
    const dateElement = serviceCard.querySelector('.service-date');
    dateElement.querySelector('.day').textContent = day;
    dateElement.querySelector('.month').textContent = month;
    
    // Update the time in the details
    const timeText = serviceCard.querySelector('.service-details p:nth-child(3)');
    const hour = parseInt(newTime.split(':')[0]);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    timeText.textContent = `Time: ${hour12}:00 ${ampm}`;
    
    // Update the booking in localStorage
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);
    
    if (bookingIndex !== -1) {
        // Update the date in the customer's booking
        bookings[bookingIndex].date = newDateObj;
        localStorage.setItem('bookings', JSON.stringify(bookings));
        
        // Also update in provider's dashboard
        const providers = JSON.parse(localStorage.getItem('providers')) || {};
        for (const phone in providers) {
            const providerBookings = providers[phone].bookings || [];
            const providerBookingIndex = providerBookings.findIndex(b => b.id === bookingId);
            
            if (providerBookingIndex !== -1) {
                // Update the booking time in provider's booking
                providerBookings[providerBookingIndex].bookingTime = newDateObj;
                localStorage.setItem('providers', JSON.stringify(providers));
                break;
            }
        }
    }
    
    // Show success notification
    showNotification(`Your ${serviceName} appointment has been rescheduled to ${month} ${day} at ${hour12}:00 ${ampm}`, 'success');
    
    // Add animation to the card
    serviceCard.classList.add('updated');
    setTimeout(() => {
        serviceCard.classList.remove('updated');
    }, 2000);
}

// Show cancel confirmation
function showCancelConfirmation(serviceName, serviceCard, bookingId) {
    // Create confirmation dialog
    const confirmDialog = document.createElement('div');
    confirmDialog.className = 'confirm-dialog';
    confirmDialog.innerHTML = `
        <div class="confirm-dialog-content">
            <h3>Cancel Service</h3>
            <p>Are you sure you want to cancel your ${serviceName} appointment?</p>
            <div class="confirm-dialog-actions">
                <button class="confirm-yes">Yes, Cancel</button>
                <button class="confirm-no">No, Keep</button>
            </div>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(confirmDialog);
    
    // Setup action buttons
    confirmDialog.querySelector('.confirm-yes').addEventListener('click', () => {
        // Process cancellation
        processCancellation(serviceName, serviceCard, bookingId);
        // Remove dialog
        document.body.removeChild(confirmDialog);
    });
    
    confirmDialog.querySelector('.confirm-no').addEventListener('click', () => {
        // Just remove dialog
        document.body.removeChild(confirmDialog);
    });
}

// Helper function to get service price
function getServicePrice(serviceName) {
    // Service price mapping
    const servicePrices = {
        'Oil Change': 1399,
        'Brake Service': 2499,
        'AC Service': 1699,
        'Dent Removal': 2999,
        'Wheel Alignment': 1299,
        'Battery Replacement': 3499,
        'Full Service': 4999,
        'Engine Tuning': 2799
    };
    
    // Return the price if found, otherwise return a default price
    return servicePrices[serviceName] || 1999;
}

// Process cancellation
function processCancellation(serviceName, serviceCard, bookingId) {
    // Update the booking status in localStorage
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);
    
    if (bookingIndex !== -1) {
        // Remove the booking from customer's bookings
        bookings.splice(bookingIndex, 1);
        localStorage.setItem('bookings', JSON.stringify(bookings));
        
        // Also update in provider's dashboard
        const providers = JSON.parse(localStorage.getItem('providers')) || {};
        for (const phone in providers) {
            const providerBookings = providers[phone].bookings || [];
            const providerBookingIndex = providerBookings.findIndex(b => b.id === bookingId);
            
            if (providerBookingIndex !== -1) {
                // Update the booking status to cancelled in provider's booking
                providerBookings[providerBookingIndex].status = 'cancelled';
                localStorage.setItem('providers', JSON.stringify(providers));
                break;
            }
        }
    }
    
    // Remove the service card with animation
    serviceCard.classList.add('removing');
    setTimeout(() => {
        serviceCard.remove();
        
        // Check if there are any services left
        const servicesList = document.querySelector('.upcoming-services-list');
        if (servicesList.children.length === 0) {
            // Show empty state
            servicesList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-times"></i>
                    <p>No upcoming services</p>
                    <button class="book-service-btn" onclick="navigateToSection('find-service')">Book a Service</button>
                </div>
            `;
        }
    }, 300);
    
    // Show cancellation notification
    showNotification(`Your ${serviceName} appointment has been cancelled`, 'info');
}

// Update stat count
function updateStatCount(type, change) {
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach(card => {
        const statType = card.querySelector('.stat-info p').textContent.toLowerCase();
        
        if (type === 'upcoming' && statType.includes('upcoming')) {
            const countElement = card.querySelector('.stat-info h3');
            let count = parseInt(countElement.textContent);
            count += change;
            countElement.textContent = count;
        }
    });
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;
    
    searchInput.addEventListener('keyup', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        // If Enter key is pressed, perform search
        if (e.key === 'Enter' && searchTerm) {
            performSearch(searchTerm);
        }
    });
    
    // Search icon click
    const searchIcon = document.querySelector('.search-icon');
    if (searchIcon) {
        searchIcon.addEventListener('click', () => {
            const searchTerm = searchInput.value.toLowerCase();
            if (searchTerm) {
                performSearch(searchTerm);
            }
        });
    }
}

// Perform search
function performSearch(searchTerm) {
    // Create search results section if it doesn't exist
    let searchSection = document.getElementById('search-results');
    if (!searchSection) {
        searchSection = document.createElement('section');
        searchSection.id = 'search-results';
        searchSection.className = 'dashboard-section';
        searchSection.innerHTML = `
            <h2>Search Results</h2>
            <div class="search-results-container"></div>
        `;
        document.querySelector('.main-content').appendChild(searchSection);
    }
    
    // Show the search results section
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.remove('active');
    });
    searchSection.classList.add('active');
    
    // Simulate search results
    const resultsContainer = searchSection.querySelector('.search-results-container');
    
    // Show loading state
    resultsContainer.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Searching...</div>';
    
    // Simulate search delay
    setTimeout(() => {
        const results = [];
        
        // Search in vehicles
        const vehicles = [
            { type: 'vehicle', name: 'Honda City', number: 'MH-01-AB-1234' },
            { type: 'vehicle', name: 'Hyundai Creta', number: 'MH-02-CD-5678' }
        ];
        
        // Search in services
        const services = [
            { type: 'service', name: 'Oil Change', price: '₹1399' },
            { type: 'service', name: 'Brake Service', price: '₹2499' },
            { type: 'service', name: 'AC Service', price: '₹1699' },
            { type: 'service', name: 'Dent Removal', price: '₹2999' }
        ];
        
        // Search in providers
        const providers = [
            { type: 'provider', name: 'Auto Care Workshop', rating: '4.8', distance: '2.5 km' },
            { type: 'provider', name: 'Premium Auto Garage', rating: '4.5', distance: '3.2 km' },
            { type: 'provider', name: 'Quick Service Center', rating: '4.9', distance: '4.7 km' }
        ];
        
        // Filter results based on search term
        vehicles.forEach(item => {
            if (item.name.toLowerCase().includes(searchTerm) || item.number.toLowerCase().includes(searchTerm)) {
                results.push(item);
            }
        });
        
        services.forEach(item => {
            if (item.name.toLowerCase().includes(searchTerm)) {
                results.push(item);
            }
        });
        
        providers.forEach(item => {
            if (item.name.toLowerCase().includes(searchTerm)) {
                results.push(item);
            }
        });
        
        // Display results
        if (results.length > 0) {
            resultsContainer.innerHTML = `
                <p class="results-count">${results.length} results found for "${searchTerm}"</p>
                <div class="results-grid"></div>
            `;
            
            const resultsGrid = resultsContainer.querySelector('.results-grid');
            
            results.forEach(result => {
                let cardHTML = '';
                
                if (result.type === 'vehicle') {
                    cardHTML = `
                        <div class="result-card" data-type="vehicle">
                            <div class="result-icon"><i class="fas fa-car"></i></div>
                            <div class="result-info">
                                <h4>${result.name}</h4>
                                <p>${result.number}</p>
                            </div>
                            <button class="view-details-btn" onclick="navigateToSection('my-vehicles')">View Details</button>
                        </div>
                    `;
                } else if (result.type === 'service') {
                    cardHTML = `
                        <div class="result-card" data-type="service">
                            <div class="result-icon"><i class="fas fa-tools"></i></div>
                            <div class="result-info">
                                <h4>${result.name}</h4>
                                <p>From ${result.price}</p>
                            </div>
                            <button class="view-details-btn" onclick="navigateToSection('find-service')">Book Service</button>
                        </div>
                    `;
                } else if (result.type === 'provider') {
                    cardHTML = `
                        <div class="result-card" data-type="provider">
                            <div class="result-icon"><i class="fas fa-store"></i></div>
                            <div class="result-info">
                                <h4>${result.name}</h4>
                                <p>⭐ ${result.rating} • ${result.distance}</p>
                            </div>
                            <button class="view-details-btn" onclick="navigateToSection('find-service')">View Provider</button>
                        </div>
                    `;
                }
                
                resultsGrid.innerHTML += cardHTML;
            });
        } else {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>No results found for "${searchTerm}"</p>
                    <p>Try different keywords or browse services below</p>
                    <button class="browse-services-btn" onclick="navigateToSection('find-service')">Browse Services</button>
                </div>
            `;
        }
    }, 800);
}

// Setup notifications
function setupNotifications() {
    const notificationIcon = document.querySelector('.user-notifications');
    if (!notificationIcon) return;
    
    notificationIcon.addEventListener('click', () => {
        showNotificationsPanel();
    });
}

// Show notifications panel
function showNotificationsPanel() {
    // Create notifications panel if it doesn't exist
    let panel = document.getElementById('notifications-panel');
    if (!panel) {
        panel = document.createElement('div');
        panel.id = 'notifications-panel';
        panel.className = 'notifications-panel';
        panel.innerHTML = `
            <div class="panel-header">
                <h3>Notifications</h3>
                <span class="close-panel">&times;</span>
            </div>
            <div class="panel-body">
                <div class="notification-item unread">
                    <div class="notification-icon"><i class="fas fa-calendar-check"></i></div>
                    <div class="notification-content">
                        <p>Your Brake Service appointment is confirmed for May 15</p>
                        <span class="notification-time">2 hours ago</span>
                    </div>
                </div>
                <div class="notification-item">
                    <div class="notification-icon"><i class="fas fa-oil-can"></i></div>
                    <div class="notification-content">
                        <p>Oil Change service completed successfully</p>
                        <span class="notification-time">2 days ago</span>
                    </div>
                </div>
                <div class="notification-item">
                    <div class="notification-icon"><i class="fas fa-car"></i></div>
                    <div class="notification-content">
                        <p>New vehicle added to your account</p>
                        <span class="notification-time">5 days ago</span>
                    </div>
                </div>
            </div>
            <div class="panel-footer">
                <button class="mark-all-read">Mark all as read</button>
            </div>
        `;
        document.body.appendChild(panel);
        
        // Setup panel events
        const closeBtn = panel.querySelector('.close-panel');
        const markAllReadBtn = panel.querySelector('.mark-all-read');
        const notificationItems = panel.querySelectorAll('.notification-item');
        
        closeBtn.addEventListener('click', () => {
            panel.classList.remove('show');
        });
        
        markAllReadBtn.addEventListener('click', () => {
            notificationItems.forEach(item => {
                item.classList.remove('unread');
            });
            
            // Remove notification badge
            const badges = document.querySelectorAll('.notification-badge');
            badges.forEach(badge => {
                badge.style.display = 'none';
            });
        });
        
        notificationItems.forEach(item => {
            item.addEventListener('click', () => {
                item.classList.remove('unread');
                
                // Check if there are any unread notifications left
                const unreadCount = panel.querySelectorAll('.notification-item.unread').length;
                if (unreadCount === 0) {
                    // Remove notification badge
                    const badges = document.querySelectorAll('.notification-badge');
                    badges.forEach(badge => {
                        badge.style.display = 'none';
                    });
                }
            });
        });
        
        // Close panel when clicking outside
        document.addEventListener('click', (e) => {
            if (panel.classList.contains('show') && 
                !panel.contains(e.target) && 
                !notificationIcon.contains(e.target)) {
                panel.classList.remove('show');
            }
        });
    }
    
    // Toggle panel visibility
    panel.classList.toggle('show');
}

// Show notification toast
function showNotification(message, type = 'info') {
    // Create notification container if it doesn't exist
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        document.body.appendChild(container);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Set icon based on type
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    if (type === 'warning') icon = 'exclamation-triangle';
    
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
        <button class="close-notification"><i class="fas fa-times"></i></button>
    `;
    
    // Add to container
    container.appendChild(notification);
    
    // Show notification with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Setup close button
    const closeBtn = notification.querySelector('.close-notification');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto close after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Load dashboard data
function loadDashboardData() {
    // Load service history
    loadServiceHistory();
    
    // Load upcoming services
    loadUpcomingServices();
    
    // Load recent activity
    loadRecentActivity();
}

// Load service history
function loadServiceHistory() {
    const historyTableBody = document.querySelector('.history-table tbody');
    if (!historyTableBody) return;
    
    // Get service history from localStorage or use sample data
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const completedBookings = bookings.filter(booking => booking.status === 'completed');
    
    if (completedBookings.length > 0) {
        historyTableBody.innerHTML = completedBookings
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(booking => `
                <tr>
                    <td>${new Date(booking.date).toLocaleDateString()}</td>
                    <td>${booking.vehicleNumber}</td>
                    <td>${booking.service}</td>
                    <td>${booking.provider}</td>
                    <td><span class="status completed">Completed</span></td>
                    <td>₹${getServicePrice(booking.service)}</td>
                </tr>
            `).join('');
    } else {
        // Sample data if no history exists
        historyTableBody.innerHTML = `
            <tr>
                <td>May 2, 2023</td>
                <td>MH-01-AB-1234</td>
                <td>Oil Change</td>
                <td>Auto Care Workshop</td>
                <td><span class="status completed">Completed</span></td>
                <td>₹1399</td>
            </tr>
            <tr>
                <td>March 15, 2023</td>
                <td>MH-01-AB-1234</td>
                <td>Wheel Alignment</td>
                <td>Premium Auto Garage</td>
                <td><span class="status completed">Completed</span></td>
                <td>₹899</td>
            </tr>
        `;
    }
}

// Get service price based on service name
function getServicePrice(serviceName) {
    const prices = {
        'Oil Change': 1399,
        'Brake Service': 2499,
        'AC Service': 1699,
        'Dent Removal': 2999,
        'Wheel Alignment': 899,
        'Battery Replacement': 3499,
        'Car Wash': 499
    };
    
    return prices[serviceName] || 1000;
}

// Load upcoming services
function loadUpcomingServices() {
    const upcomingList = document.querySelector('.upcoming-services-list');
    if (!upcomingList) return;
    
    // Get upcoming services from localStorage or use sample data
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const upcomingBookings = bookings.filter(booking => booking.status === 'pending' || booking.status === 'accepted' || booking.status === 'in-progress');
    
    if (upcomingBookings.length > 0) {
        upcomingList.innerHTML = upcomingBookings
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map(booking => {
                const bookingDate = new Date(booking.date);
                const day = bookingDate.getDate();
                const month = bookingDate.toLocaleString('default', { month: 'short' });
                
                // Determine status badge class and text
                let statusClass = '';
                let statusText = '';
                
                switch(booking.status) {
                    case 'pending':
                        statusClass = 'pending';
                        statusText = 'Pending Confirmation';
                        break;
                    case 'accepted':
                        statusClass = 'accepted';
                        statusText = 'Confirmed';
                        break;
                    case 'in-progress':
                        statusClass = 'in-progress';
                        statusText = 'In Progress';
                        break;
                    default:
                        statusClass = 'pending';
                        statusText = 'Pending';
                }
                
                // Determine if buttons should be shown based on status
                const showButtons = booking.status === 'pending' || booking.status === 'accepted';
                const buttonsHtml = showButtons ? `
                    <button class="reschedule-btn" data-booking-id="${booking.id}">Reschedule</button>
                    <button class="cancel-btn" data-booking-id="${booking.id}">Cancel</button>
                ` : '';
                
                return `
                    <div class="upcoming-service-card" data-booking-id="${booking.id}">
                        <div class="service-date">
                            <span class="day">${day}</span>
                            <span class="month">${month}</span>
                        </div>
                        <div class="service-details">
                            <h4>${booking.service}</h4>
                            <p>Vehicle: ${booking.vehicleNumber} (${booking.vehicle})</p>
                            <p>Provider: ${booking.provider}</p>
                            <p>Time: ${bookingDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            <span class="booking-status ${statusClass}">${statusText}</span>
                        </div>
                        <div class="service-actions">
                            ${buttonsHtml}
                        </div>
                    </div>
                `;
            }).join('');
            
        // Setup action buttons
        setupUpcomingServiceActions();
    } else {
        // Show empty state
        upcomingList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-times"></i>
                <p>No upcoming services</p>
                <button class="book-service-btn" onclick="navigateToSection('find-service')">Book a Service</button>
            </div>
        `;
    }
}

// Load recent activity
function loadRecentActivity() {
    const activityContainer = document.querySelector('.recent-activity');
    if (!activityContainer) return;
    
    // Get all bookings from localStorage or use sample data
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    
    if (bookings.length > 0) {
        // Sort bookings by date, most recent first
        const sortedBookings = bookings.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Take the 3 most recent bookings
        const recentBookings = sortedBookings.slice(0, 3);
        
        // Create HTML for recent activity cards
        let activityHTML = '<h3>Recent Activity</h3>';
        
        recentBookings.forEach(booking => {
            const bookingDate = new Date(booking.date);
            const formattedDate = bookingDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
            
            let iconClass = 'fa-oil-can';
            if (booking.service.includes('Brake')) iconClass = 'fa-brake-system';
            else if (booking.service.includes('AC')) iconClass = 'fa-snowflake';
            else if (booking.service.includes('Dent')) iconClass = 'fa-car-crash';
            else if (booking.service.includes('Add')) iconClass = 'fa-car-alt';
            
            activityHTML += `
                <div class="activity-card">
                    <div class="activity-icon">
                        <i class="fas ${iconClass}"></i>
                    </div>
                    <div class="activity-details">
                        <h4>${booking.service}</h4>
                        <p>${booking.vehicleNumber} (${booking.vehicle.split(' ')[0]})</p>
                        <p>${formattedDate} - ${booking.provider}</p>
                        <span class="activity-status ${booking.status}">${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
                    </div>
                </div>
            `;
        });
        
        activityContainer.innerHTML = activityHTML;
    } else {
        // Use the existing sample data from HTML
        // No need to modify anything as the sample data is already in the HTML
    }
    
    // Setup activity cards click events
    setupActivityCards();
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Update fuel prices (simulated)
function updateFuelPrices() {
    const prices = {
        petrol: (Math.random() * (110 - 100) + 100).toFixed(2),
        diesel: (Math.random() * (95 - 85) + 85).toFixed(2),
        cng: (Math.random() * (90 - 80) + 80).toFixed(2)
    };

    // Update ticker content
    const tickerContent = document.querySelector('.ticker-content');
    if (tickerContent) {
        const items = tickerContent.querySelectorAll('.ticker-item');
        items[0].querySelector('.fuel-price').textContent = `₹${prices.petrol}/L`;
        items[1].querySelector('.fuel-price').textContent = `₹${prices.diesel}/L`;
        items[2].querySelector('.fuel-price').textContent = `₹${prices.cng}/kg`;
    }
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', initializeDashboard);

// Update fuel prices every hour
setInterval(updateFuelPrices, 3600000);
