import AddBlog from '@/AddForm/AddBlog';
import AdminWrapper from '@/AdminWrapper/AdminWrapper';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const AdminBlog = () => {
	const [allBlog, setAllBlog] = useState([]);
	const [reloadTrigger, setReloadTrigger] = useState(false);
	const [editingBlog, setEditingBlog] = useState(null);
	const [showForm, setShowForm] = useState(false);

	// For fetching the blog data
	useEffect(() => {
		const fetchBlogs = async () => {
			try {
				const response = await axios.get(route("ourblogs.index"));
				setAllBlog(response.data.data); // controller returns { success, data }
			} catch (error) {
				console.error("fetching error ", error);
			}
		};

		fetchBlogs();
	}, [reloadTrigger]);

	// For delete the blog
	const handleDelete = async (id) => {
		if (!window.confirm("Are you sure you want to delete this blog?")) return;
		try {
			const response = await axios.delete(route("ourblogs.destroy", { blog: id }));
			console.log(response.data);
			setReloadTrigger((prev) => !prev);
		} catch (error) {
			console.log(error);
		}
	};

	// handle edit
	const handleEdit = (blog) => {
		setEditingBlog(blog);
		setShowForm(true);
	};

	// Handle update after edit
	const handleUpdate = async (formData, id) => {
		try {
			formData.append("_method", "PUT");
			const response = await axios.post(route("ourblogs.update", { blog: id }), formData, {
				headers: {
					"Content-Type": "multipart/form-data"
				}
			});
			setReloadTrigger((prev) => !prev);
			return response.data;
		} catch (error) {
			console.log("Error updating Blog", error);
			throw error;
		}
	};

	return (
		<>
			<AdminWrapper>
				<div className="mb-8 flex justify-between items-center">
					<div>
						<h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
							Blog Management
						</h1>
					</div>
					<button
						onClick={() => {
							setEditingBlog(null);
							setShowForm(true);
						}}
						className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
					>
						<Plus size={18} />
						<span>Create</span>
					</button>
				</div>

				{/* Blog list */}
				<div className="bg-white rounded-xl shadow overflow-x-auto">
					<table className="min-w-full text-left text-sm">
						<thead className="bg-gray-50 text-gray-600 uppercase text-xs">
							<tr>
								<th className="px-4 py-3">Image</th>
								<th className="px-4 py-3">Title</th>
								<th className="px-4 py-3">Status</th>
								<th className="px-4 py-3 text-right">Actions</th>
							</tr>
						</thead>
						<tbody>
							{allBlog.length === 0 ? (
								<tr>
									<td colSpan={4} className="px-4 py-6 text-center text-gray-500">
										No blogs found.
									</td>
								</tr>
							) : (
								allBlog.map((blog) => (
									<tr key={blog.id} className="border-t">
										<td className="px-4 py-3">
											{blog.image ? (
												<img
													src={`/storage/${blog.image}`}
													alt={blog.title}
													className="w-12 h-12 object-cover rounded"
												/>
											) : (
												<span className="text-gray-400 text-xs">No image</span>
											)}
										</td>
										<td className="px-4 py-3 font-medium text-gray-800">{blog.title}</td>
										<td className="px-4 py-3 capitalize">{blog.status}</td>
										<td className="px-4 py-3 text-right space-x-2">
											<button
												onClick={() => handleEdit(blog)}
												className="p-2 hover:bg-gray-100 rounded-full transition-colors"
											>
												<Pencil size={16} />
											</button>
											<button
												onClick={() => handleDelete(blog.id)}
												className="p-2 hover:bg-red-100 text-red-600 rounded-full transition-colors"
											>
												<Trash2 size={16} />
											</button>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>

				<AddBlog
					showForm={showForm}
					setShowForm={setShowForm}
					setReloadTrigger={setReloadTrigger}
					editingBlog={editingBlog}
					setEditingBlog={setEditingBlog}
					handleUpdate={handleUpdate}
				/>
			</AdminWrapper>
		</>
	)
}

export default AdminBlog