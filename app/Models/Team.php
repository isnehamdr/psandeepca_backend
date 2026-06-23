<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    protected $fillable = [
        'name',
        'title',
        'icon_image',
        'person_image',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}