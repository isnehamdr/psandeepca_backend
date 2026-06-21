<?php

namespace App\Services;

use App\Models\Blog;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BlogService
{
    /**
     * Get all blogs, latest first.
     */
    public function getAll()
    {
        return Blog::latest()->get();
    }

    /**
     * Create a new blog.
     */
    public function create(array $data, ?UploadedFile $image = null): Blog
    {
        if ($image) {
            $data['image'] = $this->storeImage($image);
        }

        $data['slug'] = $this->generateUniqueSlug($data['title']);

        return Blog::create($data);
    }

    /**
     * Update an existing blog.
     */
    public function update(Blog $blog, array $data, ?UploadedFile $image = null): Blog
    {
        if ($image) {
            $this->deleteImage($blog->image);
            $data['image'] = $this->storeImage($image);
        }

        if ($blog->title !== $data['title']) {
            $data['slug'] = $this->generateUniqueSlug($data['title'], $blog->id);
        }

        $blog->update($data);

        return $blog;
    }

    /**
     * Delete a blog and its associated image.
     */
    public function delete(Blog $blog): bool
    {
        $this->deleteImage($blog->image);

        return $blog->delete();
    }

    /**
     * Store an uploaded image on the public disk.
     */
    private function storeImage(UploadedFile $image): string
    {
        return $image->store('blogs', 'public');
    }

    /**
     * Delete an image from the public disk if it exists.
     */
    private function deleteImage(?string $path): void
    {
        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }

    /**
     * Generate a unique slug for a blog, excluding the current id on updates.
     */
    private function generateUniqueSlug(string $title, ?int $excludeId = null): string
    {
        $slug = Str::slug($title);
        $originalSlug = $slug;
        $count = 1;

        while (
            Blog::where('slug', $slug)
                ->when($excludeId, fn ($q) => $q->where('id', '!=', $excludeId))
                ->exists()
        ) {
            $slug = $originalSlug . '-' . $count;
            $count++;
        }

        return $slug;
    }
}