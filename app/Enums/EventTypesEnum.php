<?php

namespace App\Enums;

enum  EventTypesEnum: string
{
    case FREE = 'free';
    case PAID = 'paid';
    case INVITEONLY = 'invite-only';
}
