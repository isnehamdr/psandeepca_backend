import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AddService from "@/AddForm/AddService";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";

const AdminService = () => {
    const [allService, setAllService] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [pageError, setPageError] = useState(null);

    useEffect(() => {
        const fetchService = async () => {
            try {
                const response = await axios.get(route("ourservices.index"));
                setAllService(response.data.data);
                setPageError(null);
            } catch (error) {
                console.error("fetching error ", error);
                setPageError("Could not load services. Please refresh the page.");
            }
        };

        fetchService();
    }, [reloadTrigger]);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this service?")) return;
        try {
            await axios.delete(route("ourservices.destroy", { id }));
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.error(error);
            setPageError("Could not delete this service. Please try again.");
        }
    };

    const handleEdit = (service) => {
        setEditingService(service);
        setShowForm(true);
    };

    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("ourservices.update", { id }),
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.error("Error updating service", error);
            throw error;
        }
    };

    return (
        <>
            <AdminWrapper>
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                            Service Management
                        </h1>
                    </div>
                    <button
                        onClick={() => {
                            setEditingService(null);
                            setShowForm(true);
                        }}
                        className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                    >
                        <Plus size={18} />
                        <span>Create</span>
                    </button>
                </div>

                {pageError && (
                    <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
                        {pageError}
                    </div>
                )}

                <div className="bg-white rounded-xl shadow overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="text-left border-b">
                                <th className="p-3">Icon</th>
                                <th className="p-3">Title</th>
                                <th className="p-3">Sort Order</th>
                                <th className="p-3">Active</th>
                                <th className="p-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allService.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center text-gray-500">
                                        No services found.
                                    </td>
                                </tr>
                            )}
                            {allService.map((service) => (
                                <tr key={service.id} className="border-b">
                                    <td className="p-3">
                                        {service.icon && (
                                            <img
                                                src={`/storage/${service.icon}`}
                                                alt={service.title}
                                                className="h-10 w-10 object-cover rounded"
                                            />
                                        )}
                                    </td>
                                    <td className="p-3">{service.title}</td>
                                    <td className="p-3">{service.sort_order}</td>
                                    <td className="p-3">
                                        {service.is_active ? (
                                            <span className="text-green-600">Active</span>
                                        ) : (
                                            <span className="text-gray-400">Inactive</span>
                                        )}
                                    </td>
                                    <td className="p-3 text-right space-x-2">
                                        <button
                                            onClick={() => handleEdit(service)}
                                            className="p-2 hover:bg-gray-100 rounded-full"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(service.id)}
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

                <AddService
                    showForm={showForm}
                    setShowForm={setShowForm}
                    setReloadTrigger={setReloadTrigger}
                    editingService={editingService}
                    setEditingService={setEditingService}
                    handleUpdate={handleUpdate}
                />
            </AdminWrapper>
        </>
    );
};

export default AdminService;