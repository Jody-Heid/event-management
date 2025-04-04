<?php

namespace App\Enums;

enum EventStatusEnum: string
{
    case DRAFT = 'draft';
    case PUBLISHED = 'published';
    case CANCELLED = 'cancelled';
}
