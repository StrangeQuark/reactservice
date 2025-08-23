import { useEffect, useState } from "react"
import "./css/UserManagementPopup.css"
import { useAuth } from "../../context/AuthContext"
import { FaTrash, FaUserCog, FaTimes } from "react-icons/fa"
import { AUTH_ENDPOINTS } from "../../config"

const UserManagementPopup = ({ onClose, loadUsers, deleteUser, updateUserRole }) => {
    const { getAccessToken } = useAuth()

    const [users, setUsers] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [editingUser, setEditingUser] = useState(null)
    const [newRole, setNewRole] = useState("")

    // Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const usersPerPage = 10

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        const data = await loadUsers()
        const request = []

        for(let i = 0; i < data.length; i++) {
            request.push(data[i].userId)
        }

        const response = await fetch(`${AUTH_ENDPOINTS.GET_USER_DETAILS_BY_IDS}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + getAccessToken() 
            },
            body: JSON.stringify(request)
        })

        const userData = await response.json()

        // Merge the data and userData objects into one
        const merged = data.map((d, i) => ({
            ...d,
            ...userData[i]
        }))

        setUsers(merged)
    }

    const handleSearch = async () => {
        if (!searchTerm.trim()) return

        const response = await fetch(`${AUTH_ENDPOINTS.SEARCH_USERS}?query=${encodeURIComponent(searchTerm)}`, {
            headers: { Authorization: "Bearer " + getAccessToken() }
        })
        if (!response.ok) return

        const results = await response.json()
        setSearchResults(results.slice(0, 5)) // keep top 5
    }

    const handleAddUser = async (user) => {
        const response = await fetch(`/auth/addUser`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                Authorization: "Bearer " + getAccessToken() 
            },
            body: JSON.stringify({ username: user.username })
        })

        if (!response.ok) {
            const msg = await response.json()
            alert(msg.errorMessage)
            return
        }

        setSearchResults([])
        setSearchTerm("")
        fetchUsers()
    }

    const handleDeleteUser = async (user) => {
        if (!confirm(`Remove user ${user.username}?`)) 
            return

        await deleteUser(user, getAccessToken())
        fetchUsers()
    }

    const startEditRole = (user) => {
        setEditingUser(user.username)
        setNewRole(user.role)
    }

    const handleSaveRole = async () => {
        const user = users.find(u => u.username === editingUser)
        if (!user) return

        await updateUserRole(user, newRole, getAccessToken())
        setEditingUser(null)
        setNewRole("")
        fetchUsers()
    }

    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage
    const indexOfFirstUser = indexOfLastUser - usersPerPage
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser)
    const totalPages = Math.ceil(users.length / usersPerPage)

    return (
        <div className="user-manager-overlay">
            <div className="user-manager-popup">
                <div className="popup-header">
                    <h2>Manage Users</h2>
                    <FaTimes className="close-icon" onClick={onClose} />
                </div>

                {/* Search section */}
                <div className="user-controls">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button onClick={handleSearch}>Search</button>

                    {searchResults.length > 0 && (
                        <div className="search-dropdown">
                            {searchResults.map((user, idx) => (
                                <div 
                                    key={idx} 
                                    className="search-result" 
                                    onClick={() => handleAddUser(user)}
                                >
                                    {user.username} ({user.email})
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Table */}
                <div className="user-table">
                    <div className="user-header">
                        <span>Username</span>
                        <span>Email</span>
                        <span>Role</span>
                        <span>Actions</span>
                    </div>
                    {currentUsers.map((user, idx) => (
                        <div key={idx} className="user-row">
                            <span>{user.username}</span>
                            <span>{user.email}</span>
                            <span>
                                {editingUser === user.username ? (
                                    <select
                                        value={newRole}
                                        onChange={(e) => setNewRole(e.target.value)}
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="editor">Editor</option>
                                        <option value="viewer">Viewer</option>
                                        {/* roles can be extended */}
                                    </select>
                                ) : (
                                    user.role
                                )}
                            </span>
                            <span className="actions">
                                {editingUser === user.username ? (
                                    <>
                                        <button onClick={handleSaveRole}>Save</button>
                                        <button onClick={() => setEditingUser(null)}>Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        <FaUserCog
                                            className="row-icon"
                                            onClick={() => startEditRole(user)}
                                        />
                                        <FaTrash
                                            className="row-icon"
                                            onClick={() => handleDeleteUser(user)}
                                        />
                                    </>
                                )}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="pagination">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                    >←</button>
                    {[...Array(totalPages)].map((_, idx) => (
                        <button
                            key={idx}
                            className={currentPage === idx + 1 ? "active" : ""}
                            onClick={() => setCurrentPage(idx + 1)}
                        >
                            {idx + 1}
                        </button>
                    ))}
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                    >→</button>
                </div>
            </div>
        </div>
    )
}

export default UserManagementPopup
