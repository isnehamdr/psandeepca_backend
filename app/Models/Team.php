<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    protected $fillable = [
        'name',
        'title',
        'instagram_link',
        'facebook_link',
        'linkedin_link',
        'person_image',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}