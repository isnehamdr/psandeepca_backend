// import { X } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const AddUser = ({
//     showForm,
//     editingUser,
//     setShowForm,
//     setEditingUser,
//     setReloadTrigger,
//     handleUpdate,
// }) => {
//     const [submitting, setSubmitting] = useState(false);

//     const initialFormState = {
//         name: "",
//         email: "",
//         password: "",
//         role: "",
//     };

//     const [userForm, setUserForm] = useState(initialFormState);

//     // Use Effect
//     useEffect(() => {
//         if (editingUser) {
//             setUserForm({
//                 name: editingUser.name || "",
//                 email: editingUser.email || "",
//                 password: "", // never prefill password
//                 role: editingUser.role || "",
//             });
//         } else {
//             setUserForm(initialFormState);
//         }
//     }, [editingUser]);

//     // Handle Create User
//     const handleCreate = async (formData) => {
//         try {
//             await axios.post(route("ourusers.store"), formData, {
//                 headers: { "Content-Type": "multipart/form-data" },
//             });
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log("Error creating user", error);
//             throw error;
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();

//         for (const key in userForm) {
//             // skip empty password on update so it doesn't get overwritten
//             if (userForm[key] !== null && userForm[key] !== "") {
//                 formData.append(key, userForm[key]);
//             }
//         }

//         try {
//             setSubmitting(true);

//             if (editingUser) {
//                 await handleUpdate(formData, editingUser.id);
//             } else {
//                 await handleCreate(formData);
//             }

//             setUserForm(initialFormState);
//             setShowForm(false);
//             setEditingUser(null);
//         } catch (error) {
//             console.log("Error saving data", error);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setUserForm((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleClose = () => {
//         setShowForm(false);
//         setEditingUser(null);
//         setUserForm(initialFormState);
//     };

//     if (!showForm) return null;

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-2xl font-bold text-gray-800">
//                         {editingUser ? "Edit User" : "Add New User"}
//                     </h2>
//                     <button
//                         onClick={handleClose}
//                         className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                         type="button"
//                     >
//                         <X size={24} />
//                     </button>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Name *
//                         </label>
//                         <input
//                             type="text"
//                             name="name"
//                             value={userForm.name}
//                             onChange={handleChange}
//                             required
//                             className="w-full border rounded-lg px-3 py-2"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Email *
//                         </label>
//                         <input
//                             type="email"
//                             name="email"
//                             value={userForm.email}
//                             onChange={handleChange}
//                             required
//                             className="w-full border rounded-lg px-3 py-2"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Password {editingUser ? "(leave blank to keep current)" : "*"}
//                         </label>
//                         <input
//                             type="password"
//                             name="password"
//                             value={userForm.password}
//                             onChange={handleChange}
//                             required={!editingUser}
//                             minLength={8}
//                             className="w-full border rounded-lg px-3 py-2"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Role *
//                         </label>
//                         <select
//                             name="role"
//                             value={userForm.role}
//                             onChange={handleChange}
//                             required
//                             className="w-full border rounded-lg px-3 py-2"
//                         >
//                             <option value="">Select role</option>
//                             <option value="admin">Admin</option>
//                             <option value="editor">Editor</option>
//                             <option value="user">User</option>
//                         </select>
//                     </div>

//                     <div className="flex justify-end gap-3 pt-2">
//                         <button
//                             type="button"
//                             onClick={handleClose}
//                             className="px-4 py-2 rounded-full border text-gray-700 hover:bg-gray-100"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             disabled={submitting}
//                             className="px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
//                         >
//                             {submitting ? "Saving..." : editingUser ? "Update" : "Create"}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default AddUser;


import { X, Eye, EyeOff } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";

const AddUser = ({
    showForm,
    editingUser,
    setShowForm,
    setEditingUser,
    setReloadTrigger,
    handleUpdate,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const initialFormState = {
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "",
    };

    const [userForm, setUserForm] = useState(initialFormState);

    useEffect(() => {
        if (editingUser) {
            setUserForm({
                name: editingUser.name || "",
                email: editingUser.email || "",
                password: "", // never prefill password
                password_confirmation: "",
                role: editingUser.role || "",
            });
        } else {
            setUserForm(initialFormState);
        }
        setShowPassword(false);
        setShowConfirmPassword(false);
        setErrorMsg("");
    }, [editingUser]);

    const handleCreate = async (formData) => {
        try {
            await axios.post(route("ourusers.store"), formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log("Error creating user", error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        // client-side match check before hitting the API
        if (userForm.password || userForm.password_confirmation) {
            if (userForm.password !== userForm.password_confirmation) {
                setErrorMsg("Password and confirm password do not match.");
                return;
            }
        }

        if (!editingUser && !userForm.password) {
            setErrorMsg("Password is required.");
            return;
        }

        const formData = new FormData();

        for (const key in userForm) {
            // skip empty password/confirmation on update so it doesn't get overwritten
            if (userForm[key] !== null && userForm[key] !== "") {
                formData.append(key, userForm[key]);
            }
        }

        try {
            setSubmitting(true);

            if (editingUser) {
                await handleUpdate(formData, editingUser.id);
            } else {
                await handleCreate(formData);
            }

            setUserForm(initialFormState);
            setShowForm(false);
            setEditingUser(null);
        } catch (error) {
            console.log("Error saving data", error);
            setErrorMsg(
                error?.response?.data?.message ||
                    "Something went wrong while saving the user."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleClose = () => {
        setShowForm(false);
        setEditingUser(null);
        setUserForm(initialFormState);
        setErrorMsg("");
    };

    if (!showForm) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {editingUser ? "Edit User" : "Add New User"}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        type="button"
                    >
                        <X size={24} />
                    </button>
                </div>

                {errorMsg && (
                    <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={userForm.name}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-lg px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email *
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={userForm.email}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-lg px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password {editingUser ? "(leave blank to keep current)" : "*"}
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={userForm.password}
                                onChange={handleChange}
                                required={!editingUser}
                                minLength={8}
                                className="w-full border rounded-lg px-3 py-2 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                tabIndex={-1}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password{" "}
                            {editingUser ? "(only if changing password)" : "*"}
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="password_confirmation"
                                value={userForm.password_confirmation}
                                onChange={handleChange}
                                required={!editingUser || !!userForm.password}
                                minLength={8}
                                className="w-full border rounded-lg px-3 py-2 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword((prev) => !prev)
                                }
                                tabIndex={-1}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Role *
                        </label>
                        <select
                            name="role"
                            value={userForm.role}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-lg px-3 py-2"
                        >
                            <option value="">Select role</option>
                            <option value="admin">Admin</option>
                            <option value="editor">Editor</option>
                            <option value="user">User</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 rounded-full border text-gray-700 hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {submitting ? "Saving..." : editingUser ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUser;