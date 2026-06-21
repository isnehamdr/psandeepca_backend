<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'short_description',
        'description',
        'icon',
        'is_active',
        'sort_order',
        'detail',
        'image',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($service) {
            if (empty($service->slug)) {
                $slug = Str::slug($service->title);
                $originalSlug = $slug;
                $count = 1;

                while (self::where('slug', $slug)->exists()) {
                    $slug = $originalSlug . '-' . $count;
                    $count++;
                }

                $service->slug = $slug;
            }
        });

        static::updating(function ($service) {
            if ($service->isDirty('title')) {
                $slug = Str::slug($service->title);
                $originalSlug = $slug;
                $count = 1;

                while (
                    self::where('slug', $slug)
                        ->where('id', '!=', $service->id)
                        ->exists()
                ) {
                    $slug = $originalSlug . '-' . $count;
                    $count++;
                }

                $service->slug = $slug;
            }
        });
    }
}