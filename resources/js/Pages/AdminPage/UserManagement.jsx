import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AddUser from "@/AddForm/AddUser";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";

const UserManagement = () => {
    const [allUser, setAllUser] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(route("ourusers.index"));
                setAllUser(response.data.data); // controller returns {success, data}
            } catch (error) {
                console.error("fetching error ", error);
            }
        };

        fetchUser();
    }, [reloadTrigger]);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this user?")) return;
        try {
            await axios.delete(route("ourusers.destroy", { id }));
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setShowForm(true);
    };

    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("ourusers.update", { id }),
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.log("Error updating user", error);
            throw error;
        }
    };

    return (
        <>
            <AdminWrapper>
                <div className="mb-8 flex justify-between items-center  mt-8">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                            User Management
                        </h1>
                    </div>
                    <button
                        onClick={() => {
                            setEditingUser(null);
                            setShowForm(true);
                        }}
                        className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                    >
                        <Plus size={18} />
                        <span>Create</span>
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="text-left border-b">
                                <th className="p-3">Name</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Role</th>
                                <th className="p-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allUser.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-4 text-center text-gray-500">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                            {allUser.map((user) => (
                                <tr key={user.id} className="border-b">
                                    <td className="p-3">{user.name}</td>
                                    <td className="p-3">{user.email}</td>
                                    <td className="p-3 capitalize">{user.role}</td>
                                    <td className="p-3 text-right space-x-2">
                                        <button
                                            onClick={() => handleEdit(user)}
                                            className="p-2 hover:bg-gray-100 rounded-full"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="p-2 hover:bg-gray-100 rounded-full text-red-500"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <AddUser
                    showForm={showForm}
                    setShowForm={setShowForm}
                    setReloadTrigger={setReloadTrigger}
                    editingUser={editingUser}
                    setEditingUser={setEditingUser}
                    handleUpdate={handleUpdate}
                />
            </AdminWrapper>
        </>
    );
};

export default UserManagement;