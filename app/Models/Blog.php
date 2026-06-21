<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Blog extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'image',
        'status'
    ];


    protected static function boot()
    {
        parent::boot();

        static::creating(function ($blog) {
            $slug = Str::slug($blog->title);
            $originalSlug = $slug;
            $count = 1;

            while (self::where('slug', $slug)->exists()) {
                $slug = $originalSlug . '-' . $count;
                $count++;
            }

            $blog->slug = $slug;
        });
    }
}
