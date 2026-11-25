
// ==========================================
// STUDENT CLUB ACTIVITY TRACKER
// HTML + CSS + JAVASCRIPT + LOCAL STORAGE
// ==========================================


// 1. DATABASE (LOCAL STORAGE)

function loadData(key, fallback) {
    try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : fallback;
    } catch (error) {
        return fallback;
    }
}

let clubs = loadData("clubs", [
    {
        id: 1,
        name: "Coding Club",
        category: "Technology",
        description: "A community for students interested in programming and technology.",
        members: 25
    },
    {
        id: 2,
        name: "Photography Club",
        category: "Arts",
        description: "Explore photography, creativity and visual storytelling.",
        members: 18
    },
    {
        id: 3,
        name: "Sports Club",
        category: "Sports",
        description: "Promoting sports, fitness and teamwork on campus.",
        members: 32
    }
]);

let members = loadData("members", [
    {
        id: 1,
        name: "Rahul Sharma",
        email: "rahul@gmail.com",
        club: "Coding Club",
        status: "Approved"
    },
    {
        id: 2,
        name: "Aman Verma",
        email: "aman@gmail.com",
        club: "Photography Club",
        status: "Pending"
    },
    {
        id: 3,
        name: "Priya Singh",
        email: "priya@gmail.com",
        club: "Sports Club",
        status: "Approved"
    }
]);

let events = loadData("events", [
    {
        id: 1,
        name: "Coding Competition",
        club: "Coding Club",
        date: "2026-12-10",
        location: "Computer Lab"
    },
    {
        id: 2,
        name: "Photography Workshop",
        club: "Photography Club",
        date: "2026-12-15",
        location: "Seminar Hall"
    }
]);

let attendance = loadData("attendance", []);

let announcements = loadData("announcements", [
    {
        id: 1,
        title: "Welcome to ClubTracker",
        message: "Welcome to our student club management platform!",
        date: new Date().toLocaleDateString()
    }
]);

let history = loadData("history", []);


// 2. SAVE DATA FUNCTION

function saveData() {

    localStorage.setItem("clubs", JSON.stringify(clubs));
    localStorage.setItem("members", JSON.stringify(members));
    localStorage.setItem("events", JSON.stringify(events));
    localStorage.setItem("attendance", JSON.stringify(attendance));
    localStorage.setItem("announcements", JSON.stringify(announcements));
    localStorage.setItem("history", JSON.stringify(history));

}


// 3. HELPER FUNCTIONS

const content = document.getElementById("content");
const modal = document.getElementById("modal");
const modalForm = document.getElementById("modal-form");

let currentPage = "dashboard";
let editingId = null;
let currentType = "";

function nextId(items) {
    return Math.max(0, ...items.map(item => Number(item.id) || 0)) + 1;
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function addHistory(message) {

    history.unshift({
        id: nextId(history),
        message: message,
        date: new Date().toLocaleString()
    });

    saveData();

}

function emptyMessage(message) {
    return `<div class="empty-state">${escapeHTML(message)}</div>`;
}

function formatDate(date) {
    if (!date) return "-";

    return new Date(date + "T00:00:00").toLocaleDateString();
}

function statusBadge(status) {

    let className = "status-pending";

    if (status === "Approved" || status === "Present") {
        className = "status-approved";
    }

    if (status === "Rejected" || status === "Absent") {
        className = "status-rejected";
    }

    return `<span class="status ${className}">${escapeHTML(status)}</span>`;

}


// 4. PAGE NAVIGATION

document.querySelectorAll(".nav-link").forEach(button => {

    button.addEventListener("click", function () {

        document.querySelectorAll(".nav-link").forEach(link => {
            link.classList.remove("active");
        });

        this.classList.add("active");

        currentPage = this.dataset.page;

        renderPage();

    });

});


function renderPage() {

    const titles = {
        dashboard: "Dashboard",
        clubs: "Clubs",
        members: "Membership",
        events: "Events & Activities",
        attendance: "Attendance",
        announcements: "Announcements",
        history: "Activity History",
        reports: "Reports & Analytics"
    };

    document.getElementById("page-title").textContent =
        titles[currentPage];

    const pages = {
        dashboard: renderDashboard,
        clubs: renderClubs,
        members: renderMembers,
        events: renderEvents,
        attendance: renderAttendance,
        announcements: renderAnnouncements,
        history: renderHistory,
        reports: renderReports
    };

    pages[currentPage]();

}


// 5. DASHBOARD

function renderDashboard() {

    const totalMembers = members.filter(
        member => member.status === "Approved"
    ).length;

    const pendingRequests = members.filter(
        member => member.status === "Pending"
    ).length;

    content.innerHTML = `

        <div class="page-heading">
            <div>
                <h3>Overview</h3>
                <p>Here is what's happening in your campus clubs.</p>
            </div>
            <button class="btn btn-primary" onclick="openModal('event')">
                <i class="fa-solid fa-plus"></i> Create Event
            </button>
        </div>

        <div class="stats-grid">

            <div class="stat-card">
                <div class="stat-top">
                    <p>Total Clubs</p>
                    <div class="stat-icon purple">
                        <i class="fa-solid fa-users"></i>
                    </div>
                </div>
                <h2>${clubs.length}</h2>
                <p>Registered campus clubs</p>
            </div>

            <div class="stat-card">
                <div class="stat-top">
                    <p>Total Members</p>
                    <div class="stat-icon blue">
                        <i class="fa-solid fa-user-group"></i>
                    </div>
                </div>
                <h2>${totalMembers}</h2>
                <p>Approved memberships</p>
            </div>

            <div class="stat-card">
                <div class="stat-top">
                    <p>Total Events</p>
                    <div class="stat-icon green">
                        <i class="fa-solid fa-calendar"></i>
                    </div>
                </div>
                <h2>${events.length}</h2>
                <p>Created club events</p>
            </div>

            <div class="stat-card">
                <div class="stat-top">
                    <p>Pending Requests</p>
                    <div class="stat-icon orange">
                        <i class="fa-solid fa-clock"></i>
                    </div>
                </div>
                <h2>${pendingRequests}</h2>
                <p>Awaiting approval</p>
            </div>

        </div>

        <div class="dashboard-grid">

            <div class="panel">
                <h3>Recent Events</h3>

                ${events.length ? `
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Event Name</th>
                                <th>Club</th>
                                <th>Date</th>
                            </tr>
                        </thead>

                        <tbody>
                            ${events.slice(0, 5).map(event => `
                                <tr>
                                    <td><strong>${escapeHTML(event.name)}</strong></td>
                                    <td>${escapeHTML(event.club)}</td>
                                    <td>${formatDate(event.date)}</td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                </div>
                ` : emptyMessage("No events created yet.")}

            </div>

            <div class="panel">
                <h3>Recent Activities</h3>

                ${history.length ? history.slice(0, 5).map(item => `
                    <div class="activity-item">
                        <strong>${escapeHTML(item.message)}</strong>
                        <p>${escapeHTML(item.date)}</p>
                    </div>
                `).join("") : emptyMessage("No recent activities.")}

            </div>

        </div>

        <div class="panel">
            <h3>Membership Requests</h3>

            ${members.filter(m => m.status === "Pending").length
                ? `
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Club</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${members.filter(m => m.status === "Pending").slice(0, 5).map(member => `
                                <tr>
                                    <td>${escapeHTML(member.name)}</td>
                                    <td>${escapeHTML(member.club)}</td>
                                    <td>${statusBadge(member.status)}</td>
                                    <td>
                                        <button class="btn btn-small btn-success"
                                        onclick="updateMember(${member.id}, 'Approved')">
                                            Approve
                                        </button>
                                    </td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                </div>
                ` : emptyMessage("No pending membership requests.")}
        </div>

    `;

}


// 6. CLUB MANAGEMENT

function renderClubs() {

    content.innerHTML = `

        <div class="page-heading">
            <div>
                <h3>Manage Clubs</h3>
                <p>Create and manage your campus clubs.</p>
            </div>

            <button class="btn btn-primary"
            onclick="openModal('club')">
                <i class="fa-solid fa-plus"></i> Add Club
            </button>
        </div>

        <div class="club-grid">

            ${clubs.length ? clubs.map(club => `

                <div class="club-card">

                    <div class="club-icon">
                        <i class="fa-solid fa-users"></i>
                    </div>

                    <h3>${escapeHTML(club.name)}</h3>

                    <p>${escapeHTML(club.description)}</p>

                    <span class="status status-approved">
                        ${escapeHTML(club.category)}
                    </span>

                    <div class="club-footer">

                        <strong>${members.filter(m =>
                            m.club === club.name && m.status === "Approved"
                        ).length} Members</strong>

                        <div>
                            <button class="btn btn-small btn-light"
                            onclick="editItem('club', ${club.id})">
                                <i class="fa-solid fa-pen"></i>
                            </button>

                            <button class="btn btn-small btn-danger"
                            onclick="deleteItem('club', ${club.id})">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>

                    </div>

                </div>

            `).join("") : emptyMessage("No clubs available. Add your first club.")}

        </div>

    `;

}


// 7. MEMBERSHIP MANAGEMENT

function renderMembers() {

    content.innerHTML = `

        <div class="page-heading">
            <div>
                <h3>Membership Management</h3>
                <p>Manage student membership applications.</p>
            </div>

            <button class="btn btn-primary"
            onclick="openModal('member')">
                <i class="fa-solid fa-plus"></i> Add Request
            </button>
        </div>

        <div class="panel">

            <div class="table-container">

                ${members.length ? `
                <table>
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Email</th>
                            <th>Club</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        ${members.map(member => `
                            <tr>
                                <td><strong>${escapeHTML(member.name)}</strong></td>
                                <td>${escapeHTML(member.email)}</td>
                                <td>${escapeHTML(member.club)}</td>
                                <td>${statusBadge(member.status)}</td>

                                <td>
                                    ${member.status === "Pending" ? `
                                        <button class="btn btn-small btn-success"
                                        onclick="updateMember(${member.id}, 'Approved')">
                                            Approve
                                        </button>

                                        <button class="btn btn-small btn-danger"
                                        onclick="updateMember(${member.id}, 'Rejected')">
                                            Reject
                                        </button>
                                    ` : `
                                        <button class="btn btn-small btn-danger"
                                        onclick="deleteItem('member', ${member.id})">
                                            Remove
                                        </button>
                                    `}
                                </td>
                            </tr>
                        `).join("")}

                    </tbody>
                </table>
                ` : emptyMessage("No membership requests available.")}

            </div>

        </div>

    `;

}


// APPROVE OR REJECT MEMBERSHIP

function updateMember(id, status) {

    const member = members.find(m => m.id === id);

    if (!member) return;

    member.status = status;

    addHistory(
        `${member.name}'s membership was ${status.toLowerCase()}.`
    );

    saveData();
    renderPage();

}


// 8. EVENT MANAGEMENT

function renderEvents() {

    content.innerHTML = `

        <div class="page-heading">
            <div>
                <h3>Events & Activities</h3>
                <p>Create and manage campus club events.</p>
            </div>

            <button class="btn btn-primary"
            onclick="openModal('event')">
                <i class="fa-solid fa-plus"></i> Create Event
            </button>
        </div>

        <div class="panel">

            <div class="table-container">

                ${events.length ? `
                <table>

                    <thead>
                        <tr>
                            <th>Event Name</th>
                            <th>Organizing Club</th>
                            <th>Date</th>
                            <th>Location</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        ${events.map(event => `
                            <tr>
                                <td><strong>${escapeHTML(event.name)}</strong></td>
                                <td>${escapeHTML(event.club)}</td>
                                <td>${formatDate(event.date)}</td>
                                <td>${escapeHTML(event.location)}</td>

                                <td>
                                    <button class="btn btn-small btn-light"
                                    onclick="editItem('event', ${event.id})">
                                        <i class="fa-solid fa-pen"></i>
                                    </button>

                                    <button class="btn btn-small btn-danger"
                                    onclick="deleteItem('event', ${event.id})">
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join("")}

                    </tbody>

                </table>
                ` : emptyMessage("No events created yet.")}

            </div>

        </div>

    `;

}


// 9. ATTENDANCE MANAGEMENT

function renderAttendance() {

    content.innerHTML = `

        <div class="page-heading">
            <div>
                <h3>Attendance Management</h3>
                <p>Record and manage event attendance.</p>
            </div>

            <button class="btn btn-primary"
            onclick="openModal('attendance')">
                <i class="fa-solid fa-plus"></i> Mark Attendance
            </button>
        </div>

        <div class="panel">

            <div class="table-container">

                ${attendance.length ? `
                <table>
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Event</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>

                        ${attendance.map(record => `
                            <tr>
                                <td><strong>${escapeHTML(record.name)}</strong></td>
                                <td>${escapeHTML(record.event)}</td>
                                <td>${formatDate(record.date)}</td>
                                <td>${statusBadge(record.status)}</td>

                                <td>
                                    <button class="btn btn-small btn-danger"
                                    onclick="deleteItem('attendance', ${record.id})">
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        `).join("")}

                    </tbody>
                </table>
                ` : emptyMessage("No attendance records available.")}

            </div>

        </div>

    `;

}


// 10. ANNOUNCEMENTS

function renderAnnouncements() {

    content.innerHTML = `

        <div class="page-heading">
            <div>
                <h3>Announcements</h3>
                <p>Share important updates with campus clubs.</p>
            </div>

            <button class="btn btn-primary"
            onclick="openModal('announcement')">
                <i class="fa-solid fa-plus"></i> New Announcement
            </button>
        </div>

        <div class="panel">

            ${announcements.length ? announcements.map(item => `

                <div class="activity-item">

                    <div style="display:flex;justify-content:space-between;gap:10px">

                        <div>
                            <strong>${escapeHTML(item.title)}</strong>
                            <p>${escapeHTML(item.message)}</p>
                            <p>${escapeHTML(item.date)}</p>
                        </div>

                        <button class="btn btn-small btn-danger"
                        onclick="deleteItem('announcement', ${item.id})">
                            <i class="fa-solid fa-trash"></i>
                        </button>

                    </div>

                </div>

            `).join("") : emptyMessage("No announcements published.")}

        </div>

    `;

}


// 11. ACTIVITY HISTORY

function renderHistory() {

    content.innerHTML = `

        <div class="page-heading">
            <div>
                <h3>Activity History</h3>
                <p>Track all recent administrative activities.</p>
            </div>

        </div>

        <div class="panel">

            ${history.length ? history.map(item => `

                <div class="activity-item">

                    <strong>
                        <i class="fa-solid fa-circle-check"
                        style="color:#7047d7;margin-right:8px"></i>

                        ${escapeHTML(item.message)}
                    </strong>

                    <p>${escapeHTML(item.date)}</p>

                </div>

            `).join("") : emptyMessage("No activity history available.")}

        </div>

    `;

}


// 12. REPORTS AND ANALYTICS

function renderReports() {

    const approved = members.filter(
        m => m.status === "Approved"
    ).length;

    const pending = members.filter(
        m => m.status === "Pending"
    ).length;

    const rejected = members.filter(
        m => m.status === "Rejected"
    ).length;

    const present = attendance.filter(
        a => a.status === "Present"
    ).length;

    const absent = attendance.filter(
        a => a.status === "Absent"
    ).length;

    const percentage = attendance.length
        ? Math.round((present / attendance.length) * 100)
        : 0;

    content.innerHTML = `

        <div class="page-heading">
            <div>
                <h3>Reports & Analytics</h3>
                <p>Overview of campus club performance.</p>
            </div>

            <button class="btn btn-primary"
            onclick="window.print()">
                <i class="fa-solid fa-download"></i> Print Report
            </button>
        </div>

        <div class="stats-grid">

            <div class="report-card">
                <p>Approved Members</p>
                <div class="report-number">${approved}</div>
            </div>

            <div class="report-card">
                <p>Pending Requests</p>
                <div class="report-number">${pending}</div>
            </div>

            <div class="report-card">
                <p>Rejected Requests</p>
                <div class="report-number">${rejected}</div>
            </div>

            <div class="report-card">
                <p>Attendance Rate</p>
                <div class="report-number">${percentage}%</div>
            </div>

        </div>

        <div class="panel">

            <h3>Club Membership Report</h3>

            ${clubs.length ? `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Club Name</th>
                            <th>Approved Members</th>
                            <th>Category</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${clubs.map(club => `
                            <tr>
                                <td><strong>${escapeHTML(club.name)}</strong></td>
                                <td>${members.filter(m =>
                                    m.club === club.name &&
                                    m.status === "Approved"
                                ).length}</td>
                                <td>${escapeHTML(club.category)}</td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
            ` : emptyMessage("No club data available.")}

        </div>

        <div class="panel">
            <h3>Attendance Summary</h3>
            <p>Present: <strong>${present}</strong></p>
            <p style="margin-top:10px">Absent: <strong>${absent}</strong></p>
            <p style="margin-top:10px">
                Total attendance records: <strong>${attendance.length}</strong>
            </p>
        </div>

    `;

}


// 13. MODAL FORM SYSTEM

function openModal(type, item = null) {

    currentType = type;
    editingId = item ? item.id : null;

    const fields = document.getElementById("modal-fields");

    const title = document.getElementById("modal-title");

    const isEdit = Boolean(item);

    const configs = {

        club: {
            title: "Club Details",
            fields: [
                ["name", "Club Name", "text", "Enter club name"],
                ["category", "Category", "select", ["Technology", "Arts", "Sports", "Cultural", "Literature", "Other"]],
                ["description", "Description", "textarea", "Enter club description"]
            ]
        },

        member: {
            title: "Membership Request",
            fields: [
                ["name", "Student Name", "text", "Enter student name"],
                ["email", "Email Address", "email", "Enter student email"],
                ["club", "Select Club", "select", clubs.map(c => c.name)]
            ]
        },

        event: {
            title: "Event Details",
            fields: [
                ["name", "Event Name", "text", "Enter event name"],
                ["club", "Organizing Club", "select", clubs.map(c => c.name)],
                ["date", "Event Date", "date", ""],
                ["location", "Event Location", "text", "Enter event location"]
            ]
        },

        attendance: {
            title: "Mark Attendance",
            fields: [
                ["name", "Student Name", "text", "Enter student name"],
                ["event", "Select Event", "select", events.map(e => e.name)],
                ["date", "Attendance Date", "date", ""],
                ["status", "Attendance Status", "select", ["Present", "Absent"]]
            ]
        },

        announcement: {
            title: "Publish Announcement",
            fields: [
                ["title", "Announcement Title", "text", "Enter title"],
                ["message", "Announcement Message", "textarea", "Enter your announcement"]
            ]
        }

    };

    const config = configs[type];

    if (!config) return;

    title.textContent = isEdit
        ? "Edit " + config.title
        : config.title;

    fields.innerHTML = config.fields.map(field => {

        const [name, label, type, options] = field;

        const value = item ? item[name] ?? "" : "";

        let input = "";

        if (type === "select") {

            input = `
                <select name="${name}" required>
                    <option value="">Select ${label}</option>

                    ${options.map(option => `
                        <option value="${escapeHTML(option)}"
                        ${option === value ? "selected" : ""}>
                            ${escapeHTML(option)}
                        </option>
                    `).join("")}

                </select>
            `;

        } else if (type === "textarea") {

            input = `
                <textarea name="${name}" required
                placeholder="${escapeHTML(options)}">${escapeHTML(value)}</textarea>
            `;

        } else {

            input = `
                <input
                    type="${type}"
                    name="${name}"
                    value="${escapeHTML(value)}"
                    placeholder="${escapeHTML(options)}"
                    ${type === "date" ? "" : ""}
                    required
                >
            `;

        }

        return `
            <div class="form-group">
                <label>${label}</label>
                ${input}
            </div>
        `;

    }).join("");

    modal.classList.add("show");

}


// OPEN EDIT FORM

function editItem(type, id) {

    const collections = {
        club: clubs,
        event: events
    };

    const item = collections[type]?.find(
        element => element.id === id
    );

    if (item) openModal(type, item);

}


// 14. SAVE FORM DATA

modalForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const formData = new FormData(modalForm);

    const data = Object.fromEntries(formData.entries());

    let collections = {
        club: clubs,
        member: members,
        event: events,
        attendance: attendance,
        announcement: announcements
    };

    const collection = collections[currentType];

    if (!collection) return;

    // EDIT EXISTING ITEM

    if (editingId !== null) {

        const index = collection.findIndex(
            item => item.id === editingId
        );

        if (index !== -1) {

            const oldName = collection[index].name;

            collection[index] = {
                ...collection[index],
                ...data
            };

            // Keep club references consistent when a club is renamed.
            if (currentType === "club" && oldName !== data.name) {

                members.forEach(member => {
                    if (member.club === oldName) {
                        member.club = data.name;
                    }
                });

                events.forEach(event => {
                    if (event.club === oldName) {
                        event.club = data.name;
                    }
                });

            }

            addHistory(
                `${currentType} "${data.name || data.title || ""}" was updated.`
            );

        }

    }

    // ADD NEW ITEM

    else {

        const newItem = {
            id: nextId(collection),
            ...data
        };

        if (currentType === "member") {
            newItem.status = "Pending";
        }

        if (currentType === "announcement") {
            newItem.date = new Date().toLocaleDateString();
        }

        collection.push(newItem);

        addHistory(
            `New ${currentType} "${data.name || data.title || ""}" was added.`
        );

    }

    saveData();

    closeModal();

    renderPage();

});


// 15. DELETE RECORDS

function deleteItem(type, id) {

    if (!confirm("Are you sure you want to delete this record?")) {
        return;
    }

    const collections = {
        club: clubs,
        member: members,
        event: events,
        attendance: attendance,
        announcement: announcements
    };

    const collection = collections[type];

    if (!collection) return;

    const index = collection.findIndex(
        item => item.id === id
    );

    if (index === -1) return;

    const deleted = collection[index];

    collection.splice(index, 1);

    addHistory(
        `${type} "${deleted.name || deleted.title || ""}" was deleted.`
    );

    saveData();

    renderPage();

}


// 16. CLOSE MODAL

function closeModal() {

    modal.classList.remove("show");

    modalForm.reset();

    editingId = null;

}

document.getElementById("close-modal").addEventListener(
    "click", closeModal
);

document.getElementById("cancel-modal").addEventListener(
    "click", closeModal
);

modal.addEventListener("click", function(event) {

    if (event.target === modal) {
        closeModal();
    }

});


// 17. START APPLICATION

saveData();

renderPage();
