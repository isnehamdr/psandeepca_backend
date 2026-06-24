<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Http\Requests\StoreBlogRequest;
use App\Http\Requests\UpdateBlogRequest;
use App\Services\BlogService;

class BlogController extends Controller
{
    public function __construct(private BlogService $blogService) {}

    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => $this->blogService->getAll()
        ]);
    }

    public function indexShowblogSlug(string $slug)
{
    $blog = $this->blogService->getBySlug($slug);

    if (! $blog) {
        return response()->json([
            'success' => false,
            'message' => 'Blog not found.'
        ], 404);
    }

    return response()->json([
        'success' => true,
        'data'    => $blog
    ]);
}

    public function store(StoreBlogRequest $request)
    {
        $blog = $this->blogService->create(
            $request->validated(),
            $request->file('image')
        );

        return response()->json([
            'success' => true,
            'message' => 'Blog created successfully.',
            'data'    => $blog
        ], 201);
    }


    public function update(UpdateBlogRequest $request, Blog $blog)
    {
        $blog = $this->blogService->update(
            $blog,
            $request->validated(),
            $request->file('image')
        );

        return response()->json([
            'success' => true,
            'message' => 'Blog updated successfully.',
            'data'    => $blog
        ]);
    }

    public function destroy(Blog $blog)
    {
        $this->blogService->delete($blog);

        return response()->json([
            'success' => true,
            'message' => 'Blog deleted successfully.'
        ]);
    }
}