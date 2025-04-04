<?php

namespace App\Enums;

enum EventBookingStatus: string
{
    case PENDING = 'pending';
    case CONFIRMED = 'confirmed';
    case CANCELLED = 'cancelled';

    case NOSHOW = 'no-show';
}
