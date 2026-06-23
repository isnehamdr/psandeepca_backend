import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Plus, Pencil, Trash2, Eye, X, AlertTriangle, Calendar } from 'lucide-react';
import { useTable, usePagination, useSortBy, useGlobalFilter } from 'react-table';
import AdminWrapper from '@/AdminWrapper/AdminWrapper';
import AddBlog from '@/AddForm/AddBlog';
import EditBlog from '@/EditForm/EditBlog';

const AdminBlog = () => {
	const [allBlog, setAllBlog] = useState([]);
	const [reloadTrigger, setReloadTrigger] = useState(false);
	const [editingBlog, setEditingBlog] = useState(null);
	const [viewingBlog, setViewingBlog] = useState(null);
	const [showAddForm, setShowAddForm] = useState(false);
	const [showEditForm, setShowEditForm] = useState(false);
	const [showViewModal, setShowViewModal] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [blogToDelete, setBlogToDelete] = useState(null);

	// For fetching the blog data
	useEffect(() => {
		const fetchBlogs = async () => {
			try {
				const response = await axios.get(route("ourblogs.index"));
				setAllBlog(response.data.data);
			} catch (error) {
				console.error("fetching error ", error);
			}
		};

		fetchBlogs();
	}, [reloadTrigger]);

	// For delete the blog
	const handleDelete = async () => {
		if (!blogToDelete) return;
		try {
			await axios.delete(route("ourblogs.destroy", { blog: blogToDelete }));
			setReloadTrigger((prev) => !prev);
			setShowDeleteDialog(false);
			setBlogToDelete(null);
		} catch (error) {
			console.log(error);
		}
	};

	// handle edit
	const handleEdit = (blog) => {
		setEditingBlog(blog);
		setShowEditForm(true);
	};

	// handle view
	const handleView = (blog) => {
		setViewingBlog(blog);
		setShowViewModal(true);
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

	// Open delete confirmation
	const confirmDelete = (id) => {
		setBlogToDelete(id);
		setShowDeleteDialog(true);
	};

	// Format date helper
	const formatDate = (date) => {
		if (!date) return 'N/A';
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};

	// Get status badge color
	const getStatusBadgeColor = (status) => {
		switch (status) {
			case 'published':
				return 'bg-green-100 text-green-800';
			case 'draft':
				return 'bg-yellow-100 text-yellow-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	// Define columns for React Table
	const columns = useMemo(
		() => [
			{
				Header: 'Image',
				accessor: 'image',
				Cell: ({ value }) => (
					value ? (
						<img
							src={`/storage/${value}`}
							alt="Blog"
							className="w-12 h-12 object-cover rounded"
						/>
					) : (
						<span className="text-gray-400 text-xs">No image</span>
					)
				),
			},
			{
				Header: 'Title',
				accessor: 'title',
				Cell: ({ value }) => (
					<span className="font-medium text-gray-800">{value}</span>
				),
			},
			{
				Header: 'Status',
				accessor: 'status',
				Cell: ({ value }) => (
					<span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadgeColor(value)}`}>
						{value}
					</span>
				),
			},
			{
            Header: "Created At",
            accessor: "created_at",
            Cell: ({ value }) => (
                <span className="text-gray-400">
                    {new Date(value).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    })}
                </span>
            ),
        },
        {
            Header: "Created Time",
            accessor: "created_at_time",
            Cell: ({ row }) => (
                <span className="text-gray-400">
                    {new Date(row.original.created_at).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                    })}
                </span>
            ),
        },
			{
				Header: 'Actions',
				accessor: 'id',
				Cell: ({ row }) => (
					<div className="flex justify-start space-x-2">
						<button
							onClick={() => handleView(row.original)}
							className="p-2 hover:bg-blue-100 text-blue-600 rounded-full transition-colors"
							title="View"
						>
							<Eye size={16} />
						</button>
						<button
							onClick={() => handleEdit(row.original)}
							className="p-2 hover:bg-gray-100 rounded-full transition-colors"
							title="Edit"
						>
							<Pencil size={16} />
						</button>
						<button
							onClick={() => confirmDelete(row.original.id)}
							className="p-2 hover:bg-red-100 text-red-600 rounded-full transition-colors"
							title="Delete"
						>
							<Trash2 size={16} />
						</button>
					</div>
				),
			},
		],
		[]
	);

	// Table data
	const data = useMemo(() => allBlog, [allBlog]);

	// Table instance
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		page,
		prepareRow,
		canPreviousPage,
		canNextPage,
		pageOptions,
		pageCount,
		gotoPage,
		nextPage,
		previousPage,
		setPageSize,
		state: { pageIndex, pageSize, globalFilter },
		setGlobalFilter,
	} = useTable(
		{
			columns,
			data,
			initialState: { pageIndex: 0, pageSize: 10 },
		},
		useGlobalFilter,
		useSortBy,
		usePagination
	);

	// Search input handler
	const handleSearch = (e) => {
		setGlobalFilter(e.target.value || undefined);
	};

	return (
		<>
			<AdminWrapper>
				<div className="mb-8 flex flex-wrap gap-4 justify-between items-center mt-8">
					<div>
						<h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
							Blog Management
						</h1>
						<p className="text-sm text-gray-500 mt-1">
							Total Blogs: {allBlog.length}
						</p>
					</div>
					<div className="flex flex-wrap gap-3">
						<div className="relative">
							<input
								type="text"
								placeholder="Search blogs..."
								value={globalFilter || ''}
								onChange={handleSearch}
								className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
							/>
							<svg
								className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
						</div>
						<button
							onClick={() => {
								setEditingBlog(null);
								setShowAddForm(true);
							}}
							className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
						>
							<Plus size={18} />
							<span>Create</span>
						</button>
					</div>
				</div>

				{/* Blog table */}
				<div className="bg-white rounded-xl shadow overflow-hidden">
					<div className="overflow-x-auto">
						<table {...getTableProps()} className="min-w-full text-left text-sm">
							<thead className="bg-gray-50 text-gray-600 uppercase text-xs">
								{headerGroups.map((headerGroup) => (
									<tr {...headerGroup.getHeaderGroupProps()}>
										{headerGroup.headers.map((column) => (
											<th
												{...column.getHeaderProps(column.getSortByToggleProps())}
												className="px-4 py-3 font-medium cursor-pointer hover:bg-gray-100"
											>
												<div className="flex items-center gap-1">
													{column.render('Header')}
													{column.isSorted ? (
														column.isSortedDesc ? (
															<span className="text-xs">↓</span>
														) : (
															<span className="text-xs">↑</span>
														)
													) : (
														<span className="text-xs text-gray-300">↕</span>
													)}
												</div>
											</th>
										))}
									</tr>
								))}
							</thead>
							<tbody {...getTableBodyProps()} className="divide-y divide-gray-200">
								{page.length === 0 ? (
									<tr>
										<td colSpan={columns.length} className="px-4 py-6 text-center text-gray-500">
											No blogs found.
										</td>
									</tr>
								) : (
									page.map((row) => {
										prepareRow(row);
										return (
											<tr {...row.getRowProps()} className="hover:bg-gray-50 transition-colors">
												{row.cells.map((cell) => (
													<td {...cell.getCellProps()} className="px-4 py-3">
														{cell.render('Cell')}
													</td>
												))}
											</tr>
										);
									})
								)}
							</tbody>
						</table>
					</div>

					{/* Pagination */}
					{allBlog.length > 0 && (
						<div className="px-4 py-3 border-t border-gray-200 flex flex-wrap gap-4 items-center justify-between">
							<div className="flex items-center gap-3">
								<span className="text-sm text-gray-700">
									Page <span className="font-medium">{pageIndex + 1}</span> of{' '}
									<span className="font-medium">{pageOptions.length}</span>
								</span>
								<select
									value={pageSize}
									onChange={(e) => {
										setPageSize(Number(e.target.value));
									}}
									className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
								>
									{[5, 10, 20, 30, 50].map((size) => (
										<option key={size} value={size}>
											Show {size}
										</option>
									))}
								</select>
							</div>
							<div className="flex gap-2">
								<button
									onClick={() => gotoPage(0)}
									disabled={!canPreviousPage}
									className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									First
								</button>
								<button
									onClick={() => previousPage()}
									disabled={!canPreviousPage}
									className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									Previous
								</button>
								<button
									onClick={() => nextPage()}
									disabled={!canNextPage}
									className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									Next
								</button>
								<button
									onClick={() => gotoPage(pageCount - 1)}
									disabled={!canNextPage}
									className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									Last
								</button>
							</div>
						</div>
					)}
				</div>

				{/* Add Blog Form */}
				<AddBlog
					showForm={showAddForm}
					setShowForm={setShowAddForm}
					setReloadTrigger={setReloadTrigger}
				/>

				{/* Edit Blog Form */}
				<EditBlog
					showForm={showEditForm}
					setShowForm={setShowEditForm}
					setReloadTrigger={setReloadTrigger}
					editingBlog={editingBlog}
					setEditingBlog={setEditingBlog}
					handleUpdate={handleUpdate}
				/>

				{/* View Blog Modal - Inline */}
				{showViewModal && viewingBlog && (
					<div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
						<div className="bg-white rounded-xl max-w-4xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
							<div className="flex justify-between items-center mb-6">
								<h2 className="text-2xl font-bold text-gray-800">
									Blog Details
								</h2>
								<button
									onClick={() => setShowViewModal(false)}
									className="p-2 hover:bg-gray-100 rounded-full transition-colors"
								>
									<X size={24} />
								</button>
							</div>

							<div className="space-y-6">
								{/* Featured Image */}
								{viewingBlog.image && (
									<div className="rounded-lg overflow-hidden">
										<img
											src={`/storage/${viewingBlog.image}`}
											alt={viewingBlog.title}
											className="w-full h-64 object-cover"
										/>
									</div>
								)}

								{/* Title */}
								<div>
									<h3 className="text-3xl font-bold text-gray-900">{viewingBlog.title}</h3>
								</div>

								{/* Meta Information */}
								<div className="flex flex-wrap gap-4 text-sm text-gray-600">
									{viewingBlog.status && (
										<span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(viewingBlog.status)}`}>
											{viewingBlog.status.charAt(0).toUpperCase() + viewingBlog.status.slice(1)}
										</span>
									)}
									{viewingBlog.created_at && (
										<span className="flex items-center gap-1">
											<Calendar size={16} />
											{formatDate(viewingBlog.created_at)}
										</span>
									)}
								</div>

								{/* Excerpt */}
								{viewingBlog.excerpt && (
									<div>
										<h4 className="text-sm font-semibold text-gray-700 mb-2">Excerpt</h4>
										<div 
											className="prose max-w-none"
											dangerouslySetInnerHTML={{ __html: viewingBlog.excerpt }}
										/>
									</div>
								)}

								{/* Content */}
								<div>
									<h4 className="text-sm font-semibold text-gray-700 mb-2">Content</h4>
									<div 
										className="prose max-w-none"
										dangerouslySetInnerHTML={{ __html: viewingBlog.content }}
									/>
								</div>

								{/* Additional Info */}
								<div className="border-t pt-4 mt-4">
									<dl className="grid grid-cols-2 gap-4 text-sm">
										{viewingBlog.created_at && (
											<div>
												<dt className="text-gray-500">Created</dt>
												<dd className="font-medium">{formatDate(viewingBlog.created_at)}</dd>
											</div>
										)}
										{viewingBlog.updated_at && viewingBlog.updated_at !== viewingBlog.created_at && (
											<div>
												<dt className="text-gray-500">Last Updated</dt>
												<dd className="font-medium">{formatDate(viewingBlog.updated_at)}</dd>
											</div>
										)}
									</dl>
								</div>
							</div>

							<div className="flex justify-end gap-3 pt-4 mt-4 border-t">
								<button
									onClick={() => setShowViewModal(false)}
									className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
								>
									Close
								</button>
							</div>
						</div>
					</div>
				)}

				{/* Delete Confirmation Dialog - Inline */}
				{showDeleteDialog && (
					<div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
						<div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
							<div className="flex justify-between items-start mb-4">
								<div className="flex items-center gap-3">
									<div className="p-2 bg-red-100 rounded-full">
										<AlertTriangle className="text-red-600" size={24} />
									</div>
									<h3 className="text-lg font-semibold text-gray-900">
										Delete Blog
									</h3>
								</div>
								<button
									onClick={() => {
										setShowDeleteDialog(false);
										setBlogToDelete(null);
									}}
									className="p-1 hover:bg-gray-100 rounded-full transition-colors"
								>
									<X size={20} />
								</button>
							</div>

							<p className="text-gray-600 mb-6">
								Are you sure you want to delete this blog? This action cannot be undone.
							</p>

							<div className="flex justify-end gap-3">
								<button
									onClick={() => {
										setShowDeleteDialog(false);
										setBlogToDelete(null);
									}}
									className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
								>
									Cancel
								</button>
								<button
									onClick={handleDelete}
									className="px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition"
								>
									Delete
								</button>
							</div>
						</div>
					</div>
				)}
			</AdminWrapper>
		</>
	);
};

export default AdminBlog;